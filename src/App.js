import React, { useRef } from "react";
import styles from "./App.module.css";
import useGetViewport from "./useGetViewport";
import PaintedCanvas from "./PaintedCanvas";

function App() {
  const inputRef = useRef();
  const inputRef2 = useRef();
  const outputRef = useRef();
  const outputRef2 = useRef();
  const flowRef = useRef();
  const { width } = useGetViewport();

  return (
    <div className={styles.app}>
      <PaintedCanvas
        inputRef={inputRef}
        inputRef2={inputRef2}
        outputRef={outputRef}
        outputRef2={outputRef2}
        flowRef={flowRef}
        width={parseInt(width * 0.33)}
        height={parseInt(width * 0.33 * 0.75)}
      />
    </div>
  );
}

export default App;
