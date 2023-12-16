import React from "react";
import { useContext, useState, useEffect } from "react";
import styled from "styled-components";

import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";

import Button from "../components/generic/Button";
import DisplayTime from "../components/generic/DisplayTime";

import { TimersContext } from "../utils/TimersProvider";
import { CalculateTotalSeconds, CalculateMinutesSeconds } from "../utils/helpers";


const Timers = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Timer = styled.div`
  border: 1px solid gray;
  padding: 20px;
  margin: 10px;
  font-size: 1.5rem;
`;

const TimerTitle = styled.div``;

const TimersView = () => {
  const { timers, deleteTimer, handleTimerStart, handleWorkoutReset, handlePauseResume, handleFastForward} = useContext(TimersContext);
  const [ workoutSteps, setWorkoutSteps ] = useState(() => { 
    const hash = (window.location.hash ?? '').slice(1);
    return decodeURIComponent(hash);
  });
  
  let totalTime = 0;
  const timersDisplay = []
  for (let i=0; i<timers.length; i++){
    if (timers[i].selectedTimer === 'Stopwatch'){
      timersDisplay.push({title: "Stopwatch", id: timers[i].id, C: <Stopwatch id={timers[i].id} index={i} startMinutes={timers[i].startMinutes} startSeconds={timers[i].startSeconds} isRunning={timers[i].isRunning} />})
    }
    else if (timers[i].selectedTimer === 'Countdown'){
      timersDisplay.push({title: "Countdown", id: timers[i].id, index: i, C: <Countdown id={timers[i].id} index={i} startMinutes={timers[i].startMinutes} startSeconds={timers[i].startSeconds} isRunning={timers[i].isRunning} />})
    }
    else if (timers[i].selectedTimer === 'XY'){
      timersDisplay.push({title: "XY", id: timers[i].id, index: i,  C: <XY id={timers[i].id} index={i} startMinutes={timers[i].startMinutes} startSeconds={timers[i].startSeconds} rounds={timers[i].rounds} isRunning={timers[i].isRunning} />})
    }
    else if (timers[i].selectedTimer === 'Tabata'){
      timersDisplay.push({title: "Tabata", id: timers[i].id, index: i, C: <Tabata id={timers[i].id} index={i} startMinutes={timers[i].startMinutes} startSeconds={timers[i].startSeconds} rounds={timers[i].rounds} startRestMinutes={timers[i].startRestMinutes} startRestSeconds={timers[i].startRestSeconds} isRunning={timers[i].isRunning} />})
    }

    const currentTimerTime = CalculateTotalSeconds(timers[i].startMinutes, timers[i].startSeconds);
    totalTime = totalTime + currentTimerTime;

  }

  useEffect(() => {
    setWorkoutSteps(() => {
      let steps = '';
    
        for (let i=0; i<timers.length; i++) {
          let time = CalculateTotalSeconds(timers[i].startMinutes, timers[i].startSeconds);
          steps += timers[i].selectedTimer + 'Time' + time;
          if (timers[i].rounds) {
            workoutSteps += 'Rounds' + timers[i].rounds;
          }
          if (timers[i].startRestMinutes || timers[i].startRestSeconds) {
            let restTime = CalculateTotalSeconds(timers[i].startRestMinutes, timers[i].startRestSeconds);
            steps += 'Rest' + restTime;
          }
        }
        
    return steps;
  });
  window.location.hash = encodeURIComponent(workoutSteps);

}, [timers]);
  




  return (

    <div>
      <Button value="Start Workout" color='#aaa0ff' onClick={handleTimerStart} />
      <Button value="Reset" color='#aaa0ff' onClick={handleWorkoutReset} />
      <Button value="Pause/Resume" color='#aaa0ff' onClick={handlePauseResume} />
      <Button value="Fast Forward" color='#aaa0ff' onClick={handleFastForward} />
      <h2>Total Workout Time </h2>
      <DisplayTime minutes={CalculateMinutesSeconds(totalTime)[0]} seconds={CalculateMinutesSeconds(totalTime)[1]} />

      <Timers>
        {timersDisplay.map((timer) => (
          <div key={timer.index}>
            <Timer >
              {timer.C}
            </Timer>
            <Button value="Delete Timer" onClick={() => {
                    deleteTimer({ id: timer.id });
                  }} />
                 
                  
          </div>
        ))}
      </Timers>
    </div>
  );
};

export default TimersView;
