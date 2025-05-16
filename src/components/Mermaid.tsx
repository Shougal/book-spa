'use client';

import React from 'react';
import mermaid from 'mermaid';
import { useRef, useEffect,useState } from 'react';


type MermaidProps ={
    chart: string,
}
export default function MermaidRender({chart} :MermaidProps){
    console.log("inside mermaid\n");
    console.log("chart in mermaid is: \n"+ chart);
    
    const mermaidRef = useRef<HTMLDivElement>(null);
    const [renderError, setRenderError] = useState(false);
   
    
    useEffect(()=>{
        setRenderError(false);
        
        if(!chart ){
            console.log("no chart");
            return;
        }

        try{
            mermaid.initialize({
                startOnLoad:false,
                securityLevel: 'loose',
            })
        }catch{}


        if(mermaidRef.current){
   
            const draw = async function(){

                try{
                    // call a render function with the graph definition as a string. 
                    console.log('Chart json stingify:', JSON.stringify(chart));

                    //Made sure to have a unique render id per call to solve issue of
                    //using the same ID multiple times in quick updates, which confused Mermaid’s rendering logic.
                    const {svg} = await mermaid.render(`graph-${Date.now()}`, chart);
                   
                    if(mermaidRef.current){ 
                        mermaidRef.current.innerHTML = svg;
                    }
                    
                }catch(e:any){
                    setRenderError(true);
                } 
            };

            draw();
            
        }
        

    },[chart]);

    return (
        <div ref={mermaidRef}>
          {!renderError && <p>Loading, please wait!</p>}
          {renderError && (
            <p className="text-danger">
              Oops! We couldn't render the interaction chart. Please try another book.
            </p>
          )}
        </div>
      );
    

}