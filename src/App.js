import React, { useRef } from "react";
import styles from "./App.module.css";
import useGetViewport from "./useGetViewport";
import OpticFlow from "./OpticFlow";

function App() {
  const inputRef = useRef();
  const outputRef = useRef();
  const flowRef = useRef();
  const { width } = useGetViewport();

  return (
    <div className={styles.app}>
      <div className={styles.canvasesContainer}>
        <div className={styles.canvases}>
          <OpticFlow
            inputRef={inputRef}
            outputRef={outputRef}
            flowRef={flowRef}
            width={width * 0.33}
            height={width * 0.33 * 0.75}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
