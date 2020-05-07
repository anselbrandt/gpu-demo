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

    const filter = gpu.createKernelMap(
      function (videoFrame) {
        const pixel = videoFrame[this.thread.y][this.thread.x];
        const gray = 0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2];
        this.color(gray, gray, gray, pixel[3]);
      },
      {
        graphical: true,
        output: [width, height],
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

    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      filter(video);
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
