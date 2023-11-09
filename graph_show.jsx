import React, { useEffect, useState } from 'react';
import "mafs/core.css";
import "mafs/font.css";
import { Mafs, Coordinates, Plot, Theme ,Point} from "mafs";
import { pow,sqrt } from 'mathjs';

const Show_graph = ({func,x,y}) => {

    console.log(func);
    return (
      <div>
        <Mafs  zoom={{ min: 0.1, max: 2 }} viewBox={{x:[x-2,x+2],y:[y-2,y+2]}}>
          <Coordinates.Cartesian />
          <Plot.OfX y={(x) => eval(func)} color={Theme.blue} />
          <Point x={x} y={y} color={Theme.red}/>
        </Mafs>
     
      </div>
    );
  }
  export default Show_graph;