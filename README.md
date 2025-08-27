# FinTrack - Personal Finance Tracker

A modern personal finance tracking application built with Next.js 15, Supabase, and TypeScript. Track your income, expenses, and financial goals with ease.

## Features

- 🔐 **Authentication**: Secure Google OAuth sign-in
- 💰 **Balance Management**: Track multiple accounts (cash, bank accounts, mobile banking)
- 📊 **Transaction Management**: Add, view, and categorize income/expense transactions
- 🏷️ **Category System**: Organize transactions with custom categories
- 📈 **Dashboard**: Real-time overview of your financial status
- 📱 **Responsive Design**: Works perfectly on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **UI Components**: Custom components built with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system

## Project Structure

```
src/
├── actions/          # Server actions for data mutations
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
└── utils/            # Supabase client utilities
```

## Database Schema

### Tables

1. **profiles** - User profile information
2. **balances** - User's accounts/balances (cash, bank accounts, etc.)
3. **categories** - Transaction categories (income/expense)
4. **transactions** - Financial transactions
5. **liabilities** - User's debts and liabilities

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/your-username/fin-track.git
cd fin-track
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Set up the database

Run the following SQL in your Supabase SQL editor to create the necessary tables:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create balances table
CREATE TABLE balances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('cash', 'bank_account', 'mobile_banking')) NOT NULL,
  balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  balance_id UUID REFERENCES balances ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create liabilities table
CREATE TABLE liabilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security policies
-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Balances
CREATE POLICY "Users can view own balances" ON balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own balances" ON balances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own balances" ON balances FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own balances" ON balances FOR DELETE USING (auth.uid() = user_id);

-- Categories
CREATE POLICY "Users can view own categories" ON categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categories" ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON categories FOR DELETE USING (auth.uid() = user_id);

-- Transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

-- Liabilities
CREATE POLICY "Users can view own liabilities" ON liabilities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own liabilities" ON liabilities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own liabilities" ON liabilities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own liabilities" ON liabilities FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE liabilities ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 5. Configure Google OAuth

1. Go to your Supabase project settings > Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials (get them from Google Cloud Console)
4. Add `http://localhost:3000/auth/callback` to authorized redirect URIs

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. **Sign In**: Use Google OAuth to authenticate
2. **Set Up Accounts**: Add your bank accounts, cash, or mobile banking accounts
3. **Create Categories**: Set up income and expense categories
4. **Track Transactions**: Add your income and expense transactions
5. **Monitor Dashboard**: View your financial overview and recent transactions

## Key Features Explained

### Authentication
- Secure Google OAuth integration
- Automatic user profile creation
- Protected routes with middleware

### Dashboard
- Real-time financial overview
- Total balance across all accounts
- Income vs expenses tracking
- Recent transactions list

### Transaction Management
- Add income/expense transactions
- Link to specific accounts and categories
- Automatic balance updates
- Date tracking

### Account Management
- Multiple account types (cash, bank, mobile banking)
- Real-time balance tracking
- Account-specific transaction history

### Category System
- Custom income/expense categories
- Color coding for visual organization
- Category-based transaction filtering

## Development

### Project Structure
- `src/actions/` - Server actions for data mutations
- `src/app/` - Next.js app router pages and layouts
- `src/components/ui/` - Reusable UI components
- `src/types/` - TypeScript type definitions
- `src/utils/supabase/` - Supabase client configurations

### Key Technologies
- **Next.js 15**: React framework with App Router
- **Supabase**: Backend-as-a-Service for database and auth
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Low-level UI primitives

## Deployment

The application can be deployed to Vercel, Netlify, or any platform that supports Next.js.

1. Update environment variables for production
2. Configure OAuth redirect URLs for production domain
3. Deploy using your preferred platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
