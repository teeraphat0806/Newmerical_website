import React from 'react';
import { db } from '../config/firebase';
import { getDocs, collection, addDoc } from "firebase/firestore";
import getRandomNumber from './random_index';
import { pow, sqrt } from 'mathjs';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextFields from '../textfield';
import Cards from '../cards';
import ButtonUsage from '../button';
import {yellow}  from '@mui/material/colors';
class Guaesseidal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dimension: 2,
            matrix: Array.from({ length: 2 }, () => Array(3).fill(0)),
            answer: [],
            all_dimension: [],
            y: [],
            x: []
        };

        this.database_equation = collection(db, "guessian");
    }

    componentDidMount() {
        this.getDataList();
    }

    async getDataList() {
        try {
            const data = await getDocs(this.database_equation);
            const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id, }));
            const allDimensions = filteredData.map((data) => data.dimension);
            this.setState({ dimension: allDimensions[0], all_dimension: allDimensions });

            const x = filteredData.map(data => {
                return data.x.split(',').map(Number);
            });

            const y = filteredData.map(data => {
                return data.y.split(',').map(Number);
            });

            this.setState({ x, y });
            this.setMatrix(x[0], y[0], this.state.dimension);
            this.calculate();
        } catch (err) {
            console.log(err);
        }
    }

    setMatrix(arrayx, arrayy, dimension) {
        let new_array = [];
        let index = 0;
        for (let i = 0; i < dimension; i++) {
            new_array.push([]);
            for (let j = 0; j < dimension; j++) {
                if (j === dimension - 1) {
                    new_array[i].push(arrayx[index], arrayy[i]);
                } else {
                    new_array[i].push(arrayx[index]);
                }
                index++;
            }
        }
        this.setState({ matrix: new_array });
    }

    random_matrix() {
        let indexs = getRandomNumber(this.state.x.length);
        this.setMatrix(this.state.x[indexs], this.state.y[indexs], this.state.all_dimension[indexs]);
        this.calculate();
    }

    check_duplicate() {
        const { matrix, x, y, all_dimension } = this.state;

        for (let i = 0; i < x.length; i++) {
            for (let k = 0; k < x[i].length; k++) {
                if (k % (all_dimension[i] + 1) === all_dimension[i] && matrix[i][k] !== y[i][k % all_dimension[i]]) {
                    return false;
                } else if (matrix[i][k] !== x[i][k % all_dimension[i]]) {
                    return false;
                }
            }
        }
        return true;
    }

    submitdata() {
        const { matrix, dimension } = this.state;

        let s_x = "";
        let s_y = "";

        for (let i = 0; i < matrix.length; i++) {
            for (let k = 0; k < matrix[0].length; k++) {
                if (k === matrix[0].length - 1) {
                    s_y = s_y.concat(String(matrix[i][k]), ",");
                } else {
                    s_x = s_x.concat(String(matrix[i][k]), ",");
                }
            }
        }

        try {
            addDoc(this.database_equation, { dimension, x: s_x, y: s_y });
        } catch (err) {
            console.error(err);
        }
        console.log("submit complete");
    }

    handleDimensionChange = (e) => {
        const newDimension = parseInt(e.target.value, 10);
        this.setState({
            dimension: newDimension,
            matrix: Array.from({ length: newDimension }, () => Array(newDimension + 1).fill(0))
        });
    }

    handleMatrixChange(e, rowIndex, colIndex) {
        const newValue = parseFloat(e.target.value);
        const newMatrix = [...this.state.matrix];
        newMatrix[rowIndex][colIndex] = newValue;
        this.setState({ matrix: newMatrix });
    }

    gaussSeidel(A, b) {
        const maxIterations = 1000;
        const tolerance = 0.0001;
        let x = Array(this.state.dimension).fill(0);
        let previousX = Array(this.state.dimension).fill(0);

        for (let iteration = 0; iteration < maxIterations; iteration++) {
            for (let i = 0; i < this.state.dimension; i++) {
                let sum = b[i];

                for (let j = 0; j < this.state.dimension; j++) {
                    if (i !== j) {
                        sum -= A[i][j] * x[j];
                    }
                }

                x[i] = sum / A[i][i];
            }

            let difference = x.map((value, index) => Math.abs(value - previousX[index]));
            if (Math.max(...difference) < tolerance) {
                break;
            }

            previousX = [...x];
        }

        return x;
    }

    calculate() {
        const A = this.state.matrix.map(row => row.slice(0, this.state.dimension));
        const b = this.state.matrix.map(row => row[this.state.dimension]);
        const result = this.gaussSeidel(A, b);
        this.setState({ answer: result });
        if (!this.check_duplicate()) {
            this.submitdata();
        }
    }

    render() {
        return (
            <div style={{ textAlign: 'center',fontSize: 20}}>
                
                <h1 style={{fontSize:50,color:"black"}}> Gueasseidel </h1>
                <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{paddingBottom:5,marginBottom:5,borderRadius: '8px', // Adjusted border radius// Softer shade of grey
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
                    <p>Matrix Size</p>
                    <TextFields 
                    type="number" 
                    placeholder="2" 
                    value={this.state.dimension} 
                    onChange={this.handleDimensionChange} 
                    min="2"
                    />
                </Container>
                

                <div>
                    <h3>Enter Matrix Values</h3>
                    {this.state.matrix.map((row, rowIndex) => (
                        <div key={rowIndex}>
                            {row.map((value, colIndex) => (
                                 <TextFields 
                                 type="number" 
                                 placeholder={value}
                                 key={colIndex}
                                 value={value} 
                                 onChange={(e) => this.handleMatrixChange(e, rowIndex, colIndex)} 
                               
                                   />
                              
                            ))}
                        </div>
                    ))}
                    <p></p>
                </div>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} sx={{paddingLeft:"40%",paddingTop:5,marginBottom:5}} >
                    <Grid item xs={2}>
                        <ButtonUsage word={"Calculate"} functionName={this.calculate} />
                    </Grid>
                    <Grid item xs={2}>
                    <ButtonUsage color={"red"} word={"Random"} functionName={this.random_matrix} />
                    </Grid>
                </Grid>
                
                
                {this.state.answer.length > 0 &&
                <Container maxWidth="sm" style={{textAlign: 'center'}} sx={{paddingTop:2,paddingBottom:2,backgroundColor:yellow[700],borderRadius: '8px', // Adjusted border radius// Softer shade of grey
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>

{this.state.answer.length > 0 && this.state.answer.map((value, index) => (<p key={index}>x{index + 1}: {value.toFixed(4)}</p>))}
                </Container>}
            </div>
        );
    }
}

export default Guaesseidal;