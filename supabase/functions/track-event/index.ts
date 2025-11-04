import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { tourId, eventType, stepIndex, userIdentifier, metadata } = await req.json();

    console.log('Tracking event:', { tourId, eventType, stepIndex, userIdentifier });

    if (!tourId || !eventType) {
      return new Response(
        JSON.stringify({ error: 'tourId and eventType are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert event
    const { error } = await supabase
      .from('tour_analytics')
      .insert({
        tour_id: tourId,
        event_type: eventType,
        step_index: stepIndex,
        user_identifier: userIdentifier,
        metadata: metadata || {}
      });

    if (error) {
      console.error('Error inserting event:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Track event error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
