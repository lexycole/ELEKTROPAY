-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    plan VARCHAR NOT NULL,
    status VARCHAR NOT NULL,
    renewal_date TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    amount DECIMAL(10, 2),
    currency VARCHAR(10),
    payment_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR NOT NULL
);


ALTER TABLE users
ADD COLUMN role VARCHAR DEFAULT 'user';


CREATE VIEW sales_by_payment_method AS
SELECT
    user_id,
    payment_method,
    SUM(amount) AS total_sales
FROM payments
GROUP BY user_id, payment_method;


ALTER TABLE users
ADD COLUMN role VARCHAR DEFAULT 'user';


-- Merchants Table
CREATE TABLE merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reseller_id UUID REFERENCES users(id),
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sales Table for Merchants
CREATE TABLE merchant_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(id),
    payment_method VARCHAR NOT NULL,
    amount DECIMAL(10, 2),
    sale_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    merchant_id INTEGER REFERENCES merchants(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) CHECK (status IN ('Pending', 'Paid', 'Overdue')) DEFAULT 'Pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    amount AS (quantity * unit_price) STORED
);


create table invoices (
  id uuid primary key default uuid_generate_v4(),
  merchant_id uuid references merchants(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  issue_date date not null,
  due_date date not null,
  status text check (status IN ('Pending', 'Paid', 'Overdue')) default 'Pending',
  total_amount numeric(10,2) not null,
  created_at timestamp default now()
);
create table invoice_items (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid references invoices(id) on delete cascade,
  description text not null,
  quantity int not null,
  unit_price numeric(10,2) not null,
  amount numeric(10,2) generated always as (quantity * unit_price) stored
);

create table invoice_reminders (
  id uuid primary key default uuid_generate_v4(),
  invoice_id uuid references invoices(id) on delete cascade,
  sent_at timestamp default now()
);


alter table settings add column sms_notifications boolean default true;

alter table settings add column auto_reminders boolean default true;

alter table settings add column reminder_frequency text default 'daily';
-----supabase auth
CREATE TABLE merchants (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  total_sales DECIMAL DEFAULT 0,
  payment_method TEXT,
  reseller_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL, -- admin, reseller, merchant
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- Create users table if not already created
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL, -- admin, reseller, merchant
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add role values to users table (Super Admin, Reseller, Merchant)
INSERT INTO users (email, role) VALUES
('admin@example.com', 'admin'),
('reseller@example.com', 'reseller'),
('merchant@example.com', 'merchant');


-- Super Admin can perform all actions on all tables
CREATE POLICY "super_admin_access"
  ON ALL TABLES
  FOR ALL
  USING (auth.role() = 'admin');


-- Reseller can access merchants they are associated with
CREATE POLICY "reseller_access"
  ON merchants
  FOR SELECT
  USING (auth.role() = 'reseller' AND reseller_id = auth.uid());


-- Merchant can access their own data
CREATE POLICY "merchant_access"
  ON merchants
  FOR SELECT, UPDATE, DELETE
  USING (auth.role() = 'merchant' AND id = auth.uid());
