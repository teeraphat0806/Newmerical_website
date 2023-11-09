import React, { Component } from 'react';
import Select from 'react-select';

class Linearquadratic_point_ui  extends React.Component{
    
    render(){
        const { point, handleInputChanges_point, numberdata } = this.props;
        return (
            <div>
              {point.map((value, index) => (
                <TextFields 
                type="number" 
                placeholder={numberdata}
                value={value}
                onChange={(e) => handleInputChanges_point(e, index)} 
                min={numberdata}
                />
              ))}
              <button onClick={() => this.props.select()}>confirm</button>
            </div>      
        )
    }
}
class Polynomial_point_ui extends React.Component{
    render(){
        if(this.props.selectOption == "Polynomial Interpolation"){
        return (
            <div>
              <input
                  type="number"
                  id="numberpoint"
                  min="2"
                  max={this.props.numberdata}
                  value={this.props.numberpoint}
                  onChange={this.props.handleOptionChange_x}
              />
            </div>
        )}
        return null;
    }
}

export default class Newtondivide extends React.Component{
    constructor(){
        super();
        this.state = {
            numberdata: 2,
            numberpoint: 2,
            matrixX: [],
            matrixY: [],
            point: [0,0],
            answer: 0,
            selectOption: "Linear Interpolation"
        };
        this.handleDimensionChange_matrix = this.handleDimensionChange_matrix.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleOptionChange_x = this.handleOptionChange_x.bind(this);
        this.handleInputChanges_point = this.handleInputChanges_point.bind(this);
        this.handleInputChanges_matrix_x = this.handleInputChanges_matrix_x.bind(this);
        this.handleInputChanges_matrix_y = this.handleInputChanges_matrix_y.bind(this);
        this.setMatrixs = this.setMatrixs.bind(this);
        this.setpoint = this.setpoint.bind(this);
        this.select = this.select.bind(this);
        this.linear_interpolation = this.linear_interpolation.bind(this);
        this.quadratic_interpolation = this.quadratic_interpolation.bind(this);
        this.polynomial_interpolation = this.polynomial_interpolation.bind(this);
        this.interpolationed = this.interpolationed.bind(this);
    }
     handleDimensionChange_matrix(e){
        const newDimension = parseInt(e.target.value, 10);
        const newDimensions = parseInt(e.target.value, 10);

        this.setState({
            numberdata: newDimension,
            matrixX: Array.from({ length: newDimension }, () => Array(newDimension).fill(0)),
            matrixY: Array.from({ length: newDimensions }, () => Array(newDimensions).fill(0))
        });
      };
      handleOptionChange(e){
        let numberpoints = -1;
        if (e.target.value == "Linear Interpolation") {
          numberpoints = 2;
        } else if (e.target.value == "Quadratic Interpolation") {
          numberpoints = 3;
        } 
        this.setState({selectOption:e.target.value,numberpoint:numberpoints});
        this.setpoint();
      };
      handleOptionChange_x(e){
        const newDimension = parseInt(e.target.value, 10);
     
        this.setState({numberpoint:newDimension,point:Array.from({ length: newDimension }, () => Array(newDimension).fill(0))});
      };
      handleInputChanges_point(e, index){
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
          const newRow = this.state.point;
          newRow[index] = newValue;
          this.setState({point:newRow});
        }
      };
      handleInputChanges_matrix_x(e, index){
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
          const newRow = this.state.matrixX;
          newRow[index] = newValue;
          this.setState({matrixX:newRow});
        }
      };
      handleInputChanges_matrix_y(e, index){
        const newValue = parseFloat(e.target.value);
        if (!isNaN(newValue)) {
          const newRow = this.state.matrixY;
          newRow[index] = newValue;
          this.setState({matrixY:newRow});
        }
      };
      setMatrixs() {
        const arr = Array();
        const ar2 = Array();
        for (let i = 0; i < this.state.numberdata; i++) {
          arr.push(0);
          ar2.push(0);
        }
        this.setState({matrix:arr,matrixY:ar2});
      };
      setpoint() {
        const arr = Array();
        for (let i = 0; i <this.state.numberdata; i++) {
          arr.push(0);
        }
        this.setState({point:arr});
      };
      select() {
        if (this.state.selectOption == "Linear Interpolation") {
            this.linear_interpolation();
        } else if (this.state.selectOption == "Quadratic Interpolation") {
            this.quadratic_interpolation();
        } else if (this.state.selectOption == "Polynomial Interpolation") {
            this.polynomial_interpolation();
        }
      }
      linear_interpolation(){
        this.setState({answer: (this.state.matrixY[this.state.point[1]-1]-this.state.matrixY[this.state.point[0]-1])/(this.state.matrixX[this.state.point[1]-1]-this.state.matrixX[this.state.point[0]-1])});
      }
      quadratic_interpolation(){
        let matrixy2 = [this.state.matrixY[this.state.point[0]-1],this.state.matrixY[this.state.point[1]-1],this.state.matrixY[this.state.point[2]-1]];
        let matrixx2 = [this.state.matrixX[this.state.point[0]-1],this.state.matrixX[this.state.point[1]-1],this.state.matrixX[this.state.point[2]-1]];
        for(let i=0;i<matrixy2.length-1;i++){
          matrixy2[i] = this.interpolationed(matrixx2[i],matrixx2[i+1],matrixy2[i],matrixy2[i+1]);
        };
        this.setState({answer:this.interpolationed(matrixx2[0],matrixx2[matrixx2.length-1],matrixy2[0],matrixy2[1])});
      }
      polynomial_interpolation(){
        let lens = this.state.matrixX.length-1;
        let matrixy2 = this.state.matrixY;
        let round = 0;
        while(true){
          for(let i=0;i<lens;i++){
            matrixy2[i] = this.interpolationed(this.state.matrixX[i],this.state.matrixX[i+1+round],matrixy2[i],matrixy2[i+1]);
            
          }lens-=1;
          round+=1;
          if(lens==0){
            break;
          }if(round==this.state.numberpoint-1){
            break;
          }
        };
        this.setState({answer:matrixy2[0]});
      }
      interpolationed(x1,x2,y1,y2){
        return (y2-y1)/(x2-x1);
      }
    render(){
        const { numberdata, matrixX, matrixY, selectOption } = this.state;
        return(
            <div>
            <div>
              <div>
                <label htmlFor="a">Number of data:</label>
                <input type="number" id="numberdata" value={numberdata} min="1" onChange={this.handleDimensionChange_matrix}/>
                <div>
                  {matrixX.map((value, indexed) => (
                    <input
                      type="number"
                      step="0.01"
                      value={value}
                      onChange={(e) => this.handleInputChanges_matrix_x(e, indexed)}
                    />
                  ))}
                </div>
                <div>
                  {matrixY.map((value, index) => (
                    <input
                      type="number"
                      step="0.01"          
                      value={value}
                      onChange={(e) => this.handleInputChanges_matrix_y(e, index)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <select id="optionSelect" value={selectOption} onChange={this.handleOptionChange}>
                  <option value="Linear Interpolation">Linear Interpolation</option>
                  <option value="Quadratic Interpolation">Quadratic Interpolation</option>
                  <option value="Polynomial Interpolation">Polynomial Interpolation</option>
                </select>
              </div>
              <Polynomial_point_ui 
               selectOption={selectOption}
               numberdata={numberdata}
               handleOptionChange_x={this.handleOptionChange_x}
              />
              <Linearquadratic_point_ui
               point={this.state.point}
               numberdata={numberdata}
               handleInputChanges_point={this.handleInputChanges_point}
               select={this.select}
              />
              
          </div>
            <div>
              <p>{this.state.answer}</p>
            </div>
        </div>
        )
    }
}