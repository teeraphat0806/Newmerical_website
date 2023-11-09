import React, { Component } from 'react';
import { pow, sqrt } from 'mathjs';
import ButtonUsage from '../button';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextFields from '../textfield';
import Cards from '../cards';
import {yellow}  from '@mui/material/colors';
class SecantMethod extends Component {
  constructor() {
    super();
    this.state = {
      x0: 1, // Initial guess x0
      x1: 2, // Initial guess x1
      ans: " ",

      tolerance: 0.00001, // Tolerance for stopping criterion
      maxIterations: 100, // Maximum number of iterations
      result: null, // The approximate root
    };
  }
  handleChange_x0 = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ x0: parseFloat(event.target.value) });
  }
  handleChange_x1 = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ x1: parseFloat(event.target.value) });
  }
  handleChange_ans = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ ans: event.target.value });
  }
  handleChange_tolerance = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ tolerance:  parseFloat(event.target.value) });
  }
  handleChange_maxIterations = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ maxIterations: parseInt(event.target.value) });
  }
  calculateRoot = () => {
    let { x0, x1, ans, tolerance, maxIterations } = this.state;
    let x2, f0, f1, f2;

    for (let i = 0; i < maxIterations; i++) {
      f0 = this.functionToSolve(x0);
      f1 = this.functionToSolve(x1);

      if (Math.abs(f0) < tolerance) {
        this.setState({ result: x0 });
        return;
      }

      if (Math.abs(f1) < tolerance) {
        this.setState({ result: x1 });
        return;
      }

      x2 = x1 - (f1 * (x1 - x0)) / (f1 - f0);
      f2 = this.functionToSolve(x2);

      if (Math.abs(f2) < tolerance) {
        this.setState({ result: x2 });
        return;
      }

      x0 = x1;
      x1 = x2;
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
    const { x0, x1, ans, tolerance, maxIterations, result } = this.state;
    return (
      <div style={{ textAlign: 'center',fontSize: 20,margin: 20}}>
        <h1 style={{fontSize:50,color:"black"}}> Secant method </h1>
          <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{borderRadius: '8px', // Adjusted border radius// Softer shade of grey
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
              <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} >
                <Grid item xs={6}>
                  <label>Initial Guess (x0):</label>
                  <TextFields 
                    type="number" 
                    placeholder="1" 
                    value={x0} 
                    onChange={this.handleChange_x0} 
                  />
                </Grid>
                <Grid item xs={6}>
                  <label>Initial Guess (x1):</label>
                    <TextFields 
                      type="number" 
                      placeholder="1" 
                      value={x1} 
                      onChange={this.handleChange_x1} 
                    />
                </Grid>
                <Grid item xs={6}>
                  <label>Function :</label>
                  <TextFields 
                    type="text" 
                    placeholder="1" 
                    value={ans} 
                    onChange={this.handleChange_ans} 
                  />
                </Grid>
                <Grid item xs={6}>
                  <label>Tolerance:</label>
                    <TextFields 
                      type="number" 
                      placeholder="1" 
                      value={tolerance} 
                      onChange={this.handleChange_tolerance} 
                      step="0.01"
                    />
                </Grid>
                <Grid item xs={6}>
                  <label>Max Iterations:</label>
                    <TextFields 
                        type="number" 
                        placeholder="1" 
                        value={maxIterations} 
                        onChange={this.handleChange_maxIterations}                         
                    />
                </Grid>
                
              </Grid>
              <p> </p>
              <Container  maxWidth="sm" sx={{paddingBottom:5}} >
                <ButtonUsage word={"Calculate Root"} functionName={this.calculateRoot} sx={{m:2}}/>
                <p></p>
              {result !== null &&    <Cards word="Result"  hoverWord={result} fontsize={20} color={yellow["700"]}
               fontcolor="white"  hoverBackgroundColor="black" hoverFontColor={yellow["700"]}  borderRadius={11}/>}
              </Container>
                
              <p ></p>
          </Container>  

          
      
      </div>
    );
  }
}

export default SecantMethod;