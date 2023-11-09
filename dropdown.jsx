import React, { Component } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
class Dropdowns extends Component{
    render(){
        const {word,all_choice,value,handleChange} = this.props;
        return (
            <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-filled-label">{word}</InputLabel>
                <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                value={value}
                onChange={handleChange}
                >
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {all_choice.map((value,index)=>( <MenuItem value={value}>{value}</MenuItem>))}
                </Select>
            </FormControl>
        )
    };
}
export default Dropdowns;