-- Create bank_configs table for storing payment settings
CREATE TABLE IF NOT EXISTS public.bank_configs (
  id BIGSERIAL PRIMARY KEY,
  bank_name VARCHAR(255) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  branch VARCHAR(255) NOT NULL,
  swift_code VARCHAR(20),
  banks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_bank_configs_updated_at ON public.bank_configs(updated_at DESC);

-- Enable RLS
ALTER TABLE public.bank_configs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow service role to access
CREATE POLICY "Allow service role access" ON public.bank_configs
  FOR ALL USING (true)
  WITH CHECK (true);

-- Insert default config if not exists
INSERT INTO public.bank_configs (bank_name, account_name, account_number, branch, swift_code)
VALUES ('Ngân hàng Vietcombank', 'EcoGood Coffee', '1234567890', 'Chi nhánh Hà Nội', 'BFTVVNVX')
ON CONFLICT DO NOTHING;
