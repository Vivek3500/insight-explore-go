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
    const { url } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("Hiresight");
    
    if (!GEMINI_API_KEY) {
      throw new Error("Hiresight API key is not configured");
    }

    console.log('Fetching content from:', url);
    
    // Fetch the website content
    const websiteResponse = await fetch(url);
    const htmlContent = await websiteResponse.text();
    
    // Truncate content if too large (Gemini has limits)
    const truncatedContent = htmlContent.slice(0, 50000);
    
    console.log('Sending to Gemini for extraction...');
    
    const prompt = `You are a job data extraction specialist. Extract job listings from HTML content and return structured data in JSON format. 
For each job, extract: title, company, location, salary (if available), experience required, skills required, and job description summary.
Return an array of job objects. If no jobs are found, return an empty array.

Extract job listings from this HTML content:

${truncatedContent}

Return only valid JSON with an array of job objects.`;
    
    // Use Gemini API directly
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
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
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
    const extractedText = data.candidates[0].content.parts[0].text;
    
    console.log('Extraction complete');
    
    // Try to parse the JSON response
    let jobs = [];
    try {
      // Remove markdown code blocks if present
      const jsonMatch = extractedText.match(/```json\n?([\s\S]*?)\n?```/) || 
                       extractedText.match(/\[[\s\S]*\]/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : extractedText;
      jobs = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      // Return raw text if JSON parsing fails
      jobs = [{ rawData: extractedText }];
    }

    return new Response(
      JSON.stringify({ jobs, source: url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in scrape-jobs function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
