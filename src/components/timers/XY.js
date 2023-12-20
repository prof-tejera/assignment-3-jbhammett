import React from "react";
import { useContext, useRef, useState, useEffect } from 'react';

import DisplayTime from "../generic/DisplayTime";
import DisplayRounds from "../generic/DisplayRounds";
import Panel from "../generic/Panel";
import { CalculateMinutesSeconds, CalculateTotalSeconds } from "../../utils/helpers";
import { TimersContext } from "../../utils/TimersProvider";

const XY = ({ id, index, startMinutes, startSeconds, rounds, isRunning }) => {
    const { currentIndex, setCurrentIndex, running, setRunning, setTotalTime } = useContext(TimersContext);

    const duration = CalculateTotalSeconds(startMinutes, startSeconds);
    const [counter, setCounter] = useState(duration);
    const secondsCountInterval = useRef(0);
    const [roundsCounter, setRoundsCounter] = useState(1);

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
        if (index === currentIndex && running === true) {
            secondsCountInterval.current = setInterval(() => {
            setCounter(prev => {
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
      }, [currentIndex, index, running]);
    
      useEffect(() => {
        if (counter === 0 && roundsCounter < rounds){
            setRoundsCounter( prev=> {
                return prev + 1;
            });
            setCounter(duration);
        }; 

        if (counter === 0 && parseInt(roundsCounter) === parseInt(rounds)) {
          clearInterval(secondsCountInterval.current);
          setCurrentIndex(c => c + 1);
        }
      }, [counter, rounds, index, duration, roundsCounter, setCurrentIndex]);


    return (
        <div>
            <Panel type="XY">
            
                <div>
                    <h5 style = {{
                        textTransform: 'capitalize',
                    }}
                    
                    >{isRunning}</h5>
                </div>
                {isRunning === 'running' && <DisplayRounds round={roundsCounter} totalRounds={rounds} />}
                {(isRunning ==='not running' || isRunning ==='completed') && <DisplayRounds round="1" totalRounds={rounds} />}
                                
                {isRunning === 'running' && <DisplayTime minutes={CalculateMinutesSeconds(counter)[0]} seconds={CalculateMinutesSeconds(counter)[1]}/>}
                {isRunning ==='not running' && <DisplayTime minutes={startMinutes} seconds={startSeconds}/>}
                {isRunning ==='completed' && <DisplayTime minutes="0" seconds="0" />}
    
            </Panel>        
        </div>

        );
};





export default XY;
