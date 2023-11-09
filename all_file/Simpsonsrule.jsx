import React, { Component } from 'react';
import { pow, sqrt } from 'mathjs';
import Show_graph from '../graph_show';
import ButtonUsage from '../button';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextFields from '../textfield';
import Cards from '../cards';
import {yellow}  from '@mui/material/colors';
class SimpsonsRule extends Component {
  constructor() {
    super();
    this.state = {
      funcString: 'x*x',
      func: 'x*x',
      lowerLimit: 0,
      upperLimit: 1,
      subintervals: 10,
      result: null,
      accept: true
    };
  }

  evaluateFunction = (func, x) => {
    return eval(func.replace('x', x));
  };
  handleChange_funcString = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ funcString: event.target.value });
  }
  handleChange_lowerLimit = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ lowerLimit: Number(event.target.value)  });
  }
  handleChange_upperLimit = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ upperLimit: Number(event.target.value)  });
  }
  handleChange_subintervals = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ subintervals: Number(event.target.value)  });
  }
  calculateIntegral = () => {
    this.setState({ accept: true });
    if (this.state.subintervals % 2 === 0) {
      let h = (this.state.upperLimit - this.state.lowerLimit) / this.state.subintervals;
      let sum = this.evaluateFunction(this.state.funcString, this.state.lowerLimit) + 
                this.evaluateFunction(this.state.funcString, this.state.upperLimit);

      for (let i = 1; i < this.state.subintervals; i += 2) {
        sum += 4 * this.evaluateFunction(this.state.funcString, this.state.lowerLimit + i * h);
      }

      for (let i = 2; i < this.state.subintervals - 1; i += 2) {
        sum += 2 * this.evaluateFunction(this.state.funcString, this.state.lowerLimit + i * h);
      }

      this.setState({ result: (h / 3) * sum, func: this.state.funcString });
    } else {
      this.setState({ accept: false });
    }
  };

  render() {
    return (
      <div  style={{ textAlign: 'center',fontSize: 20}}>
        <h1 style={{fontSize:50,color:"black"}}> Simpsonsrule </h1>
        <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{borderRadius: '8px', // Adjusted border radius// Softer shade of grey
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
        
        <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} >
          <Grid item xs={6}>
              <p>Function f(x): </p>
              <TextFields 
                type="text" 
                placeholder="Enter f(x)" 
                value={this.state.funcString} 
                onChange={this.handleChange_funcString} 
                />
          </Grid>
          <Grid item xs={6}>
            <p>Lower Limit: </p>
            <TextFields 
              type="number" 
              placeholder="1" 
              value={this.state.lowerLimit} 
              onChange={this.handleChange_lowerLimit} 
            />
          </Grid>
          <Grid item xs={6}>
            <p>Upper Limit: </p>
            <TextFields 
              type="number" 
              placeholder="1" 
              value={this.state.upperLimit} 
              onChange={this.handleChange_upperLimit} 
            />
          </Grid>
          <Grid item xs={6}>
            <p>Subintervals: </p>
            <TextFields 
              type="number" 
              placeholder="1" 
              value={this.state.subintervals} 
              onChange={this.handleChange_subintervals} 
            />
            
          </Grid>
        </Grid>

        <p> </p>
        <ButtonUsage word={"Calculate"} functionName={this.calculateIntegral}/>
        <p> </p>

        {this.state.result !== null &&  <Cards word="Result"  hoverWord={this.state.result} fontsize={20} color={yellow["700"]} fontcolor="white"  hoverBackgroundColor="black" hoverFontColor={yellow["700"]}  borderRadius={11}/>}
        {this.state.accept === false && <div>Please input Subintervals odd number</div>}
        <p> </p>
        <Show_graph func={this.state.func} x={this.state.result} y={this.evaluateFunction(this.state.func, this.state.result)}/>
    
        </Container>
      </div>
    );
  }
}

export default SimpsonsRule;