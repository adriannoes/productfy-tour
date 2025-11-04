-- Create tour_analytics table for tracking user interactions
CREATE TABLE tour_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'complete', 'skip', 'step_view')),
  step_index INTEGER,
  user_identifier TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_tour_analytics_tour_id ON tour_analytics(tour_id);
CREATE INDEX idx_tour_analytics_event_type ON tour_analytics(event_type);
CREATE INDEX idx_tour_analytics_created_at ON tour_analytics(created_at DESC);

-- Enable RLS
ALTER TABLE tour_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for tracking
CREATE POLICY "Allow anonymous insert" ON tour_analytics
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow select only for authenticated users who own the tour
CREATE POLICY "Allow select for authenticated" ON tour_analytics
  FOR SELECT
  TO authenticated
  USING (
    tour_id IN (
      SELECT id FROM tours WHERE user_id = auth.uid()
    )
  );