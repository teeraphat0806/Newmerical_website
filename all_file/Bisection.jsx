import React from 'react';
import Show_graph from '../graph_show';
import { pow, sqrt } from 'mathjs';
import { db } from '../config/firebase';
import { getDocs, collection, addDoc } from "firebase/firestore";
import getRandomNumber from './random_index';
import ButtonUsage from '../button';
import { Box, Container } from '@mui/system';
import Grid from '@mui/material/Grid';
import TextFields from '../textfield';
import Cards from '../cards';
import {yellow}  from '@mui/material/colors';
class Bisection extends React.Component {
    maxiteration = 1000000;
    database_equation = collection(db, "find_rootequation");

    constructor(props) {
        super(props);

        this.state = {
            datafunction: [],
            datamin: [],
            datamax: [],
            a: 0,
            b: 0,
            ans: 'pow(7,4)-x',
            tolerance: 0.0001,
            result: null,
            val: 'pow(7,4)-x',
            x: 0,
            y: 0
        };
    }

    f = (x) => eval(this.state.ans);
    handleChange_a = (event) => {
        // Use parseInt or parseFloat depending on your needs
        this.setState({ a: parseFloat(event.target.value) });
    }
    handleChange_b = (event) => {
        // Use parseInt or parseFloat depending on your needs
        this.setState({ b: parseFloat(event.target.value) });
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
        this.getDataList();
    }

    async getDataList() {
        try {
            const data = await getDocs(this.database_equation);
            const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            
            this.setState({
                datafunction: filteredData.map(data => data.function),
                datamin: filteredData.map(data => data.min),
                datamax: filteredData.map(data => data.max),
                val: filteredData[0].function,
                a: filteredData[0].min,
                b: filteredData[0].max
            });
        } catch (err) {
            console.error(err);
        }
    }

    randomfunc = () => {
        let indexs = getRandomNumber(this.state.datafunction.length);
        this.setState({
            val: this.state.datafunction[indexs],
            ans: this.state.datafunction[indexs],
            a: this.state.datamin[indexs],
            b: this.state.datamax[indexs]
        }, this.calculateRoot);
    }

    submitdata = () => {
        try {
            addDoc(this.database_equation, {
                function: this.state.ans,
                min: this.state.a,
                max: this.state.b
            });
            console.log("submit complete");
        } catch (err) {
            console.error(err);
        }
    }

    check_functionarray = (funct) => {
        for (let i = 0; i < this.state.datafunction.length; i++) {
            if (funct === this.state.datafunction[i]) {
                return true;
            }
        }
        return false;
    }

    calculateRoot = () => {
        let { a, b, ans, tolerance } = this.state;

        let fa = this.f(a);
        let fb = this.f(b);

        let c;
        let fc;
        let iteration = 0;

        while ((b - a) >= tolerance) {
            c = (a + b) / 2;
            fc = this.f(c);

            if (fc === 0.0) {
                break;
            } else if (fa * fc < 0) {
                b = c;
                fb = fc;
            } else {
                a = c;
                fa = fc;
            }

            iteration++;
        }

        this.setState({
            y: this.f(c),
            x: c,
            result: `Root: ${c} (found in ${iteration} iterations)`
        });

        if (iteration < this.maxiteration && !this.check_functionarray(ans)) {
            this.submitdata();
            this.setState(prevState => ({
                datafunction: [...prevState.datafunction, prevState.val],
                datamin: [...prevState.datamin, a],
                datamax: [...prevState.datamax, b]
            }));
        }
    }

    render() {
        const { a, b, ans, tolerance, result, val, x, y } = this.state;

        return (
            <div style={{ textAlign: 'center',fontSize: 20}}>
                <h1 style={{fontSize:50,color:"black"}}>Bisection</h1>
                    <Container maxWidth="sm" style={{ textAlign: 'center'}} sx={{borderRadius: '8px', // Adjusted border radius// Softer shade of grey
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'}}>
                        <Grid container rowSpacing={4} columnSpacing={{ xs: 2, sm: 2, md: 3 }} >
                            <Grid item xs= {6}>
                                <label htmlFor="a">A</label>
                                <p></p>
                                <TextFields 
                                type="number" 
                                placeholder="1" 
                                value={a} 
                                onChange={this.handleChange_a} 
                                />
                            </Grid>
                            <Grid item xs= {6}>
                                <label htmlFor="b">B </label>
                                <p></p>
                                <TextFields 
                                type="number" 
                                placeholder="1" 
                                value={b} 
                                onChange={this.handleChange_b} 
                                />
                
                            </Grid>
                            <Grid item xs= {6}>
                                <label htmlFor="ans">Function</label>
                                <TextFields 
                                type="text" 
                                placeholder={ans} 
                                value={ans} 
                                onChange={this.handleChange_ans} 
                                />
                    
                            </Grid>
                            <Grid item xs= {6}>
                                <label htmlFor="tolerance">Tolerance</label>
                                <TextFields 
                                type="number" 
                                placeholder="1" 
                                value={tolerance} 
                                onChange={this.handleChange_tolerance}
                                step="0.001" 
                                />
                            </Grid>
                        </Grid>
                           <Container sx={{marginTop:5}}>
                            <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }} >
                                <Grid item xs={6}>
                                    <ButtonUsage word={"Calculate Root"} functionName={this.calculateRoot}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <ButtonUsage word={"Random"} color={"red"}functionName={this.randomfunc}/>
                                </Grid>
                                    <Grid item xs={6} >
                                </Grid>
                            </Grid> 
                           
                        </Container>
                        <p></p> 
                        {result !== null &&    <Cards word="Result"  hoverWord={result} fontsize={20} color={yellow["700"]} fontcolor="white"  hoverBackgroundColor="black" hoverFontColor={yellow["700"]}  borderRadius={11}/>}
                        <p></p> 
                        <Show_graph func={val} x={x} y={y} />

                    </Container>
                 
               
            </div>
        );
    }
}

export default Bisection;
