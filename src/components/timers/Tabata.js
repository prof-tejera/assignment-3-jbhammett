import React from "react";
import { useContext, useRef, useState, useEffect } from 'react';

import DisplayTime from "../generic/DisplayTime";
import DisplayRounds from "../generic/DisplayRounds";
import Panel from "../generic/Panel";
import DisplayTitle from "../generic/DisplayTitle";
import DisplayDescription from "../generic/DisplayDescription";
import { CalculateMinutesSeconds, CalculateTotalSeconds } from "../../utils/helpers";
import { TimersContext } from "../../utils/TimersProvider";

const Tabata = ({ id, index, startMinutes, startSeconds, rounds, startRestMinutes, startRestSeconds, isRunning, description }) => {
    
    const { currentIndex, setCurrentIndex, running, setRunning, setTotalTime } = useContext(TimersContext);

    const workDuration = CalculateTotalSeconds(startMinutes, startSeconds);
    const restDuration = CalculateTotalSeconds(startRestMinutes, startRestSeconds);
    const [counter, setCounter] = useState(workDuration);
    const [restCounter, setRestCounter] = useState(restDuration);
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
        const storedTime = window.localStorage.getItem(index);
        const storedRestTime = window.localStorage.getItem('rest');
        const storedRound = window.localStorage.getItem('TabataRound');

        let restTimeDifference = 0;
        if (storedTime) {
          setCounter(JSON.parse(storedTime));
          const workTimeDifference = (JSON.parse(storedTime));
            if(storedRestTime){
                restTimeDifference = (JSON.parse(storedRestTime));
            }
          const timeDifference = (CalculateTotalSeconds(startMinutes, startSeconds)) - (workTimeDifference + restTimeDifference);  
          setTotalTime(prev => {
            return prev - timeDifference;
          });
        }
        if(storedRound){
            setRoundsCounter(JSON.parse(storedRound));
        }

  
      }, []);

    useEffect(() => {
        if (index === currentIndex && running === true) {
            secondsCountInterval.current = setInterval(() => {
                if(counter > 0){
                    setCounter(prev => {
                        if (prev % 5 === 0){
                            window.localStorage.setItem(index, JSON.stringify(prev));
                          }
                        return prev - 1;
                    });

                    setTotalTime(prev => {
                        return prev - 1;
                      });
                }
                else if (counter <= 0 && restCounter > 0){
                    setRestCounter(prevRest => {
                        if (prevRest % 5 === 0){
                            window.localStorage.setItem('rest', JSON.stringify(prevRest));
                          }
                        return prevRest - 1;
                    });

                    setTotalTime(prev => {
                        return prev - 1;
                      });
                }
            
          }, 1000);
        }

        else if (running === false) {
            clearInterval(secondsCountInterval.current);
        }
    
        return () => {
          clearInterval(secondsCountInterval.current);
        };
      }, [currentIndex, counter, restCounter, index, running]);

      useEffect(() => {
        if (restCounter === 0 && roundsCounter < rounds){
            setRoundsCounter( prev=> {
                window.localStorage.setItem('TabataRound', JSON.stringify(prev + 1));
                return prev + 1;
            });
            setCounter(workDuration);
            setRestCounter(restDuration);
        }; 
        if (restCounter === 0 && parseInt(roundsCounter) === parseInt(rounds)) {
          clearInterval(secondsCountInterval.current);
          setCurrentIndex(c => c + 1);
        }
      }, [restCounter, roundsCounter, restDuration, rounds, setCurrentIndex, workDuration]);

    
    return (
        <div>
            <Panel type="Tabata">
         
            <div>
                <h5 style = {{
                    textTransform: 'capitalize',
                }}
                
                >{isRunning}</h5>
            </div>
            {isRunning ==='running' && <DisplayDescription description={description}/>}
  

            <DisplayTitle title="Work" />
            {isRunning === 'not running' && <DisplayTime minutes={startMinutes} seconds={startSeconds}/>}
            {isRunning === 'running' && <DisplayTime minutes={CalculateMinutesSeconds(counter)[0]} seconds={CalculateMinutesSeconds(counter)[1]}/>}
            {isRunning === 'completed' && <DisplayTime minutes="0" seconds="0" />}

            <DisplayTitle title="Rest" />
            {isRunning === 'not running' && <DisplayTime minutes={startMinutes} seconds={startSeconds}/>}
            {isRunning === 'running' && <DisplayTime minutes={CalculateMinutesSeconds(restCounter)[0]} seconds={CalculateMinutesSeconds(restCounter)[1]} />}
            {isRunning === 'completed' && <DisplayTime minutes="0" seconds="0" />}


            {isRunning === 'not running' && <DisplayRounds round="1" totalRounds={rounds} />}
            {isRunning === 'running' && <DisplayRounds round={roundsCounter} totalRounds={rounds} />}
            {isRunning === 'completed' && <DisplayRounds round={rounds} totalRounds={rounds} />}
            
        </Panel>  
        </div>
    
        );
    };


export default Tabata;
