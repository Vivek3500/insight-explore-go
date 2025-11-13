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
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Fetching content from:', url);
    
    // Fetch the website content
    const websiteResponse = await fetch(url);
    const htmlContent = await websiteResponse.text();
    
    // Truncate content if too large (Gemini has limits)
    const truncatedContent = htmlContent.slice(0, 50000);
    
    console.log('Sending to Gemini for extraction...');
    
    // Use Gemini to extract structured data
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a job data extraction specialist. Extract job listings from HTML content and return structured data in JSON format. 
            For each job, extract: title, company, location, salary (if available), experience required, skills required, and job description summary.
            Return an array of job objects. If no jobs are found, return an empty array.`
          },
          {
            role: "user",
            content: `Extract job listings from this HTML content:\n\n${truncatedContent}\n\nReturn only valid JSON with an array of job objects.`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const extractedText = data.choices[0].message.content;
    
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
