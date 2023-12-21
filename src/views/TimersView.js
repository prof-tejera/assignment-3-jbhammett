import React from "react";
import { useContext, useEffect } from "react";
import { ErrorBoundary } from 'react-error-boundary';
import styled from "styled-components";

import Stopwatch from "../components/timers/Stopwatch";
import Countdown from "../components/timers/Countdown";
import XY from "../components/timers/XY";
import Tabata from "../components/timers/Tabata";

import Button from "../components/generic/Button";
import DisplayTime from "../components/generic/DisplayTime";

import { TimersContext } from "../utils/TimersProvider";
import { Editor } from "../views/AddTimersView";
import { CalculateTotalSeconds, CalculateMinutesSeconds, CreateHash } from "../utils/helpers";


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


function MyFallbackComponent({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

const TimersView = () => {
  const { timers, editTimer, setEditTimer, totalTime, setTotalTime, hash, setHash, deleteTimer, handleTimerStart, handleWorkoutReset, handlePauseResume, handleFastForward, setTimers} = useContext(TimersContext);


  useEffect (() => {
    if (timers.length > 0){
      setHash(()=>{
        return CreateHash(timers);
      });
  }  

  }, []); // eslint-disable-line

 
  
  window.location.hash = encodeURIComponent(hash);

  

  const timersDisplay = []
  for (let i=0; i<timers.length; i++){
    if (timers[i].selectedTimer === 'Stopwatch'){
      timersDisplay.push({title: "Stopwatch", id: timers[i].id, index: i, C: <Stopwatch id={timers[i].id} index={i} startMinutes={timers[i].startMinutes} startSeconds={timers[i].startSeconds} isRunning={timers[i].isRunning} description={timers[i].description} />})
    }
    else if (timers[i].selectedTimer === 'Countdown'){
      timersDisplay.push({title: "Countdown", id: timers[i].id, index: i, C: <Countdown id={timers[i].id} index={i} startMinutes={timers[i].startMinutes} startSeconds={timers[i].startSeconds} isRunning={timers[i].isRunning} description={timers[i].description} />})
    }
    else if (timers[i].selectedTimer === 'XY'){
      timersDisplay.push({title: "XY", id: timers[i].id, index: i,  C: <XY id={timers[i].id} index={i} startMinutes={timers[i].startMinutes} startSeconds={timers[i].startSeconds} rounds={timers[i].rounds} isRunning={timers[i].isRunning} description={timers[i].description} />})
    }
    else if (timers[i].selectedTimer === 'Tabata'){
      timersDisplay.push({title: "Tabata", id: timers[i].id, index: i, C: <Tabata id={timers[i].id} index={i} startMinutes={timers[i].startMinutes} startSeconds={timers[i].startSeconds} rounds={timers[i].rounds} startRestMinutes={timers[i].startRestMinutes} startRestSeconds={timers[i].startRestSeconds} isRunning={timers[i].isRunning} description={timers[i].description} />})
    }

  }


  useEffect (() => {
    setTotalTime(() => {
      let total = 0;
      let rounds = 1;
      for (let i=0; i<timers.length; i++){
          if (timers[i].rounds) {
            rounds = timers[i].rounds;
          }
          else {
            rounds = 1;
          }
          
          const workTime = rounds * (CalculateTotalSeconds(timers[i].startMinutes, timers[i].startSeconds));
          const restTime = rounds * (CalculateTotalSeconds(timers[i].startRestMinutes, timers[i].startRestSeconds));
          total = total + workTime + restTime;
      }
     
      return total;
    });
  }, [timers]) // eslint-disable-line

  const moveTimerUp = (timer, timers) => {
    if (timer >= 0) {
      const newTimers = [];

      let newIndex = timer - 1;

      const tempTimer = timers[newIndex];
      const currentTimer = timers[timer];
      tempTimer.index = timer;
      currentTimer.index = newIndex;
   
      for (let i=0; i<timers.length; i++) {

        if ((i===newIndex) && ((newIndex) >= 0)){

          console.log(`currentTimer index ${currentTimer.index}`);
          newTimers.push(currentTimer);
          console.log(`newTimers ${newTimers[i]}`);
      
          newTimers.push(tempTimer);
          i = i+1;
          
        }
        else if (timers[i].selectedTimer !== timers[timer].selectedTimer) {
          newTimers.push(timers[i]);
        }
      }
      
      setTimers(newTimers);
      
      setHash(()=>{
        return CreateHash(timers);
      });
    }
  }

  const moveTimerDown = (timer, timers) => {
    if (timer < timers.length -1) {
      const newTimers = [];

      let newIndex = timer + 1;

      const tempTimer = timers[newIndex];
      const currentTimer = timers[timer];
      tempTimer.index = timer;
      currentTimer.index = newIndex;
   
      for (let i=0; i<timers.length; i++) {

        if ((i===timer) && (timer < timers.length)){
          newTimers.push(tempTimer);
          newTimers.push(currentTimer);
      
          
          i = i+1;
          
        }
        else if (timers[i].selectedTimer !== timers[timer].selectedTimer) {
          newTimers.push(timers[i]);
        }
      }
      
      setTimers(newTimers);
      
      setHash(()=>{
        return CreateHash(timers);
      });
    }
  }

  return (
    <ErrorBoundary fallback={<div>Something Failed</div>} FallbackComponent={MyFallbackComponent}>

      <div>
        <Button value="Start Workout" color='#aaa0ff' onClick={handleTimerStart} />
        <Button value="Reset" color='#aaa0ff' onClick={handleWorkoutReset} />
        <Button value="Pause/Resume" color='#aaa0ff' onClick={handlePauseResume} />
        <Button value="Fast Forward" color='#aaa0ff' onClick={handleFastForward} />
        <h2>Total Workout Time </h2>
        <DisplayTime minutes={CalculateMinutesSeconds(totalTime)[0]} seconds={CalculateMinutesSeconds(totalTime)[1]} />

        <Timers>
        {editTimer && <Editor editorTimer={editTimer} />}
          {timersDisplay.map((timer) => (
            <div key={timer.index}>
              <Timer >
                {timer.C}
              </Timer>

              <Button value="Edit" color="#aaa0ff" onClick={() => setEditTimer(timer)}/>

              <Button value="Delete" color="#aaa0ff" onClick={() => {
                      deleteTimer({ id: timer.id });
                    }} />
              {(timer.index > 0) && <button onClick={() => { moveTimerUp(timer.index, timers)}}>Move Up</button>}
              {(timer.index < timers.length -1) && <button onClick={() => { moveTimerDown(timer.index, timers)}}>Move Down</button>}
                    
            </div>
            
          ))}
        </Timers>
        
      </div>
  </ErrorBoundary>
)};

export default TimersView;
