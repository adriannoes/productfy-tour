import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const tourId = url.searchParams.get('tourId');

    if (!tourId) {
      console.error('Missing tourId parameter');
      return new Response(
        JSON.stringify({ error: 'tourId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching tour with ID: ${tourId}`);

    // Create Supabase client with service role to bypass RLS for public reads
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch active tour and its steps
    const { data: tour, error: tourError } = await supabase
      .from('tours')
      .select(`
        id,
        name,
        is_active,
        tour_steps (
          id,
          title,
          content,
          target,
          placement,
          step_order
        )
      `)
      .eq('id', tourId)
      .eq('is_active', true)
      .single();

    if (tourError || !tour) {
      console.error('Tour not found or not active:', tourError);
      return new Response(
        JSON.stringify({ error: 'Tour not found or not active' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sort steps by order
    const sortedSteps = (tour.tour_steps || [])
      .sort((a: any, b: any) => a.step_order - b.step_order);

    const response = {
      id: tour.id,
      name: tour.name,
      steps: sortedSteps.map((step: any) => ({
        title: step.title,
        content: step.content,
        target: step.target,
        placement: step.placement,
      })),
    };

    console.log(`Tour ${tourId} retrieved successfully with ${sortedSteps.length} steps`);

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
        } 
      }
    );
  } catch (error) {
    console.error('Error in get-tour function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
