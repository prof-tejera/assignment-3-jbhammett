import React from "react";

const DisplayTitle = ({title}) => {
    return(
        <span style={{
            fontSize: "1rem",
            marginRight: 5,
        }}>
            {title}
        </span>
    );
 };
 
 export default DisplayTitle;
