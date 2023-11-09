import React, { Component } from 'react';
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

export default class GaussianElimination extends React.Component{
  constructor(){
        super();
        this.state = {
            desiredRowCount: 3,
            matrix: [],
            solution: [],
            errorMessage: '',
            database_equation: collection(db,"guessian"),
            all_dimension: [],
            y:[],
            x:[]
        }
        this.setmatrix = this.setmatrix.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.random_matrix = this.random_matrix.bind(this);
        this.check_duplicate = this.check_duplicate.bind(this);
        this.submitdata = this.submitdata.bind(this);
        this.solve = this.solve.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSizeChange = this.handleSizeChange.bind(this);
    }
    fetchData = async()=>{
        try{
            const data = await getDocs(this.state.database_equation);
            const filteredData = data.docs.map((doc)=>({...doc.data(),id: doc.id,}));
            const b =filteredData.map((data)=>data.dimension);
            const c = filteredData.map((data)=>data.x);
            const d = filteredData.map((data)=>data.y);
            let arrayx = [];
            let arrayy = [];
            for(let i=0;i<c.length;i++){
              arrayx.push(c[i].split(','));
              for(let j=0;j<arrayx[i].length;j++){
                  arrayx[i][j] = parseFloat(arrayx[i][j]);
              }
              arrayx[i].pop();
           }
           for(let i=0;i<d.length;i++){
            arrayy.push(d[i].split(','));
              for(let j=0;j<arrayy[i].length;j++){
                arrayy[i][j] = parseFloat(arrayy[i][j]);
              }
              arrayy[i].pop();
           }
            this.setState({all_dimension: b,desiredRowCount:b[0],x:arrayx,y:arrayy,matrix:this.setmatrix(arrayx[0],arrayy[0],b[0])});
            this.solve();
        }catch(er){
            console.log(er);
        }
    } 
    handleInputChanged = (event) =>{
      this.setState({desiredRowCount: Number(event.target.value)})
    }
    setmatrix(arrayX, arrayY, dimension) {
      let newMatrix = [];
      let index = 0;
      
      for (let i = 0; i < dimension; i++) {
          let row = [];
          for (let j = 0; j < dimension; j++) {
              if (j === dimension - 1) {
                  row.push(arrayX[index], arrayY[i]);
              } else {
                  row.push(arrayX[index]);
              }
              index++;
          }
          newMatrix.push(row);
      }
      return newMatrix;
  }
    componentDidMount(){
        this.fetchData();
    }
    random_matrix(){
        let indexs = getRandomNumber(this.state.x.length);
        let new_matrix = this.setmatrix(this.state.x[indexs],this.state.y[indexs],this.state.all_dimension[indexs]);
        this.setState({matrix:new_matrix,desiredRowCount:new_matrix.length});
        console.log(this.state.matrix);
        this.solve();
    }
    check_duplicate(){
        let check = true;
        for(let i=0;i<this.state.x.length;i++){
          for(let k=0;k<this.state.x[i].length;k++){
            if(k%(this.state.all_dimension[i]+1)==this.state.all_dimension[i] && this.state.matrix[i][k] != this.state.y[i][k%(this.state.all_dimension[i])]){
                check = false;
                break;
            }else if( this.state.matrix[i][k] != this.state.x[i][k%(this.state.all_dimension[i])]){
                check = false;
                break;
            }
          }
        }
        return check;
    }
    submitdata(){
        let s_x = "";
        let s_y = "";
        for(let i=0;i<this.state.matrix.length;i++){
          for(let k=0;k<this.state.matrix[0].length;k++){
            if(k == this.state.matrix[0].length-1){
              s_y = s_y.concat(String(this.state.matrix[i][k]),",");     
            }else{
              s_x = s_x.concat(String(this.state.matrix[i][k]),",");
            
            }
          }
        }
        try{ addDoc(this.state.database_equation,{dimension:this.state.desiredRowCount,x:this.state.s_x,y:this.state.s_y});
        
      }catch(err){
        console.error(err)
      }
      console.log("submit complete");
      
    };  
    solve = () => {
        const n = this.state.matrix.length;
        const augmentedMatrix = this.state.matrix.map((row, i) => [...row, i === n - 1 ? 1 : 0]);
    
        for (let i = 0; i < n; i++) {
          // Pivoting
          let maxRow = i;
          for (let j = i + 1; j < n; j++) {
            if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
              maxRow = j;
            }
          }
          [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]];
    
          // Elimination
          for (let j = i + 1; j < n; j++) {
            const factor = augmentedMatrix[j][i] / augmentedMatrix[i][i];
            for (let k = i; k < n * 2; k++) {
              augmentedMatrix[j][k] -= factor * augmentedMatrix[i][k];
            }
          }
        }
    
        // Back substitution
        const result = [];
        let error_message = "";
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += augmentedMatrix[i][j] * result[j - i - 1]; // Fix the indexing here
      }
      result.unshift((augmentedMatrix[i][n] - sum) / augmentedMatrix[i][i]);
    }
        if (result.some(isNaN)) {
          this.setState({solution:[],errorMessage:'No unique solution exists.'});
        } else {
          this.setState({solution:result,errorMessage:error_message});
        }
   
      };
    handleInputChange(e, rowIdx, colIdx){
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
          const newMatrix = [...this.state.matrix];
          newMatrix[rowIdx][colIdx] = newValue;
          this.setState({matrix: newMatrix});
        }
    };
    handleSizeChange(){
        const newMatrix = Array(this.state.desiredRowCount).fill().map(() => Array(this.state.desiredRowCount+1).fill(0));
        this.setState({matrix:newMatrix});
    };
    render() {
        return (
          <div style={{textAlign:'center',fontSize:20}}>
           <h1 style={{fontSize:50,color:'black'}}>Gaussian Elimination</h1>
            <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{borderRadius: '8px', // Adjusted border radius// Softer shade of grey
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',paddingBottom:3,marginBottom:3}}>
                <div>
                    <p>Matrix Size:</p> 
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} sx={{paddingLeft:"20%",paddingTop:5,marginBottom:5}} >
                      <Grid item xs={6}>
                        <TextFields  
                        type="number"
                        value={this.state.desiredRowCount}
                        onChange={this.handleInputChanged}
                        min={2}
                        />
                      </Grid>
                      <Grid item xs={1} sx={{marginTop:1}}>
                        <ButtonUsage word={"Apply"} functionName={this.handleSizeChange}/>
                      </Grid>
                    </Grid>
                    
                   
                   
                </div>
            </Container>
                
              {this.state.matrix.map((row, rowIdx) => (
                <div key={rowIdx}>
                  {row.map((cell, colIdx) => (
                    <TextFields 
                      type="number"
                      placeholder="1" 
                      key={colIdx}
                      value={cell}
                      onChange={(e) => this.handleInputChange(e, rowIdx, colIdx)}
                    />
                   
                  ))}
                </div>
              ))}
          
              <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} sx={{paddingLeft:"40%",paddingTop:5,marginBottom:5}} >
                <Grid item xs={1}>
                  <ButtonUsage word={"Solve"} functionName={this.solve}/>
                </Grid>
                <Grid item xs={3}>
                  <ButtonUsage word={"Random"} color={"red"} functionName={this.random_matrix}/>
                </Grid>
              </Grid>
             
              
              <Container maxWidth="sm" style={{textAlign: 'center'}} sx={{paddingTop:2,paddingBottom:2,backgroundColor:yellow[700],borderRadius: '8px', // Adjusted border radius// Softer shade of grey
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
                {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
                {this.state.solution.length > 0 && (
                      <div>
                          <h2>Solutions:</h2>
                          {this.state.solution.map((solutions, idx) => (
                              <p key={idx}>x{idx + 1} = {solutions.toFixed(4)}</p>
                          ))}
                      </div>
                  )}
              </Container>
             
            </div>
       
        );
    };
    
}