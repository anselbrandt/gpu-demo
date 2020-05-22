import React, { useEffect } from "react";
import styles from "./App.module.css";
import { GPU } from "gpu.js";
import image_1 from "./image_1.png";

export default function ImageFilter(props) {
  const { inputRef, outputRef, width, height } = props;

  useEffect(() => {
    const image = inputRef.current;
    const canvas = outputRef.current;
    const context = canvas.getContext("webgl");
    console.log(context);
    console.log(height, width);

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

    const kernel = kernels.edgeDetection;
    const kernelRadius = (Math.sqrt(kernel.length) - 1) / 2;

    const render = () => {
      context.viewport(
        0,
        0,
        context.drawingBufferWidth,
        context.drawingBufferHeight
      );
      convolution(filter(image), width, height, kernel, kernelRadius);
      requestAnimationFrame(render);
    };

    image.addEventListener("load", () => {
      requestAnimationFrame(render);
    });
    return () =>
      image.removeEventListener("load", () => cancelAnimationFrame(render));
  }, [inputRef, outputRef, width, height]);

  return (
    <React.Fragment>
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
        <canvas
          ref={outputRef}
          style={{
            backgroundColor: "ghostwhite",
            width: width,
            height: height,
          }}
        ></canvas>
      </div>
    </React.Fragment>
  );
}
