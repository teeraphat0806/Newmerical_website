import React, { useEffect,useState } from 'react';
import { db } from'../config/firebase'
import {getDocs ,collection ,addDoc} from "firebase/firestore";
import getRandomNumber from './random_index';
import { pow, sqrt } from 'mathjs';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextFields from '../textfield';
import Cards from '../cards';
import ButtonUsage from '../button';
import {yellow}  from '@mui/material/colors';


class MatrixInverter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 2,
            matrix: [[1, 0], [0, 1]],
            inverseMatrix: null,
            all_dimension: [],
            x: [],
        };
        this.database_equation = collection(db, "matrix_inversion");
    }

    componentDidMount() {
        this.getDataList();
    }

    async getDataList() {
        try {
            const data = await getDocs(this.database_equation);
            const filteredData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            const b = filteredData.map(data => data.dimension);
            const c = filteredData.map(data => {
                const arr = data.x.split(',').map(val => parseFloat(val));
                return arr;
            });

            this.setState({
                all_dimension: b,
                size: b[0],
                x: c,
                matrix: this.setmatrix(c[0], b[0])
            }, this.solve);
        } catch (err) {
            console.log(err);
        }
    }

    setmatrix(arrayx, dimension) {
        let new_array = [];
        let index = 0;
        for (let i = 0; i < dimension; i++) {
            new_array.push([]);
            for (let j = 0; j < dimension; j++) {
                new_array[i].push(arrayx[index]);
                index++;
            }
        }
        return new_array;
    }

    random_matrix = () => {
        let indexs = getRandomNumber(this.state.x.length);
        this.setState({
            matrix: this.setmatrix(this.state.x[indexs], this.state.all_dimension[indexs])
        }, this.solve);
    }

    check_duplicate() {
        const { matrix, x, all_dimension } = this.state;
        let check = true;
        for (let i = 0; i < x.length; i++) {
            for (let k = 0; k < x[i].length; k++) {
                if (matrix[i][k] !== x[i][k % all_dimension[i]]) {
                    check = false;
                    break;
                }
            }
        }
        return check;
    }

    submitdata() {
        const { matrix, size } = this.state;
        let s_x = matrix.flat().join(',');
        try {
            addDoc(this.database_equation, { dimension: size, x: s_x });
            console.log("submit complete");
        } catch (err) {
            console.error(err);
        }
    }

    initializeMatrix = (newSize) => {
        const newMatrix = Array.from({ length: newSize }, () => Array(newSize).fill(0));
        this.setState({
            matrix: newMatrix,
            inverseMatrix: null
        });
    }
    setmatrix = () =>{
        setInverseMatrix(this.invertMatrix(JSON.parse(JSON.stringify(this.state.matrix))))
    }
    solve = () => {
        const inverse = this.invertMatrix(JSON.parse(JSON.stringify(this.state.matrix)));
        if (!this.check_duplicate()) {
          this.submitdata();
        }
        this.setState({ inverseMatrix: inverse });
    }
      
    handleChange = (e, i, j) => {
        const newMatrix = [...this.state.matrix];
        newMatrix[i][j] = parseFloat(e.target.value) || 0;
        this.setState({ matrix: newMatrix });
    }
    
    handleInputChanged = (e) => {
        const newSize = Math.max(2, parseInt(e.target.value, 10));
        this.initializeMatrix(newSize);
        this.setState({ size: newSize });
    } 
    invertMatrix = (matrix) => {
      const n = matrix.length;
      const iden = Array.from({ length: n }, (_, i) => 
          Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
      );

      for (let i = 0; i < n; i++) {
          let max = i;
          for (let j = i + 1; j < n; j++) {
              if (Math.abs(matrix[j][i]) > Math.abs(matrix[max][i])) {
                  max = j;
              }
          }

          [matrix[i], matrix[max]] = [matrix[max], matrix[i]];
          [iden[i], iden[max]] = [iden[max], iden[i]];

          const pivot = matrix[i][i];
          if (Math.abs(pivot) === 0) {
              // Matrix is singular and not invertible
              return null;
          }

          for (let j = 0; j < n; j++) {
              matrix[i][j] /= pivot;
              iden[i][j] /= pivot;
          }

          for (let j = 0; j < n; j++) {
              if (j !== i) {
                  const factor = matrix[j][i];
                  for (let k = 0; k < n; k++) {
                      matrix[j][k] -= factor * matrix[i][k];
                      iden[j][k] -= factor * iden[i][k];
                  }
              }
          }
      }
      if(this.check_duplicate() == false){
          this.submitdata();
      }
      return iden;
  }

    render() {
        const { size, matrix, inverseMatrix } = this.state;
        return (
            <div style={{textAlign:'center',fontSize:20}}>
                <h1 style={{fontSize:50,color:'black'}}>Matrix Inversion</h1>
                <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{borderRadius: '8px', // Adjusted border radius// Softer shade of grey
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',paddingBottom:3,marginBottom:3}}>
                    <p> Matrix Size </p>
                    <TextFields  
                        type="number"
                        value={size}
                        onChange={this.handleInputChanged}
                        min={2}
                    />
                </Container>
              
                <div>
                   
                    {matrix.map((row, i) => (
                        <div key={i}>
                            {row.map((cell, j) => (
                                <TextFields  
                                    type="number"
                                    key={j}
                                    value={matrix[i][j]}
                                    onChange={(e) => this.handleChange(e, i, j)}
                                    min={2}
                                />
                              
                            ))}
                        </div>
                    ))}
                </div>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} sx={{paddingLeft:"40%",paddingTop:5,marginBottom:5}} >
                    <Grid item xs={2}>
                        <ButtonUsage word={"Calculate"} functionName={this.solve}/>
                    </Grid>
                    <Grid item xs={3}>
                        <ButtonUsage word={"Random"} color={"red"} functionName={this.random_matrix}/>
                    </Grid>
                </Grid>
            
          
                {inverseMatrix && (
                    <div>
                        <h3>Inverse Matrix</h3>
                        {inverseMatrix.map((row, i) => (
                            <div key={i}>
                                {row.map((cell, j) => (
                                    <TextFields 
                                    key={j}
                                    value={inverseMatrix[i][j].toFixed(4)}
                                    readOnly
                                    
                                    />
                                    
                                ))}
                            </div>
                        ))}
                    </div>
                )}
          </div>
      );
    }
}


export default MatrixInverter;