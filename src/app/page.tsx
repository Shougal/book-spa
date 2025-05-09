'use client';

import Header from "@/components/Header";
import Link from 'next/link';
import React from "react";
import GutAPI from "@/components/GutAPI";



export default function home(){

  const handleGutDownload =async (bookId:number) => {
    try{
      let data = await GutAPI(bookId);
      let dataLines = (await data).split("\n")
      let dataLimit = 5;
      for(let i=0; i<=dataLimit-1 && i<dataLines.length; i++){
        console.log(dataLines[i] + "\n");
      }
      

    } catch(error){
      console.error("could not fetch data from GutAPI");
    }
    


  }
  
  const handleGutApi = (event: React.SyntheticEvent)=>{
    event.preventDefault();
    let bookInput = document.getElementById("BookId") as HTMLInputElement | null ;
    let bookId: number | null = null;
    

    if(bookInput?.value){
      let parsed = parseInt(bookInput.value);
      if(!isNaN(parsed)){
        bookId= parsed;
        handleGutDownload(bookId);
        
      }
      else if(isNaN(parsed)){
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
    </div>
    </>
    

  );



}