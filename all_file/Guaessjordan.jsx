import React, { Component } from 'react';
import { db } from'../config/firebase'
import {getDocs ,collection ,addDoc} from "firebase/firestore";
import getRandomNumber from './random_index';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextFields from '../textfield';
import Cards from '../cards';
import ButtonUsage from '../button';
import {yellow}  from '@mui/material/colors';
export default class GaussianJordan extends React.Component{
    constructor(){
        super();
        this.state = {
            desiredRowCount:3,
            matrix:Array(3).fill().map(() => Array(4).fill(0)),
            solution:[],
            errorMessage:'',
            database_equation:collection(db,"guessian"),
            y:[],
            x:[], 
            all_dimension:[]
        }
        this.setmatrix = this.setmatrix.bind(this);
        this.random_matrix = this.random_matrix.bind(this);
        this.submitdata = this.submitdata.bind(this);
        this.solve = this.solve.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSizeChange = this.handleSizeChange.bind(this);
        this.initializeMatrix = this.initializeMatrix.bind(this);
    }
    handleChange_desiredRowCount = (event) => {
      // Use parseInt or parseFloat depending on your needs
      this.setState({desiredRowCount:event.target.value});
    }
    initializeMatrix(size) {
      return Array(size).fill().map(() => Array(size + 1).fill(0));
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
           }
           for(let i=0;i<d.length;i++){
            arrayy.push(d[i].split(','));
              for(let j=0;j<arrayy[i].length;j++){
                arrayy[i][j] = parseFloat(arrayy[i][j]);
              }
           }
                
                
            this.setState({all_dimension: b,desiredRowCount:b[0],x:arrayx,y:arrayy,matrix:this.setmatrix(arrayx[0],arrayy[0],b[0])});
        }catch(err){
            console.log(err);
        }
    };
    componentDidMount(){
        this.fetchData();
    };
    random_matrix(){
        let indexs = getRandomNumber(this.state.x.length);
        let new_matrix = this.setmatrix(this.state.x[indexs],this.state.y[indexs],this.state.all_dimension[indexs]);
        this.setState({matrix:new_matrix,desiredRowCount:new_matrix.length});
        this.solve();
    };
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
    async submitdata() {
      const flattenedMatrix = this.state.matrix.flat();
      const sX = flattenedMatrix.slice(0, -this.state.matrix.length).join(",");
      const sY = flattenedMatrix.slice(-this.state.matrix.length).join(",");
      
      try {
          await addDoc(this.state.database_equation, {
              dimension: this.state.desiredRowCount,
              x: sX,
              y: sY
          });
          console.log("Submit complete");
      } catch (err) {
          console.error(err);
      }
  }
    solve(){
        const n = this.state.matrix.length;
        const augmentedMatrix =this.state.matrix.map((row, i) => [...row, i === n - 1 ? 1 : 0]);
        let error_message='';
        let answer;
        for (let i = 0; i < n; i++) {
          // Pivoting
          let maxRow = i;
          for (let j = i + 1; j < n; j++) {
            if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
              maxRow = j;
            }
          }
          [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]];
          if (augmentedMatrix[i][i] === 0) {
            error_message = 'No unique solution exists.';
            this.setState({ errorMessage: error_message, solution: [] });
            return;
          } 
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
        for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += augmentedMatrix[i][j] * result[j - i - 1]; // Fix the indexing here
        }
        result.unshift((augmentedMatrix[i][n] - sum) / augmentedMatrix[i][i]);
        }
        
        if (result.some(isNaN)) {
          error_message = 'No unique solution exists.';
          answer=[];
        } else {
          answer = result;
        }
        this.setState({errorMessage:error_message,solution:answer})
      };
      handleInputChange(e, rowIdx, colIdx){
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
          const newMatrix = [...this.state.matrix];
          newMatrix[rowIdx][colIdx] = newValue;
          this.setState({matrix:newMatrix});
        }
      };
      handleSizeChange() {
        const size = parseInt(this.state.desiredRowCount, 10);
        if (size > 0) {
          this.setState({ matrix: this.initializeMatrix(size) });
        }
      }
    render(){
        return (
          <div style={{ textAlign: 'center',fontSize: 20}}>
              <h1 style={{fontSize:50,color:"black"}}> Gaussian Jordan Elimination </h1>
                <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{paddingBottom:5,marginBottom:5,borderRadius: '8px', // Adjusted border radius// Softer shade of grey
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
                  <p>Matrix Size</p>
                   <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} sx={{paddingLeft:"5%",paddingTop:4}} >
                    
                    <Grid item xs={7} >
                      <TextFields 
                    type="number" 
                    placeholder="1" 
                    value={this.state.desiredRowCount} 
                    onChange={this.handleChange_desiredRowCount} 
                    min="1"
                      />
                    </Grid>
                    <Grid item xs={1} sx={{marginTop:1}}>
                      <ButtonUsage word={"Apply"} functionName={this.handleSizeChange}/>
                    </Grid>
                  </Grid>
                  
                  
                
                </Container>
          
              <div>
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
              </div>
              <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} sx={{paddingLeft:"40%",paddingTop:5,marginBottom:5}} >
                <Grid item xs={1}>
                  <ButtonUsage word={"Solve"} functionName={this.solve}/>
                </Grid>    
                <Grid item xs={4}>
                  <ButtonUsage word={"Random"} color="red" functionName={this.random_matrix}/>
                </Grid>    
                <Grid item xs={{m:2}}>

                </Grid>
              </Grid>
              
              <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{backgroundColor:yellow[700],marginBottom:2,borderRadius: '8px', // Adjusted border radius// Softer shade of grey
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
                {this.state.errorMessage &&   <Cards word="Result"  hoverWord={this.state.errorMessage } fontsize={20} color={yellow["700"]} fontcolor="white"  hoverBackgroundColor="black" hoverFontColor={yellow["700"]}  borderRadius={11}/>}
                {this.state.solution.length > 0 && (
                  <div style={{paddingTop:2,paddingBottom:4}}>
                    <h2>Solutions</h2>
                    {this.state.solution.map((solution, idx) => (   // Corrected the typo here
                      <p key={idx}>x{idx + 1} = {solution.toFixed(4)}</p>
                    ))}
                  </div>
                  
                )}<p></p>
              </Container>
             
              
            </div>
          );
    }
}