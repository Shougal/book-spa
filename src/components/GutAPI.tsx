export default async function GutAPI(bookId: number){

    const content_url = `https://www.gutenberg.org/files/${bookId}/${bookId}-0.txt`;

    // Get Book content data as text
    const response = await fetch(content_url);
    if(!response.ok){
        throw new Error(`HTTP Error: Status: ${response.status}`);
    }
    const data = response.text();
    return data;


}