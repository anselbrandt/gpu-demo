import { useEffect, useState } from "react";

export default function usePersistentState(init) {
  const [locations, setLocations] = useState(
    JSON.parse(localStorage.getItem("draw-app")) || init
  );

  useEffect(() => {
    localStorage.setItem("draw-app", JSON.stringify(locations));
  });

  return [locations, setLocations];
}
