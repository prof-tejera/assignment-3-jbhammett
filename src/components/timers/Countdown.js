import React from "react";
import { useState, useEffect, useRef, useContext } from 'react';

import DisplayTime from "../generic/DisplayTime";
import DisplayDescription from "../generic/DisplayDescription";
import Panel from "../generic/Panel";
import { TimersContext } from "../../utils/TimersProvider";

import { CalculateMinutesSeconds, CalculateTotalSeconds } from "../../utils/helpers";


const Countdown = ({ id, index, startMinutes, startSeconds, isRunning, description})=> {
    const { currentIndex, setCurrentIndex, running, setTotalTime } = useContext(TimersContext);
    
    const duration = CalculateTotalSeconds(startMinutes, startSeconds);
    const [counter, setCounter] = useState(duration);
    const secondsCountInterval = useRef(0);

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

  
      }, []); // eslint-disable-line

    useEffect(() => {
        if (index === currentIndex && running === true) {
            secondsCountInterval.current = setInterval(() => {
            setCounter(prev => {
                if (prev % 5 === 0){
                    window.localStorage.setItem(index, JSON.stringify(prev));
                  }
              return prev - 1;
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
      }, [currentIndex, index, running]); // eslint-disable-line
    
      useEffect(() => {
        if (counter === 0) {
          clearInterval(secondsCountInterval.current);
          setCurrentIndex(c => c + 1);
        }
      }, [counter, setCurrentIndex]);

	return (
        <div>
            <Panel type="Countdown">
      
                <div>
                    <h5 style = {{
                        textTransform: 'capitalize',
                    }}
                    
                    >{isRunning}</h5>
                </div>
                {isRunning ==='running' && <DisplayDescription description={description}/>}
                {isRunning === 'running' && <DisplayTime minutes={CalculateMinutesSeconds(counter)[0]} seconds={CalculateMinutesSeconds(counter)[1]}/>}
                {isRunning === 'not running' && <DisplayTime minutes={startMinutes} seconds={startSeconds}/>}
                {isRunning === 'completed' && <DisplayTime minutes="0" seconds="0" />}
            </Panel>
        </div>

		);
};


export default Countdown;
