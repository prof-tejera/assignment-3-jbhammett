import React from "react";
import { useContext, useState } from 'react';

import Button from "../components/generic/Button";
import TimerInput from "../components/generic/TimerInput";

import { TimersContext } from "../utils/TimersProvider";


const Editor = () => {
    const { timers, saveTimer, closeEditor, secondsOptions, minutesOptions, roundsOptions } = useContext(TimersContext);
    const [selectedTimer, setSelectedTimer ] = useState(null);
    const [startMinutes, setStartMinutes] = useState(selectedTimer?.startMinutes ?? '');
    const [startSeconds, setStartSeconds] = useState(selectedTimer?.startSeconds ?? '');
    const [rounds, setRounds] = useState(selectedTimer?.rounds ?? '');
    const [startRestMinutes, setStartRestMinutes] = useState(selectedTimer?.restMinutes ?? '');
    const [startRestSeconds, setStartRestSeconds] = useState(selectedTimer?.restSeconds ?? '');
    
    const handleAddTimerInput = (value) => {
        setSelectedTimer(value);
    };

    const handleSelectedTimerMinutes = (value) => {
            setStartMinutes(value);
    }
    
    const handleSelectedTimerSeconds = (value) => {
        setStartSeconds(value);
    }

    const handleSelectedTimerRestMinutes = (value) => {
        setStartRestMinutes(value);
    }

    const handleSelectedTimerRestSeconds = (value) => {
        setStartRestSeconds(value);
    }

    const handleSelectedTimerRounds = (value) => {
        setRounds(value);
    }

    let listOptions = '';
    let options = ['Choose One', 'Stopwatch', 'Countdown', 'XY', 'Tabata'];
    if (options){
        listOptions = options.map((option,index) => <option key={index} value={option}>{option}</option>);
    }
    else {
        listOptions=<option>none</option>
    }


    return (
        <div>
            <select onChange={e => handleAddTimerInput(e.target.value)}>
                {listOptions}
            </select>
         
            {selectedTimer === 'Stopwatch' && 
                (<div>
                    <h6 style={{
                        marginBottom:0,
                        }}>Minutes : Seconds
                    </h6>
                    <TimerInput options={minutesOptions} timeType="Minutes" onChange={handleSelectedTimerMinutes}/> 
                    <span>:</span>
                    <TimerInput options={secondsOptions} timeType="Seconds" onChange={handleSelectedTimerSeconds}/>
                </div>) 
            }

            {selectedTimer === 'Countdown' && 
                (<div>
                    <h6 style={{
                        marginBottom:0,
                        }}>Minutes : Seconds
                    </h6>
                    <TimerInput options={minutesOptions} timeType="Minutes" onChange={handleSelectedTimerMinutes}/> 
                    <span>:</span>
                    <TimerInput options={secondsOptions} timeType="Seconds" onChange={handleSelectedTimerSeconds}/>
                </div>) 
            }

            {selectedTimer === 'XY' && 
                (<div>
                    <h6 style={{
                        marginBottom:0,
                        }}>Minutes : Seconds
                    </h6>
                    <TimerInput options={minutesOptions} timeType="Minutes" onChange={handleSelectedTimerMinutes}/> 
                    <span>:</span>
                    <TimerInput options={secondsOptions} timeType="Seconds" onChange={handleSelectedTimerSeconds}/>
                    <h6 style={{
                        marginBottom:0,
                        }}>Rounds
                    </h6>
                    <TimerInput options={roundsOptions} timeType="Rounds" onChange={handleSelectedTimerRounds}/>
                </div>) 
            }

            {selectedTimer === 'Tabata' && 
                (<div>
                    <h5 style={{
                        marginBottom: 2,
                    }}>
                        Work
                        </h5>
                    <h6 style={{
                        marginTop: 0,
                        marginBottom:2,
                        }}>Minutes : Seconds
                    </h6>
                    <TimerInput options={minutesOptions} timeType="Minutes" onChange={handleSelectedTimerMinutes}/> 
                    <span>:</span>
                    <TimerInput options={secondsOptions} timeType="Seconds" onChange={handleSelectedTimerSeconds}/>
                    <div>
                    <h5 style={{
                        marginBottom:2,
                        }}>
                        Rest
                    </h5>
                        <h6 style={{
                            marginTop:0,
                            marginBottom:0,
                            }}>Minutes : Seconds
                        </h6>
                        <TimerInput options={minutesOptions} timeType="Minutes" onChange={handleSelectedTimerRestMinutes}/> 
                        <span>:</span>
                        <TimerInput options={secondsOptions} timeType="Seconds" onChange={handleSelectedTimerRestSeconds}/>
                    </div>

                    <h5 style={{
                        marginBottom:2,
                        }}>
                        Rounds
                    </h5>
                    <TimerInput options={roundsOptions} timeType="Rounds" onChange={handleSelectedTimerRounds}/>
                </div>) 
            }

            {selectedTimer && 
                <div>
                    <Button value="Save"
                        color="#aaa0ff"
                        onClick={() => {
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
                        }}
                    />
                    
                    <Button value="Cancel"
                        color="#aaa0ff" 
                        onClick={() => {
                            closeEditor();
                    }} />
            </div>}



        </div>



    );
};


const AddTimersView = () => {
    const { openEditor, editorOpen } = useContext(TimersContext);
  
	return (

        <span>
            <Button value="Add New Timer" color="#aaa0ff" onClick={() => openEditor()} />

            {editorOpen && <Editor />}
        </span>
		);

};

export default AddTimersView;
