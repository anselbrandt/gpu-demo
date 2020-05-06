import React, { useRef } from "react";
import styles from "./App.module.css";
//import Convolution from "./Convolution";
import useGetViewport from "./useGetViewport";
import Combined from "./Combined";

function App() {
  const inputRef = useRef();
  const outputRef = useRef();
  const { width } = useGetViewport();

  return (
    <div className={styles.app}>
      <div className={styles.canvasesContainer}>
        <div className={styles.canvases}>
          {/* <Convolution
            inputRef={inputRef}
            outputRef={outputRef}
            width={width * 0.49}
            height={width * 0.49 * 0.75}
          /> */}
          <Combined
            inputRef={inputRef}
            outputRef={outputRef}
            width={width * 0.49}
            height={width * 0.49 * 0.75}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
