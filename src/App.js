import React, { useRef } from "react";
import styles from "./App.module.css";
import useGetViewport from "./useGetViewport";
import PaintedCanvas from "./PaintedCanvas";

function App() {
  const inputRef = useRef();
  const outputRef = useRef();
  const flowRef = useRef();
  const { width } = useGetViewport();

  return (
    <div className={styles.app}>
      <div className={styles.canvasesContainer}>
        <div className={styles.canvases}>
          <PaintedCanvas
            inputRef={inputRef}
            outputRef={outputRef}
            flowRef={flowRef}
            width={parseInt(width * 0.33)}
            height={parseInt(width * 0.33 * 0.75)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
