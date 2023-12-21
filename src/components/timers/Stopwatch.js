import React from "react";
import {  useContext, useRef, useState, useEffect } from 'react';

import DisplayTime from "../generic/DisplayTime";
import DisplayDescription from "../generic/DisplayDescription";
import Panel from "../generic/Panel";
import { CalculateMinutesSeconds, CalculateTotalSeconds } from "../../utils/helpers";
import { TimersContext } from "../../utils/TimersProvider";


const Stopwatch = ({id, index, startMinutes, startSeconds, isRunning, description }) =>  {
    const { currentIndex, setCurrentIndex, running, setTotalTime } = useContext(TimersContext);
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


    useEffect(() => {
      const storedTime = window.localStorage.getItem(index);
      if (storedTime) {
        setCounter(JSON.parse(storedTime));
        const timeDifference = (CalculateTotalSeconds(startMinutes, startSeconds)) - (JSON.parse(storedTime));
        setTotalTime(prev => {
          return prev - timeDifference;
        });
      }


    }, []);

    // Start timer
    useEffect(() => {

        if (index === currentIndex && running === true) {
            secondsCountInterval.current = setInterval(() => {
            setCounter(prev => {
              if (prev % 5 === 0){
                window.localStorage.setItem(index, JSON.stringify(prev));
              }
              return prev + 1;
            });

            setTotalTime(prev => {
              return prev - 1;
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
                {isRunning ==='running' && <DisplayDescription description={description}/>}
                {isRunning === 'running' && <DisplayTime minutes={CalculateMinutesSeconds(counter)[0]} seconds={CalculateMinutesSeconds(counter)[1]}/>}
                {isRunning === 'not running' && <DisplayTime minutes="0" seconds="0"/>}
                {isRunning === 'completed' && <DisplayTime minutes={startMinutes} seconds={startSeconds}/>}
                            
            
            </Panel>
        </div>

		);
};
export default Stopwatch;
