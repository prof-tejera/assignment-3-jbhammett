import React from "react";

const DisplayDescription = ({description, onChange}) => {
    return(
        <span style={{
            fontSize: "1rem",
            marginRight: 5,
        }}>
            {description}
        </span>
    );
 };
 
 export default DisplayDescription;
