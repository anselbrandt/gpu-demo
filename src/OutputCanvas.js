import React, { useEffect } from "react";
import styles from "./App.module.css";
import { GPU } from "gpu.js";

export default function OutputCanvas(props) {
  const { outputRef, width, height } = props;

  useEffect(() => {
    const ref = outputRef.current;
    const gpu = new GPU({ mode: "gpu" });

    const render = gpu
      .createKernel(function () {
        this.color(0, 0, 0, 1);
      })
      .setOutput([width, height])
      .setGraphical(true);

    render();
    const canvas = render.canvas;
    ref.appendChild(canvas);
    return () => {
      ref.removeChild(canvas);
    };
  });

  return (
    <div className={styles.canvasContainer}>
      <div
        ref={outputRef}
        width={width}
        height={height}
        style={{ backgroundColor: "ghostwhite" }}
      ></div>
    </div>
  );
}
