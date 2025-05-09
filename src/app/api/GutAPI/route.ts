export async function GET(request: Request){

    const url = new URL(request.url);
    const bookId = url.searchParams.get('bookId');
    const content_url = [`https://www.gutenberg.org/files/${bookId}/${bookId}-0.txt`,
                         `https://www.gutenberg.org/files/${bookId}/${bookId}.txt`
    ];
    
    for(let i=0; i<content_url.length; i++){
        const response = await fetch(content_url[i]);
        if(response.ok && response.status!== 404){
            console.log(`got conetnt for:  ${content_url}`);
            const data = await response.text();
            return new Response(data,{
                status: 200,
                headers:{
                    "Content-Type": "text/plain",
                },
            });
            // return data;
        }
    }
    console.log("did not return");

    return new Response(null, {status: 404});
}
    
