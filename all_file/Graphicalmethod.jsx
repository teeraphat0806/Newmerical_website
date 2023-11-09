import "mafs/core.css";
import "mafs/font.css";
import React from 'react';
import { derivative, max ,pow, sqrt } from 'mathjs'
import Show_graph from '../graph_show';
import { db } from '../config/firebase';
import { getDocs, collection, addDoc } from "firebase/firestore";
import getRandomNumber from './random_index';
import { Mafs, Coordinates, Plot, Theme } from "mafs";
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextFields from '../textfield';
import ButtonUsage from '../button';
import {yellow}  from '@mui/material/colors';

class Graphical extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      answer: 1,
      equation: "",
      datafunction: []
    };

    this.database_equation = collection(db, "Graphical");
  }

  componentDidMount() {
    this.getDataList();
  }

  getDataList = async () => {
    try {
      const data = await getDocs(this.database_equation);
      const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      this.setState({
        datafunction: filteredData.map(data => data.function),
        answer: filteredData[0].function
      }, this.plot);

    } catch (err) {
      console.error(err);
    }
  }

  plot = () => {
    this.setState({ equation: this.state.answer });

    if (!this.check_functionarray(this.state.answer)) {
      this.submitdata();
    }
  };

  randomfunc = () => {
    let indexs = getRandomNumber(this.state.datafunction.length);
    this.setState({ answer: this.state.datafunction[indexs] }, this.plot);
  };

  submitdata = () => {
    try {
      addDoc(this.database_equation, { function: this.state.answer });
      console.log("submit complete");
    } catch (err) {
      console.error(err);
    }
  };

  check_functionarray = (funct) => {
    for (let i = 0; i < this.state.datafunction.length; i++) {
      if (funct === this.state.datafunction[i]) {
        return true;
      }
    }
    return false;
  }

  handleAnswerChange = (e) => {
    this.setState({ answer: e.target.value });
  };

  render() {
    const { answer, equation } = this.state;

    return (
      <div style={{ textAlign: 'center',fontSize: 20}}>
         <h1 style={{fontSize:50,color:"black"}}> Graphical Method </h1>
         
        <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{borderRadius: '8px', // Adjusted border radius// Softer shade of grey
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
            <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} >
              <Grid item xs={3} >
                <p style={{fontSize:40}}>Function:</p>
              </Grid>
              <Grid item xs={7} sx={{marginTop:5}}>
                <TextFields 
                  type="text" 
                  placeholder="0.1" 
                  value={answer} 
                  onChange={this.handleAnswerChange} 
                  step="0.001"
                />
              </Grid>
            </Grid>
           
       
            <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} >
              <Grid item xs={2}>
                <ButtonUsage word={"Plot"} functionName={this.plot}/>
              </Grid>
              <Grid item xs={2}>
                <ButtonUsage word={"Random"} functionName={this.randomfunc} color="red"/>
              </Grid>
              <Grid item sx={{m:4}}>

              </Grid>
            </Grid>
            <Mafs>
              <Coordinates.Cartesian />
              <Plot.OfX y={(x) => eval(equation)} color={Theme.blue} />
            </Mafs>
          </Container>
        
      
      </div>
    );
  }
}

export default Graphical;