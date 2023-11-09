import React, { Component } from 'react';
import { derivative, max ,pow,sqrt  } from 'mathjs'
import Show_graph from '../graph_show';
import { db } from'../config/firebase'
import {getDocs ,collection ,addDoc} from "firebase/firestore";
import getRandomNumber from './random_index';

class NewtonRaphson extends React.Component{
    constructor(){
        super();
        this.state = {
            max_iteration: 10000,
            initialGuess:0,
            ans:'',
            func:'',
            tolerance:0.0001,
            result:null,
            datafunction:[],
            guess:[],
            x:null,
            y:null,
            database_equation:collection(db,"newton_ralpson")
        };
        this.f = this.f.bind(this);
        this.fPrime = this.fPrime.bind(this);
        this.randomfunc = this.randomfunc.bind(this);
        this.submitdata = this.submitdata.bind(this);
        this.check_functionarray = this.check_functionarray.bind(this);
        this.calculateRoot = this.calculateRoot.bind(this); 
    };
    componentDidMount(){
        const fetchData = async () =>{
            try {
              const data = await getDocs(this.state.database_equation);
              const filteredData = data.docs.map((doc)=>({...doc.data(),id: doc.id,}));
              const a= filteredData.map((data)=>data.function);
              const b= filteredData.map((data)=>data.guess);
              this.setState({datafunction:a,guess:b,ans:a[0],func:a[0],initialGuess:b[0]});
            }
            catch(err){
              console.error(err);
            }  
        };fetchData();
    };
    f(x) {
        try {
            return eval(this.state.ans);
        } catch (error) {
            console.error("Error evaluating the function:", error);
            return null;
        }
    }

    fPrime(x) {
        try {
            const deriv = derivative(this.state.ans, 'x').toString();
            return eval(deriv.replace(/x/g, `(${x})`));  // Replace x with its value.
        } catch (error) {
            console.error("Error evaluating the derivative:", error);
            return null;
        }
    }
    randomfunc(){
        let indexs = getRandomNumber(this.state.datafunction.length);
        this.setState({func:this.state.datafunction[indexs],ans:this.state.datafunction[indexs],initialGuess:this.state.guess[indexs]});
        this.calculateRoot();
    };
    submitdata(){
        try{ addDoc(this.state.database_equation,{function:this.state.ans,guess:parseFloat(this.state.guess)});
      }catch(err){
        console.error(err)
      }
      console.log("submit complete");
    };
    check_functionarray(funct){
        let check = false;
        for(let i=0;i<this.state.datafunction.length;i++){
          if(funct == this.state.datafunction[i]){
            check = true;
            break;
          }
        }
        return check;
    };
    calculateRoot = () => {
        let x0 = this.state.initialGuess;
        let iteration = 0;
        while (Math.abs(this.f(x0)) >= this.state.tolerance && iteration < this.state.max_iteration) {
          x0 = x0 - this.f(x0) / this.fPrime(x0);
          iteration++;
        }
      
        this.setState({x:x0,y:this.f(x0),func:this.state.ans,result:`Root: ${x0} (found in ${iteration} iterations)`});
        if(iteration < this.state.max_iteration && (this.check_functionarray(this.state.ans) == false)){
          this.submitdata();
          this.setState(prevState => ({
            datafunction: [...prevState.datafunction, this.state.ans],
            guess: [...prevState.guess, this.state.initialGuess]
            }));
        }
    };
    render(){
        const {initialGuess,ans,tolerance,result} = this.state;
        return (
            <div>
              <div>
                <label htmlFor="initialGuess">Initial Guess:</label>
                <input
                  type="number"
                  id="initialGuess"
                  value={initialGuess}
                  onChange={(e) =>  {this.setState({initialGuess:(parseFloat(e.target.value))})}}
                />
              </div>
              <div>
                <label htmlFor="ans">Ans:</label>
                <input
                  type="text"
                  id="ans"
                  value={ans}
                  onChange={(e) => {this.setState({ans:e.target.value})}}
                />
              </div>
              <div>
                <label htmlFor="tolerance">Tolerance:</label>
                <input
                  type="number"
                  id="tolerance"
                  value={tolerance}
                  onChange={(e) => {this.setState({tolerance:parseFloat(e.target.value)})}}
                />
              </div>
              <button onClick={this.calculateRoot}>Calculate Root</button>
              <button onClick={this.randomfunc}>Random</button>
              <div>{result}</div>
             
            </div>
          );
    }
}