import React from "react";

const DescriptionInput = ({value, onChange}) => {

	return (
        <span>
            <input 
                value={value}
                onChange={e => onChange(e.target.value)} 
                style={{marginBottom: 10}}
            />
        </span>
		);
    
};

export default DescriptionInput;