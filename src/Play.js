import React, {useState, useEffect} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Firestore from './services/firestore.js';
import Board from './Board';
import Solution from './Solution';
import './Play.css';
import Leaderboard from './Leaderboard';

const useStyles = makeStyles({
  controlButtons: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    color: '#777',
  }
});

function Play(props) {
  const classes = useStyles();
  const {gridId, ...other} = props;
  const [timeSec, setTimeSec] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [intervalId, setIntervalId] = useState(null);
  const [grid, setGrid] = useState(null);
  const [highscores, setHighscores] = useState(null);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const helpMessage = "Use the arrow keys to fill the grid!";
  const [playedFirstMove, setPlayedFirstMove] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const default_grid ={
    title: "Armada",
    creatorDisplayName: "Jeremy",
    data: [
      ["1", "1", "1", "1"],
      ["1", "1", "S", "1"],
      ["0", "0", "1", "1"],
      ["0", "0", "F", "0"]
    ],
    solution: [
      [2,1],[1,1],[0,1],[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[2,2],[2,3]
    ],
  };

  function stopTimer() {
    clearInterval(intervalId);
    return Date.now() - startTime;
  }

  function startTimer() {
    setIntervalId(setInterval(() => {
      setTimeSec(Math.floor(Date.now()/1000 - startTime/1000));
    }, 1000));
  }
  useEffect(startTimer, []);

  async function finishGame() {
    console.log("Finished game.");
    const score_sec = stopTimer();
    setFinished(true);
    setScore(score_sec);
    if (!props.user || !gridId) {
      console.log("Cannot upload score without logging in.");
      return;
    }
    const score_obj = await Firestore.add.score(props.user.id, gridId, score_sec);
    if (!score_obj) {
      // Todo: Surface error to user.
      console.log("Couldn't upload score.");
    } else {
      console.log("Uploaded score.")
    }
  }

  async function loadGrid() {
    if (gridId) {
      const grid_obj = await Firestore.get.gridForUnregisteredUser(gridId);
      if (grid_obj) {
        setGrid(grid_obj);
        return;
      }
    } else {
      // Load random grid.
      const grids = await Firestore.get.trendingGridsForUnregisteredUser();
      if (grids !== null && grids.length > 0) {
        const randomGrid = grids[Math.floor(Math.random()*grids.length)];
        setGrid(randomGrid);
        return;
      }
    }
    console.log("Failed to load grid, using default_grid.");
    setGrid(default_grid);
  }

  async function loadHighscores() {
    if (gridId) {
      const scores = await Firestore.get.topFiveScoresForGrid(gridId);
      if (scores) {
        setHighscores(scores);
        return;
      }
    }
    console.log("Failed to load highscores.");
  }

  // useEffect shouldn't be called with async functions since they return a
  // promise and useEffect expects a cleanup callback if anything.
  useEffect(()=>{loadGrid()}, []);
  useEffect(()=>{loadHighscores()}, []);

  function checkFirstMove(e) {
    if (e.key.startsWith("Arrow")) { setPlayedFirstMove(true)};
  }
  document.addEventListener("keydown", checkFirstMove);

  function restart() {
    window.location = window.location;  // Refresh page.
  }

  function giveup() {
    setShowSolution(true);
    stopTimer();
  }

  return (<>
    { grid ?
      <div className="play-header">
        <div className="grid-title">{grid.title}</div>
        <div className="grid-creator">by {grid.creatorDisplayName}</div>
      </div> : "" }
    <div className="play-component">
      <div className="trophy"></div>
      <div>
        {
          showSolution
          ? <Solution grid={grid} />
          : grid // Wait until grid is loaded to render it.
            ? <Board grid={grid.data} finishGame={finishGame} />
            : <></>
        }
      </div>
      <div className="stopwatch">
        <div className="stopwatch-display">
          {Math.floor(timeSec / 60)} : {("0"+timeSec%60).substr(-2)}
        </div>
      </div>
    </div>
    { finished ? <Leaderboard user={props.user} solveTimeMilliseconds={score} highscores={highscores} /> : "" }
    { playedFirstMove
        ? <div className={classes.controlButtons}>
            { !showSolution
              ? <Button onClick={restart}>Restart</Button>
              : <></> }
            { !showSolution && grid && grid.solution
              ? <Button onClick={giveup}>Give Up</Button>
              : <></> }
          </div>
        : <div className="help"> {helpMessage} </div> }
  </>);
}

 export default Play;
