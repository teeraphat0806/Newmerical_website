import React, { Component } from 'react';
import Button from '@mui/material/Button';
import { yellow } from '@mui/material/colors';

class ButtonUsage extends Component {
    render() {
        // Destructure the color prop and give it a default value of 'black'
        const { functionName, word, color = 'black' } = this.props;
        return (
            <Button
                onClick={()=>{functionName()}}
                size="large"
                sx={{
                    backgroundColor: color, // Use color prop
                    '&:hover': {
                        backgroundColor: yellow[700],
                        color: 'black',
                        // If you want to make the hover color also dynamic, you can use a different prop for it.
                    },
                }}
                variant="contained"
            >
                {word}
            </Button>
        )
    };
}

export default ButtonUsage;
