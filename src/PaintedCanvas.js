import React, { useEffect } from "react";
import styles from "./App.module.css";
import { GPU, input } from "gpu.js";
import image_1 from "./image_1.png";
import image_2 from "./image_1.png";

export default function ImageFilter(props) {
  const {
    inputRef,
    inputRef2,
    outputRef,
    outputRef2,
    flowRef,
    width,
    height,
  } = props;

  useEffect(() => {
    const image = inputRef.current;
    const image2 = inputRef2.current;
    const canvas = outputRef.current;
    const canvas2 = outputRef2.current;
    const flowCanvas = flowRef.current;
    const context = canvas.getContext("webgl");
    const context2 = canvas2.getContext("webgl");
    const flowContext = flowCanvas.getContext("2d");

    const gpu = new GPU({
      canvas: canvas,
      context: context,
      mode: "gpu",
    });

    const filter = gpu.createKernelMap(
      function (image) {
        let pixel = image[this.thread.y][this.thread.x];
        const gray = 0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2];
        this.color(gray, gray, gray, pixel[3]);
      },
      {
        graphical: true,
        output: [width, height],
        pipeline: true,
      }
    );

    const gpu2 = new GPU({
      canvas: canvas2,
      context: context2,
      mode: "gpu",
    });

    const filter2 = gpu2.createKernelMap(
      function (image) {
        let pixel = image[this.thread.y][this.thread.x];
        const gray = 0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2];
        this.color(gray, gray, gray, pixel[3]);
      },
      {
        graphical: true,
        output: [width, height],
        pipeline: true,
      }
    );

    // const flowGpu = new GPU({
    //   canvas: flowCanvas,
    //   context: flowContext,
    //   mode: "gpu",
    // });

    // const flowFilter = flowGpu.createKernel(
    //   function (image) {
    //     const pixel = image[this.thread.y][this.thread.x];
    //     if (pixel[0] === 1 && pixel[1] === 1 && pixel[2] === 1) {
    //       this.color(1, 0, 0, pixel[3]);
    //     } else {
    //       this.color(pixel[0], pixel[1], pixel[2], pixel[3]);
    //     }
    //   },
    //   {
    //     graphical: true,
    //     output: [width, height],
    //   }
    // );

    const kernels = {
      edgeDetection: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
      gaussBlur: [
        1 / 16,
        2 / 16,
        1 / 16,
        2 / 16,
        4 / 16,
        2 / 16,
        1 / 16,
        2 / 16,
        1 / 16,
      ],
    };

    const convolution = gpu.createKernel(
      function (src, width, height, kernel, kernelRadius) {
        const kSize = 2 * kernelRadius + 1;
        let r = 0,
          g = 0,
          b = 0;

        let i = -kernelRadius;
        let kernelOffset = 0;
        while (i <= kernelRadius) {
          if (this.thread.x + i < 0 || this.thread.x + i >= width) {
            i++;
            continue;
          }

          let j = -kernelRadius;
          while (j <= kernelRadius) {
            if (this.thread.y + j < 0 || this.thread.y + j >= height) {
              j++;
              continue;
            }

            kernelOffset = (j + kernelRadius) * kSize + i + kernelRadius;
            const weights = kernel[kernelOffset];
            const pixel = src[this.thread.y + i][this.thread.x + j];
            r += pixel.r * weights;
            g += pixel.g * weights;
            b += pixel.b * weights;
            j++;
          }
          i++;
        }
        this.color(r, g, b);
      },
      {
        graphical: true,
        output: [width, height],
      }
    );

    const convolution2 = gpu2.createKernel(
      function (src, width, height, kernel, kernelRadius) {
        const kSize = 2 * kernelRadius + 1;
        let r = 0,
          g = 0,
          b = 0;

        let i = -kernelRadius;
        let kernelOffset = 0;
        while (i <= kernelRadius) {
          if (this.thread.x + i < 0 || this.thread.x + i >= width) {
            i++;
            continue;
          }

          let j = -kernelRadius;
          while (j <= kernelRadius) {
            if (this.thread.y + j < 0 || this.thread.y + j >= height) {
              j++;
              continue;
            }

            kernelOffset = (j + kernelRadius) * kSize + i + kernelRadius;
            const weights = kernel[kernelOffset];
            const pixel = src[this.thread.y + i][this.thread.x + j];
            r += pixel.r * weights;
            g += pixel.g * weights;
            b += pixel.b * weights;
            j++;
          }
          i++;
        }
        this.color(r, g, b);
      },
      {
        graphical: true,
        output: [width, height],
      }
    );

    const kernel = kernels.edgeDetection;
    const kernelRadius = (Math.sqrt(kernel.length) - 1) / 2;

    const render = () => {
      convolution(filter(image), width, height, kernel, kernelRadius);
      convolution2(filter2(image2), width, height, kernel, kernelRadius);
      const pixels = convolution2.getPixels();
      const imagePixels = new ImageData(pixels, width, height);
      const pixelsArray = Array.from(pixels);
      const pixelsFloat = pixelsArray.map((value) => value / 255);
      const pixelsInput = input(new Float32Array(pixelsFloat), [
        width,
        height,
        4,
      ]);
      console.log(pixelsInput);
      // flowContext.viewport(
      //   0,
      //   0,
      //   flowContext.drawingBufferWidth,
      //   flowContext.drawingBufferHeight
      // );
      flowCanvas.width = width;
      flowCanvas.height = height;
      flowContext.width = width;
      flowContext.height = height;
      console.log("dimensions: ", width, height);
      console.log("context: ", flowContext.width, flowContext.height);
      console.log("canvas: ", flowCanvas.width, flowCanvas.height);
      flowContext.putImageData(imagePixels, 0, 0, 0, 0, width, height);
      //requestAnimationFrame(render);
    };

    image.addEventListener("load", () => {
      //requestAnimationFrame(render);
      render();
    });
    return () =>
      image.removeEventListener("load", () => {
        //cancelAnimationFrame(render)
        render();
      });
  }, [inputRef, inputRef2, outputRef, outputRef2, flowRef, width, height]);

  return (
    <React.Fragment>
      <div className={styles.canvasesContainer}>
        <div className={styles.canvases}>
          <div className={styles.canvasContainer}>
            <img
              ref={inputRef}
              style={{
                backgroundColor: "ghostwhite",
                width: width,
                height: height,
              }}
              src={image_1}
              alt={"image_1"}
            ></img>
          </div>
          <div className={styles.canvasContainer}>
            <img
              ref={inputRef2}
              style={{
                backgroundColor: "ghostwhite",
                width: width,
                height: height,
              }}
              src={image_2}
              alt={"image_2"}
            ></img>
          </div>
        </div>
      </div>
      <div className={styles.canvasesContainer}>
        <div className={styles.canvases}>
          <div className={styles.canvasContainer}>
            <canvas
              ref={outputRef}
              style={{
                backgroundColor: "ghostwhite",
                width: width,
                height: height,
              }}
            ></canvas>
          </div>
          <div className={styles.canvasContainer}>
            <canvas
              ref={outputRef2}
              style={{
                backgroundColor: "ghostwhite",
                width: width,
                height: height,
              }}
            ></canvas>
          </div>
        </div>
      </div>
      <div className={styles.canvasesContainer}>
        <div className={styles.canvases}>
          <div className={styles.canvasContainer}>
            <canvas
              ref={flowRef}
              style={{
                backgroundColor: "ghostwhite",
                width: width,
                height: height,
              }}
            ></canvas>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
