# SpendWise Database Schema

## Tables

### Users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(20),
    monthly_income DECIMAL(10,2),
    total_savings DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Categories
```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    priority INTEGER NOT NULL CHECK (priority BETWEEN 1 AND 3),
    budget DECIMAL(10,2) NOT NULL,
    spent DECIMAL(10,2) DEFAULT 0,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Rules
```sql
CREATE TABLE rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    needs_percentage DECIMAL(5,2) NOT NULL,
    wants_percentage DECIMAL(5,2) NOT NULL,
    savings_percentage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_percentages CHECK (
        needs_percentage + wants_percentage + savings_percentage = 100
    )
);
```

### User_Rules
```sql
CREATE TABLE user_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rule_id UUID NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT FALSE,
    custom_needs_percentage DECIMAL(5,2),
    custom_wants_percentage DECIMAL(5,2),
    custom_savings_percentage DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_custom_percentages CHECK (
        custom_needs_percentage + custom_wants_percentage + custom_savings_percentage = 100
    )
);
```

### Transactions
```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Monthly_Summaries
```sql
CREATE TABLE monthly_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    total_income DECIMAL(10,2) NOT NULL,
    total_expenses DECIMAL(10,2) NOT NULL,
    savings DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, year, month)
);
```

## Default Rules Data

```sql
INSERT INTO rules (name, description, needs_percentage, wants_percentage, savings_percentage) VALUES
    ('50/30/20 Rule', '50% Needs, 30% Wants, 20% Savings/Debt', 50.00, 30.00, 20.00),
    ('Zero-Based Budgeting', 'Every dollar assigned, Income - Expenses = 0', 0.00, 0.00, 0.00),
    ('80/20 Rule', '20% Save/Invest first, 80% Everything else', 0.00, 80.00, 20.00),
    ('70/20/10 Rule', '70% Living expenses, 20% Savings, 10% Giving', 70.00, 10.00, 20.00),
    ('Priority-Based Budgeting', 'Custom allocation based on personal priorities', 0.00, 0.00, 0.00);
```

## Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Categories
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_priority ON categories(priority);

-- User_Rules
CREATE INDEX idx_user_rules_user_id ON user_rules(user_id);
CREATE INDEX idx_user_rules_rule_id ON user_rules(rule_id);
CREATE INDEX idx_user_rules_active ON user_rules(is_active) WHERE is_active = TRUE;

-- Transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_date ON transactions(date);

-- Monthly_Summaries
CREATE INDEX idx_monthly_summaries_user_id ON monthly_summaries(user_id);
CREATE INDEX idx_monthly_summaries_year_month ON monthly_summaries(year, month);
```

## Triggers

```sql
-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rules_updated_at
    BEFORE UPDATE ON rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_rules_updated_at
    BEFORE UPDATE ON user_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_summaries_updated_at
    BEFORE UPDATE ON monthly_summaries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Notes

1. **UUID Usage**: All primary keys use UUID for better scalability and security.
2. **Decimal Precision**: All monetary values use DECIMAL(10,2) for precise financial calculations.
3. **Timestamps**: All tables include created_at and updated_at timestamps for tracking.
4. **Cascade Deletion**: User deletion cascades to related records in other tables.
5. **Constraints**: 
   - Category priorities are restricted to 1-3
   - Rule percentages must sum to 100%
   - Custom rule percentages must sum to 100%
6. **Indexes**: Optimized for common query patterns
7. **Triggers**: Automatically update the updated_at timestamp on any record modification

## Relationships

1. **Users to Categories**: One-to-Many
   - One user can have many categories
   - Categories are deleted when user is deleted

2. **Users to Rules**: Many-to-Many through User_Rules
   - Users can have multiple rules
   - Only one rule can be active at a time
   - Rules can be customized per user

3. **Users to Transactions**: One-to-Many
   - One user can have many transactions
   - Transactions are deleted when user is deleted

4. **Categories to Transactions**: One-to-Many
   - One category can have many transactions
   - Transactions are deleted when category is deleted

5. **Users to Monthly_Summaries**: One-to-Many
   - One user can have many monthly summaries
   - Summaries are unique per user per month 