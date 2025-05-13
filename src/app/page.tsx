'use client';
import Header from "@/components/Header";
import Link from 'next/link';
import React from "react";
import { useState, useEffect } from "react";
import Mermaid from "@/components/Mermaid";
import { setLogLevel } from "mermaid/dist/logger.js";






export default function home(){

  const [bookNumber, setBookNumber] = useState(0);
  const [textResult, setTextResult] = useState(`Loading... please give us a minute while we do our magic!`);
  const [mermaidChart, setMermaidChart] = useState<string>("");
  const [showChart, setShowChart] = useState(false);
  const [isIdentified, setIsIdentified] = useState(false);
  const [formattedMainCharacters, setFormattedMainCharacters] = useState<string>("Looks like there are no main characters!");
  const [formattedSupportingCharacters, setFormattedSupportingCharacters] = useState<string>("Looks like there are no supporting characters!");
  const [formattedMinorCharacters, setFormattedMinorCharacters] = useState<string>("Looks like there are no minor characters!");
  const [loading, setLoading] = useState(false);


  const clear = ()=>{
    setIsIdentified(false);
    setShowChart(false);
    setMermaidChart("");
    setTextResult("");
    setBookNumber(0);
    setFormattedMainCharacters("Looks like there are no main characters!");
    setFormattedSupportingCharacters("Looks like there are no supporting characters!")
    setFormattedMinorCharacters("Looks like there are no minor characters!")
    setLoading(true);
  }
  const handleGutApi = (event: React.SyntheticEvent)=>{
    clear();
    event.preventDefault();
    let bookInput = document.getElementById("BookId") as HTMLInputElement | null ;
    let bookId: number | null = null;
    

    if(bookInput?.value){
      let parsed = parseInt(bookInput.value);
      if(parsed <= 0){
        alert("please enter a valid number that is not 0 and not negative!")
        setBookNumber(0);
        setLoading(false);
        setTextResult(`Sorry it looks like your book number ${bookNumber} has no identified characters since it is not a valid book number. Please try another book!`);
        setIsIdentified(false);
        return;
      }
      if(!isNaN(parsed)){
        bookId= parsed;
        setBookNumber(bookId);
        handleGutDownload(bookId);
        
      }
      else if(isNaN(parsed)){
        setBookNumber(0);
        setIsIdentified(false);
        setLoading(false);
        alert("Please make sure the book number is only integers");
        return;
      }
    }
    return;
  };


  const handleGutDownload =async (bookId:number) => {

    try{
      const data= await fetch(`/api/GutAPI?bookId=${bookId}`);
      if(data ===null){
        setTextResult(`Looks like we could not find book number ${bookId} in the library! Please give us a valid book number!`);
        setIsIdentified(false);
        setLoading(false);
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
          setTextResult(`Sorry it looks like your book number ${bookNumber} has no identified characters. Please try another book!`);
          setIsIdentified(false);
          setLoading(false);
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
          setFormattedMainCharacters(mainCharacters.length? mainCharacters.map((c: Character) => `.${c.name}: ${c.description}`).join("\n"): "Looks like there are no main characters!");
          console.log(formattedMainCharacters);
          
          // Parse all supporting chars:
          const supportingCharacters: Character[] = jsonIdentifiedChars?.supporting_characters || [];
          setFormattedSupportingCharacters(supportingCharacters.length? supportingCharacters.map((c: Character) => `.${c.name}: ${c.description}`).join("\n"): "Looks like there are no supportingcharacters!");

          // Parse all minor characters:
          const minorCharacters: Character[] = jsonIdentifiedChars?.minor_characters || [];
          setFormattedMinorCharacters(minorCharacters.length? minorCharacters.map((c: Character) => `.${c.name}: ${c.description}`).join("\n"): "Looks like there are no minor characters!");

          // Parse all interactions:
          type interactionsType ={
            source: string,
            target: string,
            type: string,
            count: number,
          }


          // Format interactions list nicely:
          const interactionsList: interactionsType[] = jsonIdentifiedChars?.interactions || [];
          const formattedInteractions = interactionsList.map((interact: interactionsType) =>
          `.Source: ${interact.source}\nTarget: ${interact.target}\nType: ${interact.type}\nCount: ${interact.count}`
          ).join("\n\n");



          //Set Text to be returned with formatted data:
          setTextResult(`Main Characters are:\n ${formattedMainCharacters || "None"}\nSupporting characters are:\n ${formattedSupportingCharacters || "None"}\n
            Minor Characters are:\n ${formattedMinorCharacters||"None"}\nTheir interactions are as follows:\n ${formattedInteractions||"None"}`
          );

          

          // Mermaid graph of interactions
          const interactionChart = `graph TD\n` + interactionsList.map(
            (interact) =>
              `  ${interact.source} -->|${interact.type}| ${interact.target}`
          ).join("\n");
          setMermaidChart(interactionChart);

          // Set isIdentified to true since we got a response back with the book's characters:
          setIsIdentified(true);
          setLoading(false);
          
          return;

        }catch(jsonError){
          console.error("Could not parse response as JSON:", jsonError);
        }
      
      
      }else{
        setIsIdentified(false);
        setLoading(false);
        setTextResult("Sorry looks like your book is out of our scope please try again later!");
        return console.log("status for fetching chars !=200");
      }
    
    }catch(error){
      console.log("The error is: "+error);
    }
  }

  const handleVisuals =()=> {
    setShowChart(true);
    
  }
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
        <div className="form-group">
          <label htmlFor="BookId" className="libLabel">What's your book number?</label>
          <input type="number" className="form-control libInput" id="BookId" placeholder="only integers numbers are allowed, ex:'1787'"  required/>
        </div>
        <button type="submit" className="btn btn-secondary btn-rounded idBtn">Submit</button>

      </form>

      {loading && (
      <div className="loading-msg">
        <p>Loading... please give us a minute while we do our magic!</p>
        </div>
      )}

      {!loading && !isIdentified && (
        <div className="notIdentified-msg">
          <p>{textResult}</p>
        </div>
      )}
      {bookNumber>=1 && isIdentified && (
        <div className="identifiedChars">
          <h3 className="CharsTitle"> The main characters are:</h3>
          <p className="chars">{formattedMainCharacters}</p>

          <h3 className="CharsTitle"> The Supporting characters are:</h3>
          <p className="chars">{formattedSupportingCharacters}</p>

          <h3 className="CharsTitle"> The minor characters are:</h3>
          <p className="chars">{formattedMinorCharacters}</p>
         

        </div>
      )}
    
      {mermaidChart!=="" && !showChart &&  (
        <>
        <p>Want to see the visualized interactions between your character?</p>
        <button type="button" onClick={handleVisuals} > YES! </button>
        </>
      )}
      {showChart && (
        <div className="chartTable">
          <Mermaid chart={mermaidChart} />
        </div>
      )}
      



    </div>
     
  </>
    

  );



}