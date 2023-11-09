import React, { Component } from 'react';
import { db } from'../config/firebase'
import {getDocs ,collection ,addDoc} from "firebase/firestore";
import getRandomNumber from './random_index';
import { pow, sqrt } from 'mathjs';
import ButtonUsage from '../button';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextFields from '../textfield';
import Cards from '../cards';
import {yellow}  from '@mui/material/colors';
export default class Conjugate_gradient extends React.Component{
    constructor(){
        super();
        this.state = {
            dimension:2,
            matrix: Array.from({ length: 2 }, () => Array(3).fill(0)),
            answer: [],
            numIterations: 0,
            database_equation: collection(db,"Conjugate_gradient"),
            all_dimension:[],
            y:[],
            x:[]
        }
        this.setmatrix = this.setmatrix.bind(this);
        this.random_matrix = this.random_matrix.bind(this);
        this.check_duplicate = this.check_duplicate.bind(this);
        this.submitdata = this.submitdata.bind(this);
        this.handleDimensionChange = this.handleDimensionChange.bind(this);
        this.handleMatrixChange = this.handleMatrixChange.bind(this);
        this.dotProduct = this.dotProduct.bind(this);
        this.matrixVectorMult = this.matrixVectorMult.bind(this);
        this.subtractVectors = this.subtractVectors.bind(this);
        this.addVectors = this.addVectors.bind(this);
        this.scalarMult = this.scalarMult.bind(this);
        this.calculate = this.calculate.bind(this);
    }
    setmatrix(arrayx,arrayy,dimension){
        let new_array = Array();
        let index=0;
        
        for(let i=0;i<dimension;i++){
          new_array.push(Array());
        }
        for(let i=0;i<dimension;i++){
          for(let j=0;j<dimension;j++){
            if(j==dimension-1){
              new_array[i].push(arrayx[index]);
              new_array[i].push(arrayy[i]);
            }else{
              new_array[i].push(arrayx[index]);
            }
            index++;
          }
        }
        return new_array;
      }
    fetchData =  async ()=>{
        try{
          const data = await getDocs(this.state.database_equation);
          const filteredData = data.docs.map((doc)=>({...doc.data(),id: doc.id,}));
          const b =filteredData.map((data)=>data.dimension);
          const c = filteredData.map((data)=>data.x);
          const d = filteredData.map((data)=>data.y);
          let arrayx = [];
          for(let i=0;i<c.length;i++){
            arrayx.push(c[i].split(','));
            for(let j=0;j<arrayx[i].length;j++){
                arrayx[i][j] = parseFloat(arrayx[i][j]);
            }
          }
            let arrayy = [];
            for(let i=0;i<d.length;i++){
              arrayy.push(d[i].split(','));
              for(let j=0;j<arrayy[i].length;j++){
                arrayy[i][j] = parseFloat(arrayy[i][j]);
              }
            }
          this.setState({all_dimension:b,dimension:b[0],x:arrayx,y:arrayy})
          this.calculate();
        }catch(err){
            console.log(err);
        };
    }
    componentDidMount(){
        this.fetchData();
    }
    random_matrix(){
        const index = getRandomNumber(this.state.x.length);
        const matrix = this.setmatrix(this.state.x[index], this.state.y[index], this.state.all_dimension[index]);
        this.setState({ matrix:matrix,dimension:matrix.length });
        this.calculate;
    }
    check_duplicate(){
      for (let i = 0; i < this.state.x.length; i++) {
        for (let k = 0; k < this.state.x[i].length; k++) {
            if (k % (this.state.all_dimension[i] + 1) === this.state.all_dimension[i] &&
                this.state.matrix[i][k] !== this.state.y[i][k % this.state.all_dimension[i]]) {
                return false;
            } else if (this.state.matrix[i][k] !== this.state.x[i][k % this.state.all_dimension[i]]) {
                return false;
            }
        }
    }
    return true;
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
        try{ addDoc(this.state.database_equation,{dimension:this.state.dimension,x:s_x,y:s_y});
        
      }catch(err){
        console.error(err)
      }
      console.log("submit complete");
    };  
    handleDimensionChange(e){
        const newDimension = parseInt(e.target.value, 10);
        const newMatrix = Array.from({ length: newDimension }, () => Array(newDimension + 1).fill(0));
        this.setState({ dimension: newDimension, matrix: newMatrix });
    };
    handleMatrixChange(e, rowIndex, colIndex){
        const newValue = parseFloat(e.target.value);
        const newMatrix = this.state.matrix;
        newMatrix[rowIndex][colIndex] = newValue;
        this.setState({matrix:newMatrix});
    };
    dotProduct(a, b){
        return a.reduce((acc, val, index) => acc + val * b[index], 0);
    };
    matrixVectorMult(A, vec){
        return A.map(row =>this.dotProduct(row, vec))
    };
    subtractVectors(a, b){
        return a.map((val, index) => val - b[index])
    };
    addVectors(a, b){
        return a.map((val, index) => val + b[index])
    };
    scalarMult(scalar, vec){ 
        return vec.map(val => scalar * val)
    }; 
    calculate(){
        const A = this.state.matrix.map(row => row.slice(0, this.state.dimension));
        const b = this.state.matrix.map(row => row[this.state.dimension]);

        let x = Array(this.state.dimension).fill(0);
        let r = this.subtractVectors(b, this.matrixVectorMult(A,x));
        let p = [...r];
        let rsold = this.dotProduct(r, r);

        let iterationCount = 0; // Use this to count the iterations

        for (let i = 0; i < this.state.dimension; i++) {
            const Ap = this.matrixVectorMult(A, p);
            const alpha = rsold / this.dotProduct(p, Ap);
            x = this.addVectors(x, this.scalarMult(alpha, p));
            r = this.subtractVectors(r, this.scalarMult(alpha, Ap));

            iterationCount++; // Increment the iteration count

            const rsnew = this.dotProduct(r, r);
            if (Math.sqrt(rsnew) < 1e-10) break;
            p = this.addVectors(r,this.scalarMult(rsnew / rsold, p));
            rsold = rsnew;
        }
        if(this.check_duplicate() == true){
            this.submitdata();
        }
        this.setState({answer:x,numIterations:iterationCount});
    };
    render(){
        return (
            <div style={{ textAlign: 'center',fontSize: 20}}>
                <h1 style={{fontSize:50,color:"black"}}>Conjugate Gradient</h1>
                <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{borderRadius: '8px', // Adjusted border radius// Softer shade of grey
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',paddingBottom:3}}>
                  <p>Matrix Dimension</p>
                  <TextFields 
                      type="number" 
                      placeholder="2" 
                      value={this.state.dimension} 
                      onChange={this.handleDimensionChange} 
                      />      
                </Container>
            
                <div>
                    <h3>Enter Matrix Values</h3>
                    {this.state.matrix.map((row, rowIndex) => (
                        <div key={rowIndex}>
                            {row.map((value, colIndex) => (
                                  <TextFields 
                                  key={colIndex}
                                  type="number" 
                                  placeholder="2" 
                                  value={value} 
                                  onChange={(e) => this.handleMatrixChange(e, rowIndex, colIndex)} 
                                  />      
                            
                            ))}
                        </div>
                    ))}
                </div>
                <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} style={{marginTop:5,marginLeft:"34%"}} >
                  <Grid item xs= {2}>
                    <ButtonUsage word={"Calculate"} functionName={this.calculate}/>
                  </Grid>
                  <Grid item xs= {1}>
                    <ButtonUsage color={"red"} word={"Random"} functionName={this.random_matrix}/>
                  </Grid>
                </Grid>
                <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{borderRadius: '8px', // Adjusted border radius// Softer shade of grey
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',paddingBottom:3,backgroundColor:yellow[700],paddingTop:2,marginTop:2}}>
                  <h3>Final Answer</h3>
                 
                    {this.state.answer.map((value, index) => (<Grid item xs= {2}><p style={{fontSize:20,textAlign:'center',color:"white"}}>x{index+1}= {value.toFixed(4)}</p></Grid>))}    
                  
                 
                  <h3>Number of Iterations</h3>
                  <p style={{fontSize: 30,color:"white"}}>{this.state.numIterations}</p>                
                </Container>              

            </div>
        );
    }
}