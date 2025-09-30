-- Create table for contrast test results
CREATE TABLE public.contrast_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  test_type TEXT NOT NULL,
  color1 TEXT NOT NULL,
  color2 TEXT,
  contrast_ratio NUMERIC(5,2) NOT NULL,
  wcag_level TEXT NOT NULL,
  passes_aa BOOLEAN NOT NULL DEFAULT false,
  passes_aaa BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.contrast_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view results (public read access)
CREATE POLICY "Anyone can view contrast results"
ON public.contrast_results
FOR SELECT
USING (true);

-- Allow anyone to insert results (public write access)
CREATE POLICY "Anyone can insert contrast results"
ON public.contrast_results
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_contrast_results_created_at ON public.contrast_results(created_at DESC);

-- Enable realtime
ALTER TABLE public.contrast_results REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contrast_results;