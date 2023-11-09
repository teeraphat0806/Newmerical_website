
import ButtonAppBar from "./navbar";
import TemporaryDrawer from "./sidebar";
import Bisection from "./all_file/Bisection";
import Cramerrule from "./all_file/Cramerrule";
import Conjugate_gradient from "./all_file/Conjugategradient";
import FalsePositionMethod from "./all_file/Falsepositionmethod";
import Graphical from "./all_file/Graphicalmethod";
import GaussianJordan from "./all_file/Guaessjordan";
import Guaesseidal from "./all_file/Guaessseidel";
import { BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Lagrange from "./all_file/Lagrange";
import LU from "./all_file/Ludecomposite";
import MatrixInverter from "./all_file/Matrixinversion";
import NewtonRaphson from "./all_file/Newtonralpson";
import OnePointIteration from "./all_file/Onepointiteration";
import SecantMethod from "./all_file/Secantmethod";
import SimpsonsRule from "./all_file/Simpsonsrule";
import TrapezoidalRule from "./all_file/trapzoidal";
import Regression from "./all_file/Regression";
import GaussianElimination from "./all_file/Guaesselimination";
import Newtondivide from "./all_file/Newtondivide";
import "./App.css";
function App(){
  return(
    <div className="csd">
      <ButtonAppBar></ButtonAppBar> 
      <Router>
      <div className="App">
        
        <Routes>
          <Route path='/bisection' element={<Bisection/>}></Route>
          <Route path='/false position method' element={<FalsePositionMethod/>}></Route>
          <Route path='/cramer rule' element={<Cramerrule/>}></Route>
          <Route path='/conjugate gradient' element={<Conjugate_gradient/>}></Route>
          <Route path='/graphical method' element={<Graphical/>}></Route>
          <Route path='/guaess jordan' element={<GaussianJordan/>}></Route>
          <Route path='/guaess seidel' element={<Guaesseidal/>}></Route>
          <Route path='/guaess elimination' element={<GaussianElimination/>}></Route>
          <Route path='/lu decomposite' element={<LU/>}></Route>
          <Route path='/Lagrange' element={<Lagrange/>}></Route>
          <Route path='/matrix inversion' element={<MatrixInverter/>}></Route>
          <Route path='/newton ralpson' element={<NewtonRaphson/>}></Route>
          <Route path='/newton divide' element={<Newtondivide/>}></Route>
          <Route path='/one point iteration' element={<OnePointIteration/>}></Route>
          <Route path='/secant method' element={<SecantMethod/>}></Route>
          <Route path='/simpsonsrule' element={<SimpsonsRule/>}></Route>
          <Route path='/regression' element={<Regression/>}></Route>
          <Route path='/trapzoidal' element={<TrapezoidalRule/>}></Route>
        </Routes>
      </div>
      </Router>
    </div>
    
    
  );
}
export default App;