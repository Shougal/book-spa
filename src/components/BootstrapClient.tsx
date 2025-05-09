'use client'
import {useEffect} from 'react'

export default function BootstrapClient(){
    // on Mount, require bootsrap js and also this is only in client hence the 'use client'
    //import to not require it on server
    useEffect(()=>{
        
        require('bootstrap/dist/js/bootstrap.bundle.min.js');
        console.log("required bootstrap");
    },[]);
    return null;
}