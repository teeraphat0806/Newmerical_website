import React, { Component, useState } from 'react';
import Select from 'react-select';
import { pow, sqrt } from 'mathjs';
class Inputconfirm extends React.Component{
    render(){
      const {select,m,x,selectOption,setx,setm,matrix_x,matrix_y,matrix,handleInputChanges_matrix,handleInputChanges_matrix_x,handleInputChanges_matrix_y} = this.props;
        if(selectOption == "Multi Linear regression"){
            return (
            <div>
                m:
                <input type="number" id="m" value={m} onChange={(e) => setm(parseFloat(e.target.value))} />
                number of x:
                <input type="number" id="x" value={x} onChange={(e) => setx(parseFloat(e.target.value))} />
                {matrix_x.map((row, rowIndex) => (
                    <div key={rowIndex}>
                    {row.map((value, colIndex) => (
                        <input
                        key={colIndex}
                        type="number"
                        value={value}
                        step="0.01"
                        onChange={(e) => handleInputChanges_matrix_x(e, rowIndex, colIndex)}
                        />

                    ))}

                    </div>
                ))}
                {matrix_y.map((rows, rowsIndex) => (
                    <input
                    type="number"
                    step="0.01"
                    value={matrix_y[rowsIndex]}
                    onChange={(e) => handleInputChanges_matrix_y(e, rowsIndex)}
                    />

                ))}
                <table>
                    <tbody>
                    <tr>
                        {matrix.map((column, colIndex) => (
                        <td key={colIndex}>
                            <input
                            type="number"
                            step="0.01"
                            value={column}
                            onChange={(e) => handleInputChanges_matrix(e, colIndex)}
                            />
                        </td>
                        ))}
                    </tr>
                    </tbody>
                </table>

                <table>
                    <tbody>
                    <tr>
                        {matrix_y.map((column, colIndex) => (
                        <td key={colIndex}>
                            <input
                            type="number"
                            step="0.01"
                            value={column}
                            onChange={(e) => handleInputChanges_matrix_y(e, colIndex)}
                            />
                        </td>
                        ))}
                    </tr>
                    </tbody>
             </table>
             <button onClick={select}>confirm</button>
            </div>
            
            )
        }else{
          
            return(
                <div>
                    <table>
                        <tbody>
                        <tr>
                            {matrix.map((column, colIndex) => (
                            <td key={colIndex}>
                                <input
                                type="number"
                                step="0.01"
                                value={column}
                                onChange={(e) => handleInputChanges_matrix(e, colIndex)}
                                />
                            </td>
                            ))}
                        </tr>
                        </tbody>
                    </table>

                    <table>
                        <tbody>
                        <tr>
                            {matrix_y.map((column, colIndex) => (
                            <td key={colIndex}>
                                <input
                                type="number"
                                step="0.01"
                                value={column}
                                onChange={(e) => handleInputChanges_matrix_y(e, colIndex)}
                                />
                            </td>
                            ))}
                        </tr>
                        </tbody>
                    </table>
                    <button onClick={select}>confirm</button>
                </div>
            )
        }
    }
}
export default class Regression extends React.Component{
    constructor(){
      super();
        this.state={
            numberdata:1,
            matrix:[],
            matrix_y:[],
            selectedOption:" ",
            answer:[],
            findx:0,
            m:0,
            x:0,
            matrix_x:Array.from({ length: 0 }, () => Array(numberdata).fill(0))
        }
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleInputChanges_matrix = this.handleInputChanges_matrix.bind(this);
        this.handleInputChanges_matrix_x = this.handleInputChanges_matrix_x.bind(this);
        this.handleInputChanges_matrix_y = this.handleInputChanges_matrix_y.bind(this);
        this.setMatrixs = this.setMatrixs.bind(this);
        this.select = this.select.bind(this);
        this.linear_regression = this.linear_regression.bind(this);
        this.polynomial_regression = this.polynomial_regression.bind(this);
        this.multi_linear_regression = this.multi_linear_regression.bind(this);
        this.setmatrix = this.setmatrix;
        this.addx = this.addx.bind(this);
        this.addxy = this.addxy.bind(this);
        this.determinant = this.determinant.bind(this);
        this.setx = this.setx.bind(this);
        this.setm = this.setm.bind(this);
    };
    setx(xs){
      this.setState({x:xs});
    };
    setm(ms){
      this.setState({m:ms});
    };
    handleOptionChange(e){
      this.setState({selectedOption:e.target.value});
    };
    handleInputChanges_matrix(e, rowIndex){
        const newValue = parseFloat(e.target.value);
        const newMatrix = [...this.state.matrix];
        newMatrix[rowIndex] = newValue;
        this.setState({matrix:newMatrix});
    };
    handleInputChanges_matrix_x(e, rowIndex, colIndex){
        const newValue = parseFloat(e.target.value);
        const newMatrix = [...this.state.matrix_x];
        newMatrix[rowIndex][colIndex] = newValue;
        this.setState({matrix:newMatrix});
    };
    handleInputChanges_matrix_y(e, index){
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
        const newRow = [...this.state.matrix_y];
        newRow[index] = newValue;
        this.setState({matrix_y:newRow});
        }
    };
    setMatrixs() {
        const arr = Array();
        const ar2 = Array();
        for (let i = 0; i < this.state.numberdata; i++) {
          arr.push(0);
        }
        for (let i = 0; i < this.state.x; i++) {
          let array = []
          for (let k = 0; k < this.state.numberdata; k++) {
            array.push(0);
          }
          ar2.push(array);
        }
        this.setState({matrix_x:ar2,matrix:arr,matrix_y:arr});
    };
    select(){
        if (this.state.selectedOption == "Linear regression") {
            this.linear_regression();
        } else if (this.state.selectedOption == "Polynomial regression") {
            this.polynomial_regression();
        } else if (this.state.selectedOption == "Multi Linear regression") {
            this.multi_linear_regression();
        }
    };
    linear_regression() {
        let ans = [];
        let x = [];
        let y = [];
        let det;
        for (let i = 0; i < 2; i++) {
          let array = [];
          for (let k = 0; k < 2; k++) {
    
            if (i == 0 && k == 0) {
              array.push(this.state.numberdata);
            } else {
              array.push(this.addx(this.state.matrix, i + k));
            }
          } x.push(array);
        }
        y.push(this.addx(this.state.matrix_y, 1));
        y.push(this.addxy(this.state.matrix, this.state.matrix_y, 1));
        det = this.determinant(x);
        ans.push(((y[0] * x[1][1]) - (y[1] * x[0][1])) / det);
        ans.push(((y[1] * x[0][0]) - (y[0] * x[1][0])) / det);
        this.setState({answer:ans[0] + (ans[1] * findx)});
        console.log(ans[0] + (ans[1] * findx));
    };
    polynomial_regression() {
        let x = Array();
        let y = Array();
        let answer_y = 0;
        let M = this.state.m + 1;
        let det = 0;
    
        for (let i = 0; i < M; i++) {
          let array = [];
          for (let k = i; k < M + i; k++) {
            if (i == 0 && k == 0) {
              array.push(this.state.numberdata);
            } else {
              array.push(addx(this.state.matrix, k));
            }
          } x.push(array);
        }
    
        for (let i = 0; i < M; i++) {
          if (i == 0) {
            y.push(this.addx(this.state.matrix_y, 1));
          } else {
            y.push(this.addxy(this.state.matrix, this.state.matrix_y, i));
          }
        }
    
        det = this.determinant(x);
        for (let i = 0; i < M; i++) {
          if (i == 0) {
            answer_y += (this.determinant(this.setmatrix(x, y, i)) / det);
          } else {
            answer_y += (this.determinant(this.setmatrix(x, y, i)) / det) * (findx ** i);
          }
        }
        this.setState({answer:answer_y});
      };
    multi_linear_regression() {
        let xs = Array();
        let y = Array();
        let det = 0;
        let answer_y = 0;
        y.push(this.addx(this.state.matrix_y, 1));
        for (let i = 0; i < this.state.x; i++) {
          y.push(this.addxy(matrix_x[i], matrix_y, 1));
        }
        for (let i = 0; i < this.state.x + 1; i++) {
          let array = [];
          for (let k = 0; k < this.state.x + 1; k++) {
            if (i == 0 && k == 0) {
              array.push(this.state.numberdata);
            } else if (i == 0 && k != 0) {
              array.push(this.addx(this.state.matrix_x[k - 1], 1));
            } else if (k == 0 && i != 0) {
              array.push(this.addx(this.state.matrix_x[i - 1], 1))
            } else if (k != 0 && i != 0) {
              array.push(this.addxy(this.state.matrix_x[i - 1], this.state.matrix_x[k - 1], 1));
            }
          } xs.push(array);
        }
        det = this.determinant(xs);
        for (let i = 0; i < xs.length; i++) {
          if (i == 0) {
            answer_y += (this.determinant(this.setmatrix(xs, y, i)) / det);
          } else {
            answer_y += (this.determinant(this.setmatrix(xs, y, i)) / det) * (findx);
          }
        }
        this.setState({answer:answer_y});
    };
    setmatrix(x, y, index) {
        let ans = Array();
        for (let i = 0; i < x.length; i++) {
          let array = [];
          for (let k = 0; k < x.length; k++) {
            if (k == index) {
              array.push(y[i]);
            } else {
              array.push(x[i][k]);
            }
          } ans.push(array);
        }
        return ans;
    };
    addx(x, power) {
        let ans = 0
        for (let i = 0; i < x.length; i++) {
          ans += x[i] ** power;
        }
        return ans;
    };
    addxy(x, y, power) {
        let ans = 0;
        for (let i = 0; i < x.length; i++) {
          ans += ((x[i] ** power) * y[i]);
        }
        return ans;
    };
    determinant(matrix_ans) {
        let final_ans = 0;
        let ansed = 1;
        let size = matrix_ans.length;
        if (size == 2) {
          final_ans += ((matrix_ans[0][0] * matrix_ans[1][1]) - (matrix_ans[1][0] * matrix_ans[0][1]));
        } else {
          for (let i = 0; i < size; i++) {
            for (let k = i; k < size + i; k++) {
              ansed *= matrix_ans[k - i][k % size];
            }
            final_ans += ansed;
            ansed = 1;
          }
          for (let i = 0; i < size; i++) {
            for (let k = i; k < size + i; k++) {
              ansed *= matrix_ans[((size - 1) - (k - i)) % size][k % size];
            }
            final_ans -= ansed;
            ansed = 1;
          }
        }
        return final_ans;
    };
    render(){
        return(
            <>
                <div>
                    <label htmlFor="a">number of data:</label>
                    <input type="number" id="numberdata" value={this.state.numberdata} onChange={(e) => this.setState({numberdata:parseFloat(e.target.value)})} />
                    <button onClick={this.setMatrixs}>ok</button>
                </div>
                <label htmlFor="a">find x:</label>
                <input type="number" id="findx" value={this.state.findx} onChange={(e) => this.setfindx(parseFloat(e.target.value))} />
                <div>
                </div>
                <div>
                    <select id="optionSelect" value={this.state.selectedOption} onChange={this.handleOptionChange}>
                    <option value="Linear regression">Linear regression</option>
                    <option value="Polynomial regression">Polynomial regression</option>
                    <option value="Multi Linear regression">Multi Linear regression</option>
                    </select>
                </div>
                <div>
                    <Inputconfirm 
                    m ={this.state.m}
                    x={this.state.x}
                    setx={this.setx}
                    setm={this.setm}
                    selectOption={this.state.selectedOption} 
                    matrix_x={this.state.matrix_x}
                    matrix_y={this.state.matrix_y} 
                    matrix={this.state.matrix} 
                    select={this.select}
                    handleInputChanges_matrix={this.handleInputChanges_matrix} 
                    handleInputChanges_matrix_x={this.handleInputChanges_matrix_x} 
                    handleInputChanges_matrix_y={this.handleInputChanges_matrix_y}/>
                </div>
                <div>
                    <p>{this.state.answer}</p>
                </div>
            </>
        )
    }
}