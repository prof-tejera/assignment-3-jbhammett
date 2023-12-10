import React from "react";
import {  useContext, useRef, useState, useEffect } from 'react';

import DisplayTime from "../generic/DisplayTime";
import Panel from "../generic/Panel";
import { CalculateMinutesSeconds, CalculateTotalSeconds } from "../../utils/helpers";
import { TimersContext } from "../../utils/TimersProvider";


const Stopwatch = ({id, index, startMinutes, startSeconds, isRunning }) =>  {
    const { currentIndex, setCurrentIndex, running, setRunning } = useContext(TimersContext);
    const [counter, setCounter] = useState(0);
    const secondsCountInterval = useRef(0);
    const totalSeconds = useRef(CalculateTotalSeconds(startMinutes, startSeconds));
    

    if (index === currentIndex){
        isRunning = 'running';
    }
    else if (index < currentIndex){
        isRunning = 'completed';
    }
    else {
        isRunning = 'not running';
    }

    // useEffect(() => {
    //     if (isRunning === 'not running') {
    //       clearInterval(secondsCountInterval.current);
    //       setCounter(0);
    //       setRunning(false);
    //     }
    //     else if (isRunning === 'paused'){
    //       clearInterval(secondsCountInterval.current);
    //       setRunning(false);
    //     }

        
    // }, [isRunning, setRunning]);

    // Start timer
    useEffect(() => {

        if (index === currentIndex && running === true) {
            secondsCountInterval.current = setInterval(() => {
            setCounter(prev => {
              return prev + 1;
            });
          }, 1000);
        }

        else if (running === false) {
          clearInterval(secondsCountInterval.current);
        }
    
        return () => {
          clearInterval(secondsCountInterval.current);
        };
      }, [currentIndex, index, running]);
    
      // Go to next timer when current timer ends.
      useEffect(() => {
        if (counter === totalSeconds.current) {
          clearInterval(secondsCountInterval.current);
          setCurrentIndex(c => c + 1);
        }
      }, [counter, setCurrentIndex]);



	return (
        <div>
            <Panel type="Stopwatch">
      
                <div>
                    <h5 style = {{
                        textTransform: 'capitalize',
                    }}
                    
                    >{isRunning}</h5>
                </div>
                
                {isRunning === 'running' && <DisplayTime minutes={CalculateMinutesSeconds(counter)[0]} seconds={CalculateMinutesSeconds(counter)[1]}/>}
                {isRunning === 'not running' && <DisplayTime minutes="0" seconds="0"/>}
                {isRunning === 'completed' && <DisplayTime minutes={startMinutes} seconds={startSeconds}/>}
                            
            
            </Panel>
        </div>

		);
};
export default Stopwatch;
