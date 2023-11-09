import React, { Component } from 'react';
import { pow, sqrt } from 'mathjs';
import ButtonUsage from '../button';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextFields from '../textfield';
import Cards from '../cards';
import {yellow}  from '@mui/material/colors';

class Cramerrule extends Component {
  constructor() {
    super();
    this.state = {
      dimension: 2,
      matrix: Array.from({ length: 2 }, () => Array(3).fill(0)),
      answer: []
    };
  }

  handleDimensionChange = (e) => {
    const newDimension = parseInt(e.target.value, 10);
    this.setState({
      dimension: newDimension,
      matrix: Array.from({ length: newDimension }, () => Array(newDimension+1).fill(0))
    });
  };

  handleMatrixChange = (e, rowIndex, colIndex) => {
    const newValue = parseFloat(e.target.value);
    const newMatrix = [...this.state.matrix];
    newMatrix[rowIndex][colIndex] = newValue;
    this.setState({ matrix: newMatrix });
  };

  calculate = () => {
    let ans = [];
    let x = [];
    let y = [];
   
    for(let i=0;i<this.state.dimension;i++){
      y.push(this.state.matrix[i][dimension]);
    }
    for(let i=0;i<this.state.dimension;i++){
      let array  = this.state.matrix[i];
      x.push(array);
      x[i].pop();
    }
    
    for(let k=0;k<this.state.dimension;k++){
      ans.push(this.determinant(this.setmatrix(x,y,k)));
    }
    this.state({answer:ans});
  };

  setmatrix(x,y,index){
    let ans = Array();
    for(let i=0;i<x.length;i++){
      let array = [];
      for(let k=0;k<x.length;k++){
        if(k==index){
          array.push(y[i]);
        }else{
          array.push(x[i][k]);
        }
      }ans.push(array);
    }
    return ans;
  }

  determinant(matrix_ans){
    
    let final_ans = 0;
    let ansed = 1;
    let size = matrix_ans.length;
    if(size == 2){
      final_ans += ((matrix_ans[0][0]*matrix_ans[1][1])-(matrix_ans[1][0]*matrix_ans[0][1]));
    }else{
      for(let i=0;i< size;i++){
          for(let k=i;k< size+i;k++){
            ansed *= matrix_ans[k-i][k%size];
          }
        final_ans +=ansed;
        ansed = 1;
      }
      for(let i=0;i< size;i++){
          for(let k=i;k< size+i;k++){
            ansed *= matrix_ans[((size-1)-(k-i))%size][k%size];
          }
        final_ans -=ansed;
        ansed = 1;
      }
    }
    return final_ans;
  } 


  render() {
    return (
      <div style={{ textAlign: 'center',fontSize: 20}}>
        <h1 style={{fontSize:50,color:"black"}}>CramerRule</h1>
        <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{borderRadius: '8px', // Adjusted border radius// Softer shade of grey
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',paddingBottom:8,paddingTop:5}}>
          <label>Dimension</label>
          <p></p>
          <TextFields 
            type="number" 
            placeholder="1" 
            value={this.state.dimension} 
            onChange={this.handleDimensionChange} 
          />
          
        </Container>
        <h3>Enter Matrix Values</h3>
        <div>
               {this.state.matrix.map((row, rowIndex) => (
              <div key={rowIndex}>
                {row.map((value, colIndex) => (
                
                    <TextFields 
             
                    key={colIndex}
                    type="number"
                    value={value}
                    onChange={(e) => this.handleMatrixChange(e, rowIndex, colIndex)}
                  />
          
                  
                ))}
              </div>
            ))}
        </div>    
        <p></p>
        <ButtonUsage word={"Calculate"} functionName={this.calculate} />
        <Container>
          {this.state.answer.map((value,index) => (<p>x{index}: {value}</p>))}
        </Container>
        
                
      </div>
    );
  }
}

export default Cramerrule;