import React, { useState, useRef, useEffect } from 'react';
import { makeId, CreateHash, CalculateMinutesSeconds } from "../utils/helpers";

export const TimersContext = React.createContext({});

const TimersProvider = ({ children }) => {
    const [timers, setTimers] = useState([]);
    const [selectedTimer, setSelectedTimer] = useState(null);
    const [editTimer, setEditTimer] = useState(null);
    const [currentTimer, setCurrentTimer] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(null);
    const [running, setRunning] = useState(false);
    const [hash, setHash] = useState(() => {
        const hash = (window.location.hash ?? '').slice(1);
        return decodeURIComponent(hash);
    });

    const [totalTime, setTotalTime] = useState(0);

    const totalSeconds = useRef(0);


    const closeEditor = () => {
        setEditTimer(null);
    };

    const secondsOptions = [0, 5, 15, 30, 45];
    
    const minutesOptions = []
    for (let i=0; i < 60; i++){
        minutesOptions.push(i);
    }

    const roundsOptions = []
    for (let j=1; j < 20; j++){
        roundsOptions.push(j);
    }


    useEffect(()=>{
        if(window.location.pathname === '/') {
            if (hash){
                let hashTimers = hash.split('-');
                const timerTypes = ['Stopwatch', 'Countdown', 'XY', 'Tabata'];


                const newTimers = [];

                for (let i = 0; i <= hashTimers.length; i++) {
                if (timerTypes.includes(hashTimers[i])) {

                    newTimers.push({
                    id: makeId(),
                    index: timers.length === 0 ? 0 : timers.length,
                    selectedTimer: hashTimers[i],
                    startMinutes: CalculateMinutesSeconds(
                        parseInt(hashTimers[i + 1])
                    )[0],
                    startSeconds: CalculateMinutesSeconds(
                        parseInt(hashTimers[i + 1])
                    )[1],
                    rounds:
                        hashTimers[i] === "XY" || hashTimers[i] === "Tabata"
                        ? hashTimers[i + 2]
                        : 0,
                    startRestMinutes:
                        hashTimers[i] === "Tabata"
                        ? CalculateMinutesSeconds(parseInt(hashTimers[i + 3]))[0]
                        : 0,
                    startRestSeconds:
                        hashTimers[i] === "Tabata"
                        ? CalculateMinutesSeconds(parseInt(hashTimers[i + 3]))[1]
                        : 0,
                    isRunning: "not running",
                    });
                }

                setTimers(newTimers);
                }
            }
        }
  
    }, []) // eslint-disable-line


    useEffect(()=>{
        if(window.location.pathname === '/') {
            setHash(()=>{
                return CreateHash(timers);
            });
        }

    }, [timers])


    return (
        <TimersContext.Provider
            value={{
                timers,
                setTimers,
                editorOpen: !!editTimer,
                editTimer,
                setEditTimer,
                currentTimer,
                setCurrentTimer,
                currentIndex,
                setCurrentIndex,
                selectedTimer,
                setSelectedTimer,
                secondsOptions,
                minutesOptions,
                roundsOptions,
                totalSeconds,
                running,
                setRunning,
                hash,
                setHash,
                totalTime,
                setTotalTime,
                closeEditor,
                deleteTimer: ({ id }) => setTimers(timers.filter(x => x.id !== id)),
                openEditor: () => setEditTimer({}),

                openTimer: ({ id }) => {
                    const t = timers.find(t => t.id === id);
                    setEditTimer(t);
                  },

                handleWorkoutReset: () =>{
                    timers[currentIndex].isRunning = 'not running';
                    setCurrentIndex(null);
                },
                
                handlePauseResume: () => {
                    if (running === true){
                        setRunning(false);
                    }
                    else {
                        setRunning(true);
                    }
                },

                handleFastForward: () => {
                    setCurrentIndex(prev => {
                        return prev + 1;
                    });
                },


                handleTimerStart: () => {
                    if (currentIndex) {
                        setCurrentIndex(currentIndex);
                    }
                    else {
                        setCurrentIndex(0);
                    }       
                    setRunning(true);
                    
                },

                saveTimer: ({ id, index, selectedTimer, startMinutes, startSeconds, rounds, startRestMinutes, startRestSeconds, isRunning, description }) => {
                    const updatedTimer = {
                        id,
                        index,
                        selectedTimer,
                        startMinutes,
                        startSeconds, 
                        rounds,
                        startRestMinutes,
                        startRestSeconds,
                        isRunning,
                        description,
                    };
                    
                    if (id) {
                        const updatedTimers = timers.map(t => (t.id === id ? updatedTimer : t ));
                        setTimers(updatedTimers);
                    } else {
                        
                        setTimers([
                            ...timers,
                            {
                                ...updatedTimer,
                                id: makeId(),
                                index: (timers.length === 0) ? 0 : timers.length,
                                isRunning: 'not running',
                                
                              
                            },
                        ])
                        
                    }
                    closeEditor();
            
                },
 
            }}
        >
            {children}
        </TimersContext.Provider>


    );
};

export default TimersProvider;