import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.42.0'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query_text } = await req.json()

    if (!query_text || typeof query_text !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'query_text is required and must be a string'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get OpenAI API key from Supabase secrets
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not configured')
      throw new Error('AI service not configured')
    }

    // Generate embedding for the user's query
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: query_text,
        model: 'text-embedding-ada-002',
        encoding_format: 'float'
      })
    })

    if (!embeddingResponse.ok) {
      const errorData = await embeddingResponse.json()
      console.error('OpenAI embedding error:', errorData)
      throw new Error('Failed to generate query embedding')
    }

    const embeddingData = await embeddingResponse.json()
    const queryEmbedding = embeddingData.data[0].embedding

    // Connect to Supabase to perform vector similarity search
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Call the match_resources function with the query embedding
    const { data: matches, error: matchError } = await supabaseClient.rpc('match_resources', {
      query_embedding: `[${queryEmbedding.join(',')}]`,
      match_threshold: 0.7,
      max_results: 3
    })

    if (matchError) {
      console.error('Vector search error:', matchError)
      throw new Error('Failed to search resources')
    }

    return new Response(
      JSON.stringify({
        success: true,
        matches: matches || [],
        query_processed: query_text
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in match-resources:', error)

    // Global error handling - escalate to Keragon
    try {
      const keragonWebhookUrl = Deno.env.get('KERAGON_WEBHOOK_URL')
      if (keragonWebhookUrl) {
        await fetch(keragonWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'automation_failure',
            function_name: 'match-resources',
            error_message: error.message,
            severity: 'medium',
            timestamp: new Date().toISOString()
          })
        })
      }
    } catch (keragonError) {
      console.error('Failed to escalate error to Keragon:', keragonError)
    }

    return new Response(
      JSON.stringify({
        error: 'Failed to match resources',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
