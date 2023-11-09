import {NavLink} from 'react-router-dom';
import './AppHeader.css';

function AppHeader(){
    return (
        <header className='app-header'>
            <NavLink className="app-header-item" to="/Bisection" activeClassName="app-header-item-active">Bisection</NavLink>
        </header>
    )
}
export default AppHeader;