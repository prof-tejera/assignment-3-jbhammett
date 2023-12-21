import React from "react";
import { ErrorBoundary } from 'react-error-boundary';
import { useContext, useState } from "react";


import Button from "../components/generic/Button";
import TimerInput from "../components/generic/TimerInput";
import DescriptionInput from "../components/generic/DescriptionInput";
import MyFallbackComponent from "../views/TimersView";

import { TimersContext } from "../utils/TimersProvider";


export const Editor = ({ editorTimer }) => {
    const { timers, editTimer, saveTimer, closeEditor, secondsOptions, minutesOptions, roundsOptions } = useContext(TimersContext);
    const [selectedTimer, setSelectedTimer ] = useState(editorTimer?.selectedTimer ?? '');
    const [startMinutes, setStartMinutes] = useState(editorTimer?.startMinutes ?? '');
    const [startSeconds, setStartSeconds] = useState(editorTimer?.startSeconds ?? '');
    const [rounds, setRounds] = useState(editTimer?.rounds ?? '');
    const [startRestMinutes, setStartRestMinutes] = useState(editorTimer?.restMinutes ?? '');
    const [startRestSeconds, setStartRestSeconds] = useState(editorTimer?.restSeconds ?? '');
    const [description, setDescription] = useState(editorTimer?.description ?? '');
    
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

    const handleSelectedTimerDescription = (value) => {
        setDescription(value);
    }

    let listOptions = '';
    let options = ['Choose One', 'Stopwatch', 'Countdown', 'XY', 'Tabata'];

    if (options){
        listOptions = options.map((option,index) => <option key={index} value={option}>{option}</option>);
    }
    else {
        listOptions=<option>none</option>
    }
    // console.log(`editorTimer ${editorTimer.selectedTimer}`);
    return (
        <ErrorBoundary fallback={<div>Something Failed</div>} FallbackComponent={MyFallbackComponent}>

            <div>
                {/* {!editorTimer && */}
                <h2>Editor</h2>
                    <select id="select-timers" onChange={e => handleAddTimerInput(e.target.value)}>
                    {/* <select value={editTimer.selectedTimer} onChange={e => handleAddTimerInput(e.target.value)}> */}
                        {listOptions}
                    </select>
                    {/* } */}
            
                {(selectedTimer === 'Stopwatch' || (editorTimer && editorTimer.selectedTimer === 'Stopwatch')) &&  
                //  {selectedTimer === 'Stopwatch' && 
                    (<div>
                        
                        <h6 style={{
                            marginBottom:0,
                        }}>
                            Description: 
                        </h6>
                        <DescriptionInput value={editTimer.description} onChange={handleSelectedTimerDescription} />
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
                        }}>
                            Description: 
                        </h6>
                        <DescriptionInput onChange={handleSelectedTimerDescription} />
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
                        }}>
                            Description: 
                        </h6>
                        <DescriptionInput onChange={handleSelectedTimerDescription} />
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
                        <h6 style={{
                            marginBottom:0,
                        }}>
                            Description: 
                        </h6>
                        <DescriptionInput onChange={handleSelectedTimerDescription} />
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
                                    id: editorTimer?.id,
                                    index: (timers.length === 0) ? 0 : timers.length,
                                    selectedTimer,
                                    startMinutes,
                                    startSeconds,
                                    isRunning: 'not running',
                                    rounds,
                                    startRestMinutes,
                                    startRestSeconds,
                                    description,    
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


    </ErrorBoundary>
    );
};


const AddTimersView = () => {
    const { timers, openEditor, editorOpen, deleteTimer } = useContext(TimersContext);
  
	return (
        <div>
            <span>
                <Button value="Add New Timer" color="#aaa0ff" onClick={() => openEditor()} />

                {editorOpen && <Editor />}
            </span>


      <h3>Workout Schedule</h3>
      {timers.map((timer) => (
        <div>
            {timer.selectedTimer}
        
            <Button value="Delete Timer" onClick={() => {
                deleteTimer({ id: timer.id });
            }} />

            {/* <Button value="Add New Timer" color="#aaa0ff" onClick={() => openEditor()} /> */}


        </div>
      
      ))}


    </div>
		);
                
};

export default AddTimersView;
