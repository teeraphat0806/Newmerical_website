
import React, { Component } from 'react';
import { pow, sqrt } from 'mathjs';
import ButtonUsage from '../button';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextFields from '../textfield';
import Cards from '../cards';
import {yellow}  from '@mui/material/colors';
class FalsePositionMethod extends Component {
  constructor() {
    super();
    this.state = {
      a: 0, // Initial lower bound
      b: 1, // Initial upper bound
      ans: "",
      root: 1,
      tolerance: 0.00001, // Tolerance for stopping criterion
      maxIterations: 100, // Maximum number of iterations
      result: null, // The approximate root
    };
  }
  handleChange_a = (event) =>{
    this.setState({a: parseFloat(event.target.value)});
  }
  handleChange_b = (event) =>{
    this.setState({b: parseFloat(event.target.value)});
  }
  handleChange_ans = (event) =>{
    this.setState({ans:event.target.value});
  }
  handleChange_tolerance = (event) =>{
    this.setState({tolerance: parseFloat(event.target.value)});
  }
  handleChange_maxIterations = (event) =>{
    this.setState({maxIterations: parseFloat(event.target.value)});
  }
  calculateRoot = () => {
    let { a, b, ans, tolerance, maxIterations } = this.state;
    let fa, fb, c, fc;

    for (let i = 0; i < maxIterations; i++) {
      fa = this.functionToSolve(a);
      fb = this.functionToSolve(b);
      c = (a * fb - b * fa) / (fb - fa);
      fc = this.functionToSolve(c);

      if (Math.abs(fc) < tolerance) {
        this.setState({ result: c });
        return;
      }

      if (fc * fa < 0) {
        b = c;
      } else {
        a = c;
      }
    }

    // If maxIterations is reached without converging, display an error
    this.setState({ result: 'No convergence after max iterations' });
  };

  functionToSolve = (x) => {
    // Replace this with the actual function you want to solve
    // For example, if you want to find the root of f(x) = x^2 - 4:
    return eval(this.state.ans)
  };

  render() {
    const { a, b,ans,root, tolerance, maxIterations, result } = this.state;
    return (
      <div style={{ textAlign: 'center',fontSize: 20}}>
        <h1 style={{fontSize:50,color:"black"}}>False Position Method</h1>
        <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{borderRadius: '8px', // Adjusted border radius// Softer shade of grey
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
           <Grid container rowSpacing={4} columnSpacing={{ xs: 2, sm: 2, md: 3 }} >
            <Grid item xs = {6}>
              <label>Initial Lower Bound (a):</label>
              <TextFields 
              type="number"
              placeholder={a}
              value={a}
              onChange={this.handleChange_a}
              />
            </Grid>
            <Grid item xs = {6}>
              <label>Initial Upper Bound (b):</label>
              <TextFields 
                type="number"
                placeholder={b}
                value={b}
                onChange={this.handleChange_b}
              />
            </Grid>
            <Grid item xs = {6}>
              <label>Initial (ans):</label>
              <TextFields 
                type="text"
                placeholder={ans}
                value={ans}
                onChange={this.handleChange_ans}
              />
            </Grid>
            <Grid item xs = {6}>
              <label>Tolerance:</label>
              <TextFields 
                type="number"
                placeholder={tolerance}
                value={tolerance}
                onChange={this.handleChange_tolerance}
                step="0.0001"
              />
            </Grid>
            <Grid item xs = {6}>
              <label>Max Iterations:</label>
              <TextFields 
                type="number"
                placeholder={maxIterations}
                value={maxIterations}
                onChange={this.handleChange_maxIterations}
              />
            </Grid>
           </Grid>
           <Container sx={{marginTop:5,paddingBottom:2}}>
            <ButtonUsage word={"Calculate Root"} color={"black"}functionName={this.calculateRoot}/>
            <p></p>
            {result !== null &&    <Cards word="Result"  hoverWord={result} fontsize={20} color={yellow["700"]} fontcolor="white"  hoverBackgroundColor="black" hoverFontColor={yellow["700"]}  borderRadius={11}/>}
            
            </Container>
        </Container>
        
        
   
  
      </div>
    );
  }
}

export default FalsePositionMethod;