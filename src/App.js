import React, { useRef } from "react";
import styles from "./App.module.css";
import useGetViewport from "./useGetViewport";
import Combined from "./Combined";

function App() {
  const inputRef = useRef();
  const inputRef2 = useRef();
  const outputRef = useRef();
  const outputRef2 = useRef();
  const flowRef = useRef();
  const { width } = useGetViewport();

  return (
    <div className={styles.app}>
      <Combined
        inputRef={inputRef}
        inputRef2={inputRef2}
        outputRef={outputRef}
        outputRef2={outputRef2}
        flowRef={flowRef}
        width={parseInt(width * 0.49)}
        height={parseInt(width * 0.49 * 0.75)}
      />
    </div>
  );
}

export default App;
