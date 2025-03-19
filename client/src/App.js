
import './App.css';
import{BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from "./pages/Home";
import CreateCocktail from './pages/CreateCocktail';

//const serverUrl = "http://localhost:3001";


function App() {

  


  return (
  
	<Router>
		<div className="Link-container">
		<Link to="/" className='Linkcomponent'><div className="Link">Home</div></Link>
		<Link to="/createCocktail" className='Linkcomponent'><div className="Link">Create a Cocktail</div></Link>
		</div>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/createCocktail" element={<CreateCocktail />} />	
		</Routes>
	</Router>
  );
}

export default App;
