import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { careerField, location = "India" } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    console.log('Analyzing career field:', careerField, 'in location:', location);
    
    const prompt = `Analyze the current job market for ${careerField} in ${location}. 
      
      Provide comprehensive, real-time insights including:
      1. Growth outlook (trend as "Growing", "Stable", or "Declining" and detailed description)
      2. Salary ranges in INR (minimum, average, maximum for professionals with 2-5 years experience)
      3. Top 5 common job roles with approximate number of current openings
      4. Top 8 technical skills required (with importance level: High/Medium/Low)
      5. Top 5 soft skills required (with importance level: High/Medium/Low)
      6. Top 3 hiring locations in ${location}
      7. Market demand description (2-3 sentences about current demand and future prospects)
      
      Return JSON in this exact structure:
      {
        "growthOutlook": {
          "trend": "Growing" | "Stable" | "Declining",
          "description": "string"
        },
        "salaryRanges": {
          "min": number,
          "avg": number,
          "max": number,
          "currency": "INR"
        },
        "jobRoles": [
          {"title": "string", "count": number}
        ],
        "technicalSkills": [
          {"skill": "string", "importance": "High" | "Medium" | "Low"}
        ],
        "softSkills": [
          {"skill": "string", "importance": "High" | "Medium" | "Low"}
        ],
        "topLocations": ["string"],
        "marketDemand": "string"
      }`;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        tools: [{
          googleSearchRetrieval: {}
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      throw new Error("Gemini API error");
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    
    console.log('Analysis complete');
    
    const insights = JSON.parse(responseText);

    return new Response(
      JSON.stringify({ insights }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in analyze-career function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
