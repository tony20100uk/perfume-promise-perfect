
-- Create tables for the perfume business management system

-- Clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  id_number TEXT UNIQUE,
  email TEXT UNIQUE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'overdue')),
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- User profiles table (for authentication)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'admin')) DEFAULT 'client',
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for clients
CREATE POLICY "Admins can manage all clients" ON public.clients
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Clients can view their own data" ON public.clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.client_id = clients.id
    )
  );

-- RLS Policies for payments
CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Clients can view their own payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.client_id = payments.client_id
    )
  );

-- RLS Policies for orders
CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Clients can view their own orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.client_id = orders.client_id
    )
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Trigger to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'name', 'New User'), 'client');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert test data with proper UUIDs
INSERT INTO public.clients (id, name, id_number, email, phone, created_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'สมชาย ใจดี', '1234567890123', 'somchai@email.com', '081-234-5678', '2024-01-15'),
  ('550e8400-e29b-41d4-a716-446655440002', 'John Smith', NULL, 'john@email.com', '+66-87-654-3210', '2024-02-20'),
  ('550e8400-e29b-41d4-a716-446655440003', 'นิดา สวยงาม', '9876543210987', NULL, '089-876-5432', '2024-03-10');

INSERT INTO public.payments (client_id, amount, due_date, status, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 2500.00, '2024-12-15', 'overdue', 'Custom Rose & Sandalwood Perfume'),
  ('550e8400-e29b-41d4-a716-446655440001', 1800.00, '2024-12-25', 'pending', 'Jasmine Night Fragrance'),
  ('550e8400-e29b-41d4-a716-446655440001', 3200.00, '2024-11-30', 'paid', 'Citrus Fresh Collection'),
  ('550e8400-e29b-41d4-a716-446655440002', 4500.00, '2024-12-20', 'pending', 'Signature Woody Blend'),
  ('550e8400-e29b-41d4-a716-446655440002', 2800.00, '2024-11-15', 'paid', 'Tropical Paradise Set');

UPDATE public.payments SET paid_date = '2024-11-28' WHERE status = 'paid' AND client_id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE public.payments SET paid_date = '2024-11-14' WHERE status = 'paid' AND client_id = '550e8400-e29b-41d4-a716-446655440002';

INSERT INTO public.orders (client_id, description, amount, status, created_at, completed_at, notes) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Custom Rose & Sandalwood Perfume - 50ml', 2500.00, 'completed', '2024-11-01', '2024-11-15', 'Extra rose essence, medium sandalwood base'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Jasmine Night Fragrance - 30ml', 1800.00, 'in-progress', '2024-12-01', NULL, 'Evening wear, subtle jasmine'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Signature Woody Blend - 100ml', 4500.00, 'pending', '2024-12-10', NULL, 'Corporate signature scent'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Tropical Paradise Set - 3x30ml', 2800.00, 'completed', '2024-10-15', '2024-11-01', 'Mango, coconut, frangipani blend');
