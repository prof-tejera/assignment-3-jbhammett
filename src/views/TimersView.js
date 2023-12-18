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

const TimerTitle = styled.div``;

const TimersView = () => {
  const { timers, saveTimer, deleteTimer, handleTimerStart, handleWorkoutReset, handlePauseResume, handleFastForward} = useContext(TimersContext);
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



  // let initialSteps = CreateHash(timers);

  useEffect (() => { 
    if (timers.length > 0) {
      setWorkoutSteps(() => {
        let initialSteps = CreateHash(timers);
        // window.location.hash = encodeURIComponent(workoutSteps);
        return initialSteps;

      });
      window.location.hash = encodeURIComponent(workoutSteps);
      // window.location.hash = encodeURIComponent(initialSteps);

    }


    else {
      const hash = (window.location.hash ?? '').slice(1);
      let hashTimers = hash.split('-');
      console.log(`hashTimers ${hashTimers}`);
      const timerTypes = ['Stopwatch', 'Countdown', 'XY', 'Tabata'];
      for (let i=0; i<hashTimers.length; i++){
        if (timerTypes.includes(hashTimers[i])){
          // if (hashTimers[i] === 'Stopwatch') {
          console.log(`${hashTimers[i]} included`);
          // let selectedTimer = 'Stopwatch';
          let selectedTimer = hashTimers[i];
          let startMinutes = CalculateMinutesSeconds(parseInt(hashTimers[i+1]))[0];
          let startSeconds = CalculateMinutesSeconds(parseInt(hashTimers[i+1]))[1];
          // console.log(`hashTimers[i] ${hashTimers[i]}`);
          let rounds = '';
          let startRestMinutes = '';
          let startRestSeconds = '';
          if (selectedTimer === 'XY' || selectedTimer === 'Tabata') {
            rounds = hashTimers[i+2];
          }
  
          if (selectedTimer === 'Tabata') {
            startRestMinutes = CalculateMinutesSeconds(parseInt(hashTimers[i+3]))[0];
            startRestSeconds = CalculateMinutesSeconds(parseInt(hashTimers[i+3]))[1];
          }
  
          saveTimer({
            id: selectedTimer?.id,
            index: (timers.length === 0) ? 0 : timers.length,
            selectedTimer,
            startMinutes,
            startSeconds,
            isRunning: 'not running',
            rounds,
            startRestMinutes,
            startRestSeconds,
            
          });
          
        }
        console.log(`hashTimers 2 ${hashTimers}`);
      }
    }
  

 



    
  }, []);

  useEffect(() => {
    setWorkoutSteps(() => {
      let steps = CreateHash(timers);
        
    return steps;
  });
  window.location.hash = encodeURIComponent(workoutSteps);

}, [timers]);


  console.log(`timers.length ${timers.length}`);
  // if (timers.length > 0) {
  //   // window.location.hash = encodeURIComponent(initialSteps);
  //   window.location.hash = encodeURIComponent(workoutSteps);
  // }


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
