import React from "react";
import styles from "./App.module.css";
import test from "./test.mp4";

export default function InputCanvas(props) {
  const { inputRef, width, height } = props;

  return (
    <div className={styles.canvasContainer}>
      <video
        ref={inputRef}
        width={width}
        height={height}
        style={{ backgroundColor: "ghostwhite" }}
        id="video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={test} type="video/mp4" />
      </video>
    </div>
  );
}
