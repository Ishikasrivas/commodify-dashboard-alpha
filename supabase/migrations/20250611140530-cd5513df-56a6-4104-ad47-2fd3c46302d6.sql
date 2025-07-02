
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('manager', 'storekeeper');

-- Create profiles table that extends auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'storekeeper',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table for the commodities management
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  supplier TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'in-stock' CHECK (status IN ('in-stock', 'low-stock', 'out-of-stock')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    CASE 
      WHEN NEW.email LIKE '%manager%' THEN 'manager'::app_role
      ELSE 'storekeeper'::app_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for products
CREATE POLICY "Authenticated users can view products" ON public.products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" ON public.products
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Managers can delete products" ON public.products
  FOR DELETE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'manager'
    )
  );

-- Insert some sample data
INSERT INTO public.products (name, category, price, quantity, supplier, description, status) VALUES
('Rice Premium', 'Grains', 45.99, 500, 'AgriSupply Co.', 'High-quality basmati rice', 'in-stock'),
('Wheat Flour', 'Grains', 32.50, 200, 'Mill Masters', 'Whole wheat flour for baking', 'in-stock'),
('Cooking Oil', 'Oils', 89.99, 150, 'Golden Oils Ltd.', 'Refined sunflower oil', 'low-stock'),
('Sugar White', 'Sweeteners', 55.75, 300, 'Sweet Solutions', 'Pure white granulated sugar', 'in-stock'),
('Black Pepper', 'Spices', 125.00, 50, 'Spice World', 'Ground black pepper', 'low-stock'),
('Coffee Beans', 'Beverages', 180.25, 75, 'Bean Masters', 'Arabica coffee beans', 'in-stock');
