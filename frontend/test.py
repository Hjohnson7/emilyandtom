# Loan parameters
principal = 50000  # Initial loan amount (£)
monthly_payment = 363  # Monthly payment (£)
annual_interest_rate = 4.3 / 100  # Annual interest rate
monthly_interest_rate = annual_interest_rate / 12  # Monthly interest rate
lump_sum_payment = 700  # Lump sum paid every year (£)

# Variables to track the loan status
current_balance = principal
total_paid = 0
months = 0

# Simulate loan payments month by month
while current_balance > 0:
    # Apply monthly interest
    interest_for_the_month = current_balance * monthly_interest_rate
    current_balance += interest_for_the_month
    
    # Pay the monthly installment
    current_balance -= monthly_payment
    total_paid += monthly_payment
    
    # Check if it's the end of a year to apply the lump sum
    if (months + 1) % 12 == 0:
        current_balance -= lump_sum_payment
        total_paid += lump_sum_payment
    
    # Prevent the balance from going negative
    if current_balance < 0:
        current_balance = 0
    
    # Increment month counter
    months += 1

# Calculate total payment
years = months / 12
total_paid += current_balance  # Add any remaining balance at the end

print(years, total_paid)  # Return time in years and total paid

