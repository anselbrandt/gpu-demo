import React, { useRef } from "react";
import styles from "./App.module.css";
//import InputCanvas from "./InputCanvas";
import OutputCanvas from "./OutputCanvas";
import useGetViewport from "./useGetViewport";

function App() {
  const inputRef = useRef();
  const outputRef = useRef();
  const { width } = useGetViewport();

  return (
    <div className={styles.app}>
      <div className={styles.canvasesContainer}>
        <div className={styles.canvases}>
          {/* <InputCanvas
            inputRef={inputRef}
            width={width * 0.49}
            height={width * 0.49 * 0.75}
          /> */}
          <OutputCanvas
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
