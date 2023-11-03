import React from "react";

function useInterval(callback, delay, refresh) {
  const savedCallback = React.useRef();

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null && !refresh) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, refresh]);
}

export default useInterval;
