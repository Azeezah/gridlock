import React, {useState, useEffect} from 'react';
import Board from './Board';

function Solution(props) {
  const [intervalId, setIntervalId] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [pauseTime, setPauseTime] = useState(Date.now());
  const [steps, setSteps] = useState(0);
  const stepsPerSecond = 2;
  const fps = 30;

  function pause() {
    clearInterval(intervalId);
    setIntervalId(null);
    setPauseTime(Date.now());
  }

  function resume() {
    console.log(props.grid.solution);
    const timeSincePause = Date.now() - pauseTime;
    const newStartTime = startTime + timeSincePause;
    setStartTime(newStartTime);

    setIntervalId(setInterval(() => {
      if (steps > props.grid.solution.length) {
        pause();
      }
      const secsElapsed = (Date.now() - newStartTime)/1000;
      setSteps(Math.floor(secsElapsed * stepsPerSecond));
    }, 1000/fps));
  }
  useEffect(resume, []);

  return (<Board grid={props.grid.data}
                 moves={props.grid.solution.slice(0, steps)}
                 frozen={true} />);
}

export default Solution;
