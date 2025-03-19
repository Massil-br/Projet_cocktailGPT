import React from 'react'
import axios from "axios";
import { useEffect, useState } from 'react';

function Home() {
    const [listOfCocktails, setListOFCocktails] = useState([]);



    useEffect(()=>{
        axios.get("http://localhost:3001/Cocktails").then((response)=>{
        setListOFCocktails(response.data);
        });
    }, [])



  return (
    <div>
        { listOfCocktails.map((value, key)=> {
    return <div className="Cocktail" key={key}> 
      <div className="CocktailName">{value.name}</div>
      <div className="CocktailDesctiption">{value.description}</div>
      </div>
  } ) } 
    </div>
  )
}

export default Home