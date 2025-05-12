import dotenv from "dotenv";
import Groq from "groq-sdk";
dotenv.config();

const processing = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request:Request) {
    try{
        const bodyText = await request.text();
        const shortText = bodyText.slice(0, 10000); // ~3000–4000 tokens approx

        const resultingMessage = await getGroqChatCompletion(shortText);
        const finalMessage =(resultingMessage.choices[0]?.message?.content || "");
        if (finalMessage ===""){
            return new Response(null);
        }
        return new Response(JSON.stringify(finalMessage),{
            status:200,
            headers:{
                "Content-Type": "application/json",
            
            }
        }
        )
    } catch(error){
        console.error("Error in ProcessMessage POST:", error);
        return new Response("Internal server error", {status:500});
    }   
}

export const getGroqChatCompletion = async (messageContent: string) => {
    const prompt = `
    I will provide you with the full text of a book. Your task is to analyze the text and identify all characters mentioned.
    Return the result as a JSON object with the following structure:
    {
    "main_characters": [
        { "name": "Name", "description": "Short summary of role or traits" }
    ],
    "supporting_characters": [
    { "name": "Name", "description": "Short summary of role or traits" }
    ],
    "minor_characters": [
    { "name": "Name", "description": "Optional short role" }
    ],
    "interactions": [
    { "source": "Character A", "target": "Character B", "type": "dialogue/conflict/friendship", "count": number }
    ]
    }

    Try to be concise in the descriptions. The "interactions" array should reflect how frequently or significantly characters interact with each other. If possible, infer the nature of their relationship (e.g., friends, enemies, relatives).

    Once I provide the book text, analyze it and return the final result in JSON format only. Do not include explanations.
    `;

    return processing.chat.completions.create({
      messages: [
        
        {
          role: "system",
          content: prompt,
        },
        // Set a user message for the assistant to respond to.
        {
          role: "user",
          content: messageContent,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      max_completion_tokens: 1000
    });
  };