import React, { useEffect, useState } from "react";
import { GPU } from "gpu.js";

import styles from "./App.module.css";

export default function ImageFilter(props) {
  const { inputRef, outputRef, flowRef, width, height } = props;

  useEffect(() => {
    const imageElement1 = inputRef.current;
    const imageElement2 = outputRef.current;
    const flowElement = flowRef.current;

    imageElement1.width = imageElement1.clientWidth;
    imageElement1.height = imageElement1.clientHeight;

    imageElement2.width = imageElement2.clientWidth;
    imageElement2.height = imageElement2.clientHeight;

    flowElement.width = flowElement.clientWidth;
    flowElement.height = flowElement.clientHeight;

    const context1 = imageElement1.getContext("2d");
    const context2 = imageElement2.getContext("2d");
    const flowContext = flowElement.getContext("2d");

    const img1 = new Image();
    const img2 = new Image();
    img1.src = "/image_1.png";
    img2.src = "/image_2.png";

    img1.onload = () => {
      context1.drawImage(img1, 0, 0, width, height);
      const img1Data = context1.getImageData(0, 0, width, height);
      img2.onload = () => {
        context2.drawImage(img2, 0, 0, width, height);
        const img2Data = context2.getImageData(0, 0, width, height);
        flowContext.putImageData(img1Data, 0, 0);
      };
    };
  }, [inputRef, outputRef, flowRef, width, height]);

  return (
    <React.Fragment>
      <div className={styles.canvasContainer}>
        <canvas
          ref={inputRef}
          style={{
            backgroundColor: "ghostwhite",
            width: width,
            height: height,
          }}
        ></canvas>
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
    </React.Fragment>
  );
}
