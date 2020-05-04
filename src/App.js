import React, { useRef } from "react";
import styles from "./App.module.css";
import InputCanvas from "./InputCanvas";
import OutputCanvas from "./OutputCanvas";
//import DrawHooks from "./DrawHooks";
import useGetViewport from "./useGetViewport";
//import usePersistentState from "./usePersistantState";

function App() {
  const inputRef = useRef();
  const outputRef = useRef();
  const { width } = useGetViewport();

  // const [locations, setLocations] = usePersistentState([]);

  // function handleCanvasClick(e) {
  //   const rect = e.target.getBoundingClientRect();
  //   const x = e.clientX - rect.left;
  //   const y = e.clientY - rect.top;
  //   setLocations([...locations, { x: x, y: y }]);
  //   console.log(x, y);
  //   console.log(locations);
  // }

  // function handleClear() {
  //   setLocations([]);
  // }

  // function handleUndo() {
  //   setLocations(locations.slice(0, -1));
  // }

  return (
    <div className={styles.app}>
      <div className={styles.canvasesContainer}>
        <div className={styles.canvases}>
          <InputCanvas
            inputRef={inputRef}
            width={width * 0.49}
            height={width * 0.49 * 0.75}
          />
          {/* <DrawHooks
            outputRef={outputRef}
            width={width * 0.49}
            locations={locations}
            handleCanvasClick={handleCanvasClick}
          /> */}
          <OutputCanvas
            outputRef={outputRef}
            width={width * 0.49}
            height={width * 0.49 * 0.75}
          />
        </div>
      </div>
      {/* <span>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleUndo}>Undo</button>
      </span> */}
    </div>
  );
}

export default App;
