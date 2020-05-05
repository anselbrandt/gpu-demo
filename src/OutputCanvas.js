import React, { useEffect } from "react";
import styles from "./App.module.css";

export default function OutputCanvas(props) {
  const { outputRef, width, height } = props;

  useEffect(() => {
    const canvas = outputRef.current;
    const context = canvas.getContext("2d");
    let requestId,
      i = 0;
    const render = () => {
      context.clearRect(0, 0, width, height);
      context.beginPath();
      context.arc(
        width / 2,
        height / 2,
        (width / 4) * Math.abs(Math.cos(i)),
        0,
        2 * Math.PI
      );
      context.fill();
      i += 0.025;
      requestAnimationFrame(render);
    };
    render();
    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [outputRef, width, height]);

  return (
    <div className={styles.canvasContainer}>
      <canvas
        ref={outputRef}
        width={width}
        height={0.75 * width}
        style={{ backgroundColor: "ghostwhite" }}
      ></canvas>
    </div>
  );
}
