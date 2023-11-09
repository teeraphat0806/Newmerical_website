import React, { Component } from 'react';

class text_p extends Component {
    render(){
        const { word,fontstyle,color} = this.props;

        return (
            <p sx={{fontstyle:fontstyle,color:color}}>
                {word}
            </p>
        )    
    };
}
export default text_p;