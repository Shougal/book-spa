'use client';

import Header from "@/components/Header";
import Link from 'next/link';
import React from "react";




export default function home(){

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
          console.log("Sorry it looks like your book has no identified characters. Please try another book!");
        }

        try{
          const jsonIdentifiedChars = JSON.parse(identifiedChars);
          console.log(jsonIdentifiedChars);
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