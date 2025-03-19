
import './App.css';
import axios from "axios";
import { useEffect, useState } from 'react';

//const serverUrl = "http://localhost:3001";


function App() {

  const [listOfCocktails, setListOFCocktails] = useState([]);



  useEffect(()=>{
    axios.get("http://localhost:3001/Cocktails").then((response)=>{
      setListOFCocktails(response.data);
    });
  }, [])
  
  

  return (<div className="App"> { listOfCocktails.map((value, key)=> {
    return <div> {value.name}</div>
  } ) } </div>);
}

export default App;
