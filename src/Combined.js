import React, { useEffect } from "react";
import styles from "./App.module.css";
import { GPU } from "gpu.js";
import test from "./test.mp4";

export default function Filter(props) {
  const { inputRef, outputRef, width, height } = props;

  useEffect(() => {
    const canvas = outputRef.current;
    const video = inputRef.current;

    const gpu = new GPU({
      canvas: canvas,
      mode: "gpu",
    });

    const filter = gpu.createKernel(
      function (videoFrame) {
        const pixel = videoFrame[this.thread.y][this.thread.x];
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
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      convolution(filter(video), width, height, kernel, kernelRadius);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(render);
    };
  }, [inputRef, outputRef, width, height]);

  return (
    <React.Fragment>
      <div className={styles.canvasContainer}>
        <video
          ref={inputRef}
          width={width}
          height={height}
          style={{ backgroundColor: "ghostwhite" }}
          id="video"
          src={test}
          type="video/mp4"
          autoPlay
          loop
          muted
          playsInline
          controls
        ></video>
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
