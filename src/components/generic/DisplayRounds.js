import React from "react";

const DisplayRounds = ({round, totalRounds}) => {
    return(
        <div style={{
            fontSize: "1rem",
            marginRight: 5,
        }}>
            Round: {round} of {totalRounds}
        </div>
    );
 };
 
 export default DisplayRounds;
