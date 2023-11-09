import React, { Component } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

class Cards extends Component {
    state = {
        isHovered: false,
    };

    handleMouseOver = () => {
        this.setState({ isHovered: true });
    };

    handleMouseOut = () => {
        this.setState({ isHovered: false });
    };

    render() {
        const {
            fontsize = 14,
            color = 'black',
            fontcolor = "black",
            hoverBackgroundColor = 'white',
            hoverFontColor = 'black',
            borderRadius = 0,
            word,
            hoverWord // Add this prop for the word to be displayed on hover
        } = this.props;

        const displayWord = this.state.isHovered ? hoverWord : word;

        return (
            <Card 
                onMouseOver={this.handleMouseOver} 
                onMouseOut={this.handleMouseOut}
                style={{ 
                    backgroundColor: this.state.isHovered ? hoverBackgroundColor : color,
                    borderRadius: borderRadius,
                    transition: 'background-color 0.3s, color 0.3s'
                }}
            >
                <CardContent>
                    <Typography gutterBottom style={{ fontSize: fontsize, color: this.state.isHovered ? hoverFontColor : fontcolor }}>
                        {displayWord}
                    </Typography>
                </CardContent>
            </Card>
        )
    };
}

export default Cards;
