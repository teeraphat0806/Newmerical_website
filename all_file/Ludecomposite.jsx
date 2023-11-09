import React, { Component } from 'react';
import { pow, sqrt } from 'mathjs';
import ButtonUsage from '../button';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextFields from '../textfield';
import Cards from '../cards';
import {yellow}  from '@mui/material/colors';
class LU extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matrixSize: 2,
            matrixData: Array(2).fill(Array(2 + 1).fill('')),
            outputData: [],
            X: []
        };
    }

    handleChange_matrixs = (event) => {
        // Use parseInt or parseFloat depending on your needs
        const newSize = parseInt(event.target.value);
        this.setState({
            matrixSize: newSize,
            matrixData: Array(newSize).fill(Array(newSize + 1).fill('')),
            outputData: []
        });
    }

    handleMatrixChange = (row, col, value) => {
        const newMatrixData = this.state.matrixData.map((rowArray, rowIndex) =>
            rowIndex === row
                ? rowArray.map((cell, colIndex) =>
                    colIndex === col ? value : cell
                )
                : rowArray
        );
        this.setState({ matrixData: newMatrixData });
    }

    renderMatrixInputs = () => {
        const inputs = [];
        for (let i = 0; i < this.state.matrixSize; i++) {
            const rowInputs = [];
            for (let j = 0; j <= this.state.matrixSize; j++) {
                rowInputs.push(
                    <TextFields 
                        key={`${i}-${j}`}
                        type="number"
                        value={this.state.matrixData[i][j]}
                        onChange={(e) => this.handleMatrixChange(i, j, e.target.value)}
                    />
                  
                );
            }
            inputs.push(<div key={i}>{rowInputs}</div>);
        }
        return inputs;
    }

    LUcal = () => {
        // ... the content of the LUcal function remains unchanged ...
        this.setState({ X: x });
    }

    handleSaveData = () => {
        this.setState({ outputData: this.state.matrixData });
        this.LUcal();
    }

    render() {
        return (
            <div className='cal'>
                <div style={{ textAlign: 'center',fontSize: 20}}>
                <h1 style={{fontSize:50,color:"black"}}>LU Decomposition</h1>
                    <label>
                        ขนาดเมทริก (n x n)
                        <p></p>
                        <TextFields 
                            type="number"
                            min="1"
                            value={this.state.matrixSize}
                            onChange={this.handleChange_matrixs}
                        />
                        
                    </label>
                </div>
                <div style={{marginTop: '20px',textAlign:'center'}}>
                    {this.renderMatrixInputs()}   
                    <p></p>
                    <ButtonUsage word={"Result"} functionName={this.handleSaveData}/>
                </div>
             
               
                {this.state.X.map((LOVEB, index) => {
                    return <div key={index}>X{index} = {LOVEB}</div>
                })}
                
            </div>
        );
    }
}

export default LU;