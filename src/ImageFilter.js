import React, { useEffect } from "react";
import styles from "./App.module.css";
import { GPU } from "gpu.js";
import image_1 from "./image_1.png";

export default function ImageFilter(props) {
  const { inputRef, outputRef, width, height } = props;

  useEffect(() => {
    const canvas = outputRef.current;
    const image = inputRef.current;

    const gpu = new GPU({
      canvas: canvas,
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

    const kernel = gpu.createKernel(
      function (videoFrame) {
        if (this.thread.y < 10 && this.thread.x < 10) {
          this.color(1, 0, 0, 1);
        } else {
          const pixel = videoFrame[this.thread.y][this.thread.x];
          this.color(pixel[0], pixel[1], pixel[2], pixel[3]);
        }
      },
      {
        graphical: true,
        output: [width, height],
      }
    );

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    image.addEventListener("load", () => {
      kernel(filter(image));
    });
    return () => image.removeEventListener("load", () => kernel(filter(image)));
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
