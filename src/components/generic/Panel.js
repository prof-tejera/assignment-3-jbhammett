import React from "react";


const Panel = ({ type, children }) => {
  
    // here you can apply some styling or arrange
    // elements as you wish, maybe pass the type in for example
    return (<div style={{
        textAlign: "center",
        color: "#555555",
        border: "solid",
        borderRadius: "10%",
        padding: 20,
        paddingTop: 5,
        margin: 10,
        backgroundColor: "#ffffff",
        fontSize: "1.25rem"
        
    }}>
      <h3 style={{
        marginBottom: 5,
        fontSize: "2rem"
      }}>{type}</h3>
      {children}
    </div>
    );  
};
  


export default Panel;