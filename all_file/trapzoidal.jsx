import React, { Component } from 'react';
import { derivative, pow, sqrt } from 'mathjs';
import Show_graph from '../graph_show';
import ButtonUsage from '../button';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextFields from '../textfield';
import Cards from '../cards';
import {yellow}  from '@mui/material/colors';
class TrapezoidalRule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fx: '',
      func: '',
      a: 0,
      b: 0,
      n: 1,
      result: null,
      y: null,
      // gui
      fx_gui: '',
      func_gui: '',
      a_gui: 0,
      b_gui: 0,
      n_gui: 1,
   
    };
  }
  handleChange_fxgui = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ fx_gui: event.target.value });
  }
  handleChange_agui= (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ a_gui: parseFloat(event.target.value, 10) });
  }
  handleChange_bgui = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ b_gui: parseInt(event.target.value, 10) });
  }
  handleChange_ngui = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ n_gui: event.target.value });
  }
  f(x) {
    return eval(this.state.fx);
  }

  approximateIntegral = () => {
    this.setState({ fx: this.state.fx_gui });
    this.setState({ func: this.state.func_gui });
    this.setState({ a: this.state.a_gui });
    this.setState({ b: this.state.b_gui });
    this.setState({ n: this.state.n_gui });
  
    let sum = 0;
    const h = (this.state.b - this.state.a) / this.state.n;

    for (let i = 1; i < this.state.n; i++) {
      sum += this.f(this.state.a + (h * i));
    }
    sum *= 2;
    sum += (this.f(this.state.a) + this.f(this.state.b));
    sum *= (h * 0.5);

    const integralValue = sum;
    this.setState({
      result: integralValue,
      func: this.state.fx,
      y: this.f(integralValue)
    });
  }

  render() {
    return (
      <div style={{ textAlign: 'center',fontSize: 20}}>
        <h1 style={{fontSize:50,color:"black"}}> Trapzoidal </h1>
        <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{borderRadius: '8px', // Adjusted border radius// Softer shade of grey
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
        
          <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} >
            <Grid item  xs={6}>
               <p>Function</p>
                <TextFields 
                  type="text" 
                  placeholder="Enter f(x)" 
                  value={this.state.fx_gui} 
                  onChange={this.handleChange_fxgui} 
                />
            </Grid>
            <Grid item  xs={6}>
              <p>Lower limit a</p>
              <TextFields
                type="number" 
                placeholder="Enter lower limit (a)" 
                value={this.state.a_gui} 
                onChange={this.handleChange_agui} 
              />
            </Grid>
            <Grid item  xs={6}>
               <p>Upper limit b</p>
                <TextFields 
                  type="number" 
                  placeholder="Enter upper limit (b)" 
                  value={this.state.b_gui} 
                  onChange={this.handleChange_bgui}
                />
            </Grid>
            <Grid item  xs={6}>
              <p>Number of Trapezoids</p>
              <TextFields
                type="number"
                placeholder="Enter number of trapezoids (n)"
                value={this.state.n_gui}
                onChange={this.handleChange_ngui} // Passing the function as a prop
              />
            </Grid>
           
          </Grid>

          <p> </p>
            <ButtonUsage word={"Calculate"} functionName={this.approximateIntegral}/>
          <p> </p>
          <Container  sx={{textAlign:"left"}}>
            
            
            {this.state.result !== null &&    <Cards word="Result"  hoverWord={this.state.result} fontsize={20} color={yellow["700"]} fontcolor="white"  hoverBackgroundColor="black" hoverFontColor={yellow["700"]}  borderRadius={11}/>}
            <p > </p>
            <p > </p>
            <Show_graph func={this.state.func_gui} x={this.state.result} y={this.state.y}/>
          </Container>
          
         
        </Container>       
      </div>
    );
  }
}

export default TrapezoidalRule;
