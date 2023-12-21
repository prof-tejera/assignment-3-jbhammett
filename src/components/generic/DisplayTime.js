import React from "react";

const DisplayTime = ({minutes, seconds}) => {
    return(
        <div style={{
            marginBottom: 10
        }}>
            {minutes.toString().padStart(2,"0")}:{seconds.toString().padStart(2,"0")}
        </div>
    );
 };
 
 export default DisplayTime;
