---
applyTo: '**'
---


## Project Context

A personal finance tracker app. Money is only stored in US dollars.


## Tech stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase DB, Auth

## Project Requirements

- **Auth**:
    - Sign in with Google
    - Signout 

- **Dashboard**:
    - View summary of income, expenses, and Balance
    - View recent transactions

- **Transactions**:
    - Add new transaction (income/expense)


**Anatomy**:
- **Balance**: Where you the money is stored. E.g., Cash, Bank account, Mobile banking account.
- **Category**: Type of transaction. E.g., Food, Salary, Entertainment, Groceries, etc.
- **Transaction**: A record of money coming in (income) or going out (expense). Each transaction is linked to a Balance and a Category.
- **Liability**: Money that you owe to others. E.g., Loans, Credit card dues, etc.