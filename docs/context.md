# SpendWise Application Documentation

## Navigation Structure

### Navbar
- Left: SpendWise Logo (links to home/dashboard)
- Right: 
  - Dashboard
  - Rules
  - Monthly Comparisons
  - Profile

## Dashboard (Home Page)

### Layout
- Top: Rule Selection Display
  - Shows currently selected rule (e.g., "Rule selected: 50/30/20")
  - Plus button for creating new categories

### Category Containers
Each category displays:
- Name
- Priority (1-3)
- Budget Status
  - Priority 1 (Essentials):
    - Shows "Paid/Not Paid" status
    - Paid button to mark as paid
    - Visual indicator (Red/Green) for payment status
  - Priority 2 & 3:
    - Remaining budget display (e.g., "5k/11k")
    - Input field with +/- buttons for budget adjustments
    - Color-coded thresholds:
      - Red: < 10% remaining
      - Green: > 90% remaining

### Recommendations Feature
- Button to view spending recommendations
- Suggestions include:
  - Priority budget warnings
  - Reallocation suggestions
  - Usage pattern insights

### Category Creation
- Plus button opens popup with:
  - Category name input
  - Priority selection
  - Budget allocation
  - Validation against priority limits

### Bottom Summary
- Needs remaining
- Wants remaining
- Savings remaining
- Monthly totals

## Budgeting Rules

### Available Rules
1. **50/30/20 Rule**
   - 50% Needs (Rent, bills, groceries)
   - 30% Wants (Dining, entertainment)
   - 20% Savings/Debt
   - Ideal for beginners

2. **Zero-Based Budgeting**
   - Every rupee/dollar assigned
   - Income − Expenses = 0
   - Maximum control

3. **80/20 Rule**
   - 20% Save/Invest first
   - 80% Everything else
   - Encourages saving habits

4. **70/20/10 Rule**
   - 70% Living expenses
   - 20% Savings
   - 10% Giving
   - Balanced approach

5. **Priority-Based Budgeting**
   - Custom allocation based on personal priorities
   - Highly adaptable

### Rule Customization
- Dropdown interface for each rule
- Detailed rule explanations
- Customization options (e.g., 60/20/20 instead of 50/30/20)
- Rule selection and modification interface

## Monthly Comparisons

### Features
- Current month's spending pie chart
  - Categories breakdown
  - Money left visualization
- Previous months comparison
  - Histogram view of last two months
  - Category-wise comparison
  - Spending recommendations
- New user handling
  - Message for first-month users
  - Comparison availability notice

## Profile Management

### Profile Page
- User Information Display:
  - Username
  - Email
  - Age
  - Gender
  - Monthly Income
  - Total Savings
- Edit Profile Button
- Logout Button

### Edit Profile
- Editable Fields:
  - Age
  - Gender
  - Monthly Income
  - Total Savings
  - Password Change Option

## First-Time User Experience
- Welcome popup on first login
- Budget setup prompt
- Profile completion guidance
- Initial setup wizard

## Priority System
1. **Priority 1 (Essentials)**
   - Essential expenses
   - Pre-allocated funds
   - Must-pay items

2. **Priority 2 (Lifestyle)**
   - Entertainment
   - Food
   - Other discretionary spending

3. **Priority 3 (Savings)**
   - Based on selected rule
   - Investment allocations
   - Future planning

Note: Priority allocations and percentages may vary based on selected budgeting rule.
