-- Create tours table
CREATE TABLE IF NOT EXISTS public.tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  is_active boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for tours
CREATE INDEX IF NOT EXISTS idx_tours_user_id ON public.tours(user_id);
CREATE INDEX IF NOT EXISTS idx_tours_is_active ON public.tours(is_active);

-- Create tour_steps table
CREATE TABLE IF NOT EXISTS public.tour_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid REFERENCES public.tours(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  target text NOT NULL,
  placement text NOT NULL CHECK (placement IN ('top', 'bottom', 'left', 'right')),
  step_order integer NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for tour_steps
CREATE INDEX IF NOT EXISTS idx_tour_steps_tour_id ON public.tour_steps(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_steps_order ON public.tour_steps(tour_id, step_order);
CREATE UNIQUE INDEX IF NOT EXISTS idx_tour_steps_unique_order ON public.tour_steps(tour_id, step_order);

-- Create function to update updated_at automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_tours_updated_at ON public.tours;
CREATE TRIGGER update_tours_updated_at
  BEFORE UPDATE ON public.tours
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on tours
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;

-- RLS policies for tours
CREATE POLICY "Users can view own tours"
  ON public.tours FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tours"
  ON public.tours FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tours"
  ON public.tours FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tours"
  ON public.tours FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view active tours"
  ON public.tours FOR SELECT
  USING (is_active = true);

-- Enable RLS on tour_steps
ALTER TABLE public.tour_steps ENABLE ROW LEVEL SECURITY;

-- RLS policies for tour_steps
CREATE POLICY "Users can view own tour steps"
  ON public.tour_steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tours
      WHERE tours.id = tour_steps.tour_id
      AND tours.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own tour steps"
  ON public.tour_steps FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tours
      WHERE tours.id = tour_steps.tour_id
      AND tours.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own tour steps"
  ON public.tour_steps FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tours
      WHERE tours.id = tour_steps.tour_id
      AND tours.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own tour steps"
  ON public.tour_steps FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.tours
      WHERE tours.id = tour_steps.tour_id
      AND tours.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view active tour steps"
  ON public.tour_steps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tours
      WHERE tours.id = tour_steps.tour_id
      AND tours.is_active = true
    )
  );