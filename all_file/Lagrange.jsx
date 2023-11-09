import React, { Component } from 'react';
import { pow, sqrt } from 'mathjs';
class Lagrange extends Component {
    constructor(props) {
        super(props);

        this.state = {
            matrixSize: 2,
            matrixData: Array(2).fill(Array(2).fill('')),
            outputData: [],
            pointsize: 1,
            pointdata: [],
            Fx: 0,
            Y: undefined
        };
    }

    handleMatrixChange = (row, col, value) => {
        const newMatrixData = this.state.matrixData.map((rowArray, rowIndex) =>
            rowIndex === row
                ? rowArray.map((cell, colIndex) =>
                    colIndex === col ? value : cell
                )
                : rowArray
        );
        this.setState({ matrixData: newMatrixData });
    };

    renderMatrixInputs = () => {
        const inputs = [];
        for (let i = 0; i < this.state.matrixSize; i++) {
            const rowInputs = [];
            for (let j = 0; j < 2; j++) {
                rowInputs.push(
                    <input
                        key={`${i}-${j}`}
                        type="number"
                        value={this.state.matrixData[i][j]}
                        onChange={(e) => this.handleMatrixChange(i, j, e.target.value)}
                    />
                );
            }
            inputs.push(<div key={i}>{rowInputs}</div>);
        }
        return inputs;
    };

    renderMatrixInputspoint = () => {
        const inputs = [];
        for (let i = 0; i < this.state.pointsize; i++) {
            inputs.push(
                <div key={i}>
                    <input
                        required
                        type="number"
                        value={this.state.pointdata[i] || ''}
                        onChange={(e) => {
                            const newPointData = [...this.state.pointdata];
                            newPointData[i] = e.target.value;
                            this.setState({ pointdata: newPointData });
                        }}
                    />
                </div>
            );
        }
        return inputs;
    };

    handleSaveData = () => {
        this.setState({ outputData: this.state.matrixData });
        this.calLagrange();
    };

    calLagrange = () => {
        let arrA = [...this.state.matrixData], arrnew = Array(this.state.pointsize).fill([0, 0]), arrL = Array(this.state.pointsize).fill(0);
        let x = parseFloat(this.state.Fx), y = 0;
        let i = 0, j, multiply, divide;

        for (i = 0; i < this.state.pointsize; i++) {
            let pointIndex = this.state.pointdata[i] - 1;
            arrnew[i] = [...arrA[pointIndex]];
        }

        for (i = 0; i < this.state.pointsize; i++) {
            multiply = 1;
            divide = 1;
            for (j = 0; j < this.state.pointsize; j++) {
                if (i !== j) {
                    multiply *= (x - arrnew[j][0]);
                    divide *= (arrnew[i][0] - arrnew[j][0]);
                }
            }
            arrL[i] = multiply / divide;
        }

        for (i = 0; i < this.state.pointsize; i++) {
            y += arrL[i] * arrnew[i][1];
        }
        console.log(y);
        this.setState({ Y: y });
    }

    render() {
        return (
            <div>
                <h1>Lagrange</h1>
                <div>
                    <label>
                        F(x) :
                        <input
                            type="number"
                            value={this.state.Fx}
                            onChange={(e) => {
                                this.setState({ Fx: e.target.value })
                            }}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Total X :
                        <input
                            type="number"
                            min="1"
                            value={this.state.matrixSize}
                            onChange={(e) => {
                                const newSize = parseInt(e.target.value);
                                this.setState({
                                    matrixSize: newSize,
                                    matrixData: Array(newSize).fill(Array(2).fill('')),
                                    outputData: []
                                });
                            }}
                        />
                    </label>
                </div>
                <div style={{ marginTop: '20px' }}>
                    {this.renderMatrixInputs()}
                </div>

                <div>
                    <label>
                        Total Point :
                        <input
                            type="number"
                            min="1"
                            value={this.state.pointsize}
                            onChange={(e) => {
                                const newSize = parseInt(e.target.value);
                                this.setState({
                                    pointsize: newSize,
                                    pointdata: Array(newSize).fill(Array(2).fill(''))
                                });
                            }}
                        />
                        <button onClick={this.handleSaveData}>Calculate</button>
                    </label>
                </div>
                <div style={{ marginTop: '20px' }}>
                    {this.renderMatrixInputspoint()}
                </div>
                <h1>คำตอบคือออออ</h1>
                <h3>{this.state.Y}</h3>
            </div>
        );
    }
}

export default Lagrange;