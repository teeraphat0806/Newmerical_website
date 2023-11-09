import React, { Component } from 'react';

import TextField from '@mui/material/TextField';

class TextFields extends Component {
    render(){
        const { type, placeholder, value, onChange,step,key="ids",min="1" } = this.props;

        return (
            <TextField 
                key={key}
                id="filled-basic" 
                type={type} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} // Use the passed onChange function
                label="Filled" 
                variant="filled" 
                InputProps={type === 'number' ? { inputProps: { step } } : {}}
                min={min}
            />
        )    
    };
}
export default TextFields;