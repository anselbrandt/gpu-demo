import React, { useEffect, useRef } from "react";
import styles from "./App.module.css";
import { GPU } from "gpu.js";
import image_1 from "./image_1.png";

export default function ImageFilter(props) {
  const { inputRef, outputRef, width, height } = props;
  const renders = useRef(1);

  useEffect(() => {
    console.log("Renders: ", renders.current++);

    const canvas = outputRef.current;
    const image = inputRef.current;

    const gpu = new GPU({
      canvas: canvas,
      mode: "gpu",
    });

    const filter = gpu.createKernelMap(
      function (image) {
        const pixel = image[this.thread.y][this.thread.x];
        const gray = 0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2];
        this.color(gray, gray, gray, pixel[3]);
      },
      {
        graphical: true,
        output: [width, height],
      }
    );

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    filter(image);
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
