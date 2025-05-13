'use client';

import Header from "@/components/Header";
import Link from 'next/link';
import React from "react";
import { useState, useEffect } from "react";



export default function home(){

  const [bookNumber, setBookNumber] = useState(0);
  const [textResult, setTextResult] = useState(`Sorry it looks like your book number ${bookNumber} has no identified characters. Please try another book!`);


  const handleGutDownload =async (bookId:number) => {

    try{
      const data= await fetch(`/api/GutAPI?bookId=${bookId}`);
      if(data ===null){
        console.log("response was null");
        return;
      }
      const text = await data.text();
      handleProcessText(text);
      

    } catch(error){
      console.error("could not fetch data from GutAPI");
    }
    


  }
  const handleProcessText = async(text: string)=>{
    try{
      // post request headers
      const options = {
        method: 'POST',
        headers:{
          'Content-Type': "text/plain",
        },
        body: text,
      };
      
      // identify all characters by sending api request to ProcessMessage route
      const response = await fetch('/api/ProcessMessage', options);
      
      if(response.status===200){
        const identifiedChars = await response.text();
        
        
        if(identifiedChars === null){
          setTextResult(`Sorry it looks like your book number ${bookNumber} has no identified characters. Please try another book!`)
          console.log("Sorry it looks like your book has no identified characters. Please try another book!");
        }

        try{
          const jsonResult = JSON.parse(identifiedChars);
          

          // Double parsing the json since identifiedChars is a string that contains nested JSON
          const jsonIdentifiedChars = JSON.parse(jsonResult);
          

          // Parse all main characters:
          type Character ={
            name: string,
            description: string,
          }
          

          
          const mainCharacters: Character[] = jsonIdentifiedChars?.main_characters || [];
          
          const formattedMainCharacters = mainCharacters.map((c: Character) => `. ${c.name}: ${c.description}`).join("\n");
          
          // Parse all supporting chars:
          const supportingCharacters: Character[] = jsonIdentifiedChars?.supporting_characters || [];
          const formattedSupportingCharacters = supportingCharacters.map((c: Character) => `. ${c.name}: ${c.description}`).join("\n");

          // Parse all minor characters:
          const minorCharacters: Character[] = jsonIdentifiedChars?.minor_characters || [];

          const formattedMinorCharacters = minorCharacters.map((c: Character) => `. ${c.name}: ${c.description}`).join("\n");
         
          // Parse all interactions:
          type interactionsType ={
            source: string,
            target: string,
            type: string,
            count: number,
          }


          // Format interactions list nicely:
          const interactionsList: interactionsType[] = jsonIdentifiedChars?.interactions || [];
          const formattedInteractions = interactionsList.map((interact: interactionsType)=> `.Source: ${interact.source} "\n" .Target: ${interact.target}
          "\n" .Type: ${interact.type} "\n" .Count: ${interact.count}
          `). join("\n");


          //Set Text to be returned with formatted data:
          setTextResult(`Main Characters are:\n ${formattedMainCharacters || "None"}\nSupporting characters are:\n ${formattedSupportingCharacters || "None"}\n
            Minor Characters are:\n ${formattedMinorCharacters||"None"}\nTheir interactions are as follows:\n ${formattedInteractions||"None"}`
          );
          // console.log(jsonIdentifiedChars);
          return;

        }catch(jsonError){
          console.error("Could not parse response as JSON:", jsonError);
        }
      
      
      }else{
        return console.log("status for fetching chars !=200");
      }
    
    }catch(error){
      console.log("The error is: "+error);
    }
  }
  
  const handleGutApi = (event: React.SyntheticEvent)=>{
    event.preventDefault();
    let bookInput = document.getElementById("BookId") as HTMLInputElement | null ;
    let bookId: number | null = null;
    

    if(bookInput?.value){
      let parsed = parseInt(bookInput.value);
      if(parsed <= 0){
        alert("please enter a valid number that is not 0 and not negative!")
        setBookNumber(0);
        setTextResult(`Sorry it looks like your book number ${bookNumber} has no identified characters. Please try another book!`);
        return;
      }
      if(!isNaN(parsed)){
        bookId= parsed;
        setBookNumber(bookId);
        handleGutDownload(bookId);
        
      }
      else if(isNaN(parsed)){
        setBookNumber(0);
        alert("Please make sure the book number is only integers");
        return;
      }
    }

    


    return;
  };
  return (
    <>
    
    <div>
      <h1 className="text-wrap text-center " > Want to know and visualize which characters knows which in your book?</h1>
      <form className="gutLib" onSubmit={handleGutApi}>
        <div className="form-group">
          <label htmlFor="gutPage" className="libLabel">Click the link below to the library page, find your book's number and come back!</label>
          <a href="https://www.gutenberg.org/" target="_blank" rel="noopener noreferrer" className="libLink">
            <button type="button" className="btn btn-light btn-rounded libBtn "> link to library</button>
          </a>
          </div>
      {/* </form>
      <form> */}
        <div className="form-group">
          <label htmlFor="BookId" className="libLabel">What's your book number?</label>
          <input type="number" className="form-control libInput" id="BookId" placeholder="only integers numbers are allowed, ex:'1787'"  required/>
        </div>
        <button type="submit" className="btn btn-secondary btn-rounded idBtn">Submit</button>

      </form>
      
      {bookNumber>=1 && (
      <div className="card chars-div" >
        <img className="card-img-top chars-img" src=".../100px180/" alt="Card image cap"/>
        <div className="card-body chars-body">
          <h5 className="card-title chars-title"> The identified Characters for book number {bookNumber} is as follows: </h5>
          <div className="card-text chars-text"> {textResult.split("\n").map((line, index) => (
    <p key={index}>{line}</p>
  ))}</div>
          
          </div>
      </div>
      )}
    </div>
     
  </>
    

  );



}