import React, { Component } from 'react';
import { pow, sqrt } from 'mathjs';
import Show_graph from '../graph_show';
import { db } from '../config/firebase';
import { getDocs, collection, addDoc } from "firebase/firestore";
import getRandomNumber from './random_index';
import ButtonUsage from '../button';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextFields from '../textfield';
import Cards from '../cards';
import {yellow}  from '@mui/material/colors';
class OnePointIteration extends Component {
  constructor() {
    super();
    this.state = {
      initialGuess: 0,
      tolerance: 0.0001,
      ans: "1/43-x",
      func: "1/43-x",
      result: null,
      xe: 0,
      allfunc: [],
      guess: []
    };
  }

  g = (x) => eval(this.state.func);

  handleChange_initialGuess = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ initialGuess: parseFloat(event.target.value) });
  }
  handleChange_ans = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ ans: event.target.value });
  }
  handleChange_tolerance = (event) => {
    // Use parseInt or parseFloat depending on your needs
    this.setState({ tolerance: parseFloat(event.target.value) });
  }
  componentDidMount() {
    const database_equation = collection(db, "newton_ralpson");
    const getDataList = async () => {
      try {
        const data = await getDocs(database_equation);
        const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        
        this.setState({
          allfunc: filteredData.map(data => data.function),
          func: filteredData[0].function,
          ans: filteredData[0].function,
          guess: filteredData.map(data => data.guess),
          initialGuess: filteredData[0].guess
        }, () => this.calculateRoot());

      } catch (err) {
        console.log(err);
      }
    };
    getDataList();
  }

  submitdata = () => {
    try {
      addDoc(collection(db, "newton_ralpson"), {
        function: this.state.ans,
        guess: parseFloat(this.state.initialGuess)
      });
    } catch (err) {
      console.error(err);
    }
    console.log("submit complete");
  };

  check_functionarray = (funct) => {
    for (let i = 0; i < this.state.allfunc.length; i++) {
      if (funct === this.state.allfunc[i]) {
        return true;
      }
    }
    return false;
  }

  randomfunc = () => {
    let indexs = getRandomNumber(this.state.allfunc.length);
    this.setState({
      func: this.state.allfunc[indexs],
      ans: this.state.allfunc[indexs],
      initialGuess: this.state.guess[indexs]
    }, () => this.calculateRoot());
  }

  calculateRoot = () => {
    let x0 = this.state.initialGuess;
    let x1 = this.g(x0);
    let iteration = 0;
    let max = 100000;

    while (Math.abs(x1 - x0) >= this.state.tolerance) {
      x0 = x1;
      x1 = this.g(x0);
      iteration++;
      if (iteration > max) {
        break;
      }
    }

    if (iteration >= max) {
      this.setState({ result: `It max iteration` });
    } else if (iteration < max && !this.check_functionarray(this.state.ans)) {
      this.setState({
        result: `Root: ${x1} (found in ${iteration} iterations)`,
        xe: x1
      }, () => this.submitdata());
    }
  }

  render() {
    return (
      <div style={{ textAlign: 'center',fontSize: 20}}>
        <h1 style={{fontSize:50,color:"black"}}> Onepoint Iteration </h1>
          <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{borderRadius: '8px', // Adjusted border radius// Softer shade of grey
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
             <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} >
                <Grid item xs={6}>
                  <label htmlFor="initialGuess">Initial Guess:</label>
                  <TextFields 
                    type="number" 
                    placeholder="1" 
                    value={this.state.initialGuess} 
                    onChange={this.handleChange_initialGuess} 
                  />
                 
                </Grid>
                <Grid item xs={6}>
                  <label htmlFor="function">function:</label>
                  <TextFields 
                    type="text" 
                    placeholder="1" 
                    value={this.state.ans} 
                    onChange={this.handleChange_ans} 
                  />
                </Grid>
                <Grid item xs={6}>
                  <label htmlFor="tolerance">Tolerance:</label>
                  <TextFields 
                    type="text" 
                    placeholder="0.1" 
                    value={this.state.tolerance} 
                    onChange={this.handleChange_tolerance} 
                    step="0.001"
                  />
                </Grid>
                <Grid item sx={{m:2}}>
              
               </Grid>
             </Grid>
             <p> </p>
             <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} >
                <Grid item xs={6}>
                  <ButtonUsage word={"Calculate Root"} functionName={this.calculateRoot}/>
                </Grid>
                <Grid item xs={6}>
                  <ButtonUsage word={"Random"} color={"red"}functionName={this.randomfunc}/>
                </Grid>
             </Grid>
             <Grid item sx={{m:3}}>
              
               </Grid>
               {this.state.result !== null &&    <Cards word="Result"  hoverWord={this.state.result} fontsize={20} color={yellow["700"]} fontcolor="white"  hoverBackgroundColor="black" hoverFontColor={yellow["700"]}  borderRadius={11}/>}
             <Grid item sx={{m:5}}>
              
            </Grid>
             <Show_graph func={this.state.func} x={this.state.xe} y={this.g(this.state.xe)} />
          </Container>
       
      </div>
    );
  }
}

export default OnePointIteration;
