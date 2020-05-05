import React, { useEffect } from "react";
import styles from "./App.module.css";
import { GPU } from "gpu.js";

export default function Animation(props) {
  const { outputRef, width, height } = props;

  useEffect(() => {
    const canvas = outputRef.current;

    const gpu = new GPU({
      canvas: canvas,
      mode: "gpu",
    });

    const size = [width, height];
    const centerX = size[0] / 2;
    const centerY = size[1] / 2;

    const kernel = gpu.createKernel(
      function (x) {
        const dist = Math.sqrt(
          Math.pow(this.thread.x - this.constants.centerX, 2) +
            Math.pow(this.thread.y - this.constants.centerY, 2)
        );
        this.color(
          (Math.abs(Math.sin(this.thread.x)) * dist) / this.constants.centerX,
          (Math.abs(Math.sin(this.thread.y)) * this.constants.centerY) /
            (dist * 32),
          (Math.abs(Math.cos(x)) * dist) / 64
        );
      },
      {
        output: size,
        graphical: true,
        constants: {
          centerX,
          centerY,
          sizeX: size[0],
          sizeY: size[1],
        },
      }
    );
    let param = 0.0;
    const render = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      kernel(param);
      param += 0.005;
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(render);
    };
  }, [outputRef, width, height]);

  return (
    <div className={styles.canvasContainer}>
      <canvas
        ref={outputRef}
        style={{ backgroundColor: "ghostwhite", width: width, height: height }}
      ></canvas>
    </div>
  );
}
