import React, { useEffect } from "react";
import styles from "./App.module.css";
import image_1 from "./image_1.png";

export default function ImageFilter(props) {
  const { inputRef, outputRef, flowRef, width, height } = props;

  useEffect(() => {
    const imageElement = inputRef.current;
    const canvasElement = outputRef.current;
    const pixelImage = flowRef.current;

    canvasElement.width = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;

    pixelImage.width = pixelImage.clientWidth;
    pixelImage.height = pixelImage.clientHeight;

    const img = new Image();
    img.src = "/image_1.png";
    const context = canvasElement.getContext("2d");
    const pixelContext = pixelImage.getContext("2d");
    img.onload = function () {
      context.drawImage(img, 0, 0, width, height);
      const imgData = context.getImageData(0, 0, width, height).data;
      const data = new ImageData(new Uint8ClampedArray(imgData), width, height);
      pixelContext.putImageData(data, 0, 0);
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
