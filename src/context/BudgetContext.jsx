import { createContext, useContext, useState, useEffect } from 'react'

const BudgetContext = createContext(null)

export const CURRENCIES = [
  { code: 'GBP', symbol: '£',   name: 'British Pound'    },
  { code: 'USD', symbol: '$',   name: 'US Dollar'        },
  { code: 'EUR', symbol: '€',   name: 'Euro'             },
  { code: 'INR', symbol: '₹',   name: 'Indian Rupee'     },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham'       },
  { code: 'PKR', symbol: '₨',   name: 'Pakistani Rupee'  },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar'  },
  { code: 'AUD', symbol: 'A$',  name: 'Australian Dollar'},
  { code: 'JPY', symbol: '¥',   name: 'Japanese Yen'     },
  { code: 'SGD', symbol: 'S$',  name: 'Singapore Dollar' },
  { code: 'CHF', symbol: 'Fr',  name: 'Swiss Franc'      },
  { code: 'SAR', symbol: '﷼',   name: 'Saudi Riyal'      },
]

export const formatCurrency = (n, currency = 'GBP') => {
  try {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(n)
  } catch {
    const sym = CURRENCIES.find(c => c.code === currency)?.symbol || currency
    return `${sym}${Number(n).toFixed(2)}`
  }
}

export const EXPENSE_CATEGORY_GROUPS = {
  'Housing':       ['Rent/Mortgage', 'Home Insurance', 'Maintenance & Repairs', 'Furniture & Decor', 'Council Tax'],
  'Food & Drink':  ['Groceries', 'Dining Out', 'Coffee & Cafes', 'Takeaway/Delivery', 'Work Lunches'],
  'Transport':     ['Public Transport', 'Fuel', 'Car Insurance', 'Car Maintenance', 'Taxi/Ride-share', 'Parking'],
  'Utilities':     ['Electricity', 'Gas/Heating', 'Water', 'Internet', 'Phone Bill'],
  'Healthcare':    ['Doctor/GP', 'Dentist', 'Pharmacy', 'Gym & Fitness', 'Mental Health'],
  'Shopping':      ['Clothing', 'Electronics', 'Personal Care', 'Gifts', 'Books & Stationery'],
  'Entertainment': ['Cinema & Theatre', 'Streaming', 'Gaming', 'Sports & Hobbies', 'Concerts & Events'],
  'Travel':        ['Flights', 'Hotels', 'Holiday Spending', 'Travel Extras'],
  'Education':     ['Courses & Training', 'Books & Learning', 'School/University', 'Childcare'],
  'Pets':          ['Pet Food', 'Vet Bills', 'Pet Supplies'],
  'Insurance':     ['Life Insurance', 'Travel Insurance', 'Pet Insurance'],
  'Other':         ['Charity & Donations', 'Miscellaneous'],
}

export const EXPENSE_SUBCATEGORIES = Object.values(EXPENSE_CATEGORY_GROUPS).flat()

export const SAVINGS_SUBCATEGORIES = [
  'Emergency Fund', 'Short-term Savings', 'Long-term Savings', 'House Deposit', 'Other Savings',
]

export const INVESTMENT_SUBCATEGORIES = [
  'Stocks/ETFs', 'Mutual Funds', 'Cryptocurrency', 'Real Estate',
  'Retirement Fund', 'Bonds', 'Other Investment',
]

export const NEEDS = [
  'Rent/Mortgage', 'Home Insurance', 'Maintenance & Repairs', 'Council Tax',
  'Groceries', 'Work Lunches',
  'Public Transport', 'Fuel', 'Car Insurance', 'Car Maintenance',
  'Electricity', 'Gas/Heating', 'Water', 'Internet', 'Phone Bill',
  'Doctor/GP', 'Dentist', 'Pharmacy',
  'Life Insurance', 'School/University', 'Childcare',
  'Pet Food', 'Vet Bills',
]

export const WANTS = [
  'Dining Out', 'Coffee & Cafes', 'Takeaway/Delivery',
  'Taxi/Ride-share', 'Parking', 'Gym & Fitness', 'Mental Health',
  'Pet Insurance', 'Personal Care', 'Clothing', 'Electronics', 'Gifts', 'Books & Stationery',
  'Cinema & Theatre', 'Streaming', 'Gaming', 'Sports & Hobbies', 'Concerts & Events',
  'Flights', 'Hotels', 'Holiday Spending', 'Travel Extras', 'Travel Insurance',
  'Courses & Training', 'Books & Learning', 'Pet Supplies',
  'Furniture & Decor', 'Charity & Donations', 'Miscellaneous',
]

export const CATEGORY_COLORS = {
  'Rent/Mortgage':         '#f9a8d4',
  'Home Insurance':        '#fbb6ce',
  'Maintenance & Repairs': '#fca5a5',
  'Furniture & Decor':     '#fdba74',
  'Council Tax':           '#fcd34d',
  'Groceries':             '#fed7aa',
  'Dining Out':            '#fde68a',
  'Coffee & Cafes':        '#fef08a',
  'Takeaway/Delivery':     '#d9f99d',
  'Work Lunches':          '#bbf7d0',
  'Public Transport':      '#86efac',
  'Fuel':                  '#6ee7b7',
  'Car Insurance':         '#5eead4',
  'Car Maintenance':       '#67e8f9',
  'Taxi/Ride-share':       '#a5f3fc',
  'Parking':               '#bae6fd',
  'Electricity':           '#93c5fd',
  'Gas/Heating':           '#a5b4fc',
  'Water':                 '#c4b5fd',
  'Internet':              '#d8b4fe',
  'Phone Bill':            '#e9d5ff',
  'Doctor/GP':             '#f0abfc',
  'Dentist':               '#f9a8d4',
  'Pharmacy':              '#fbcfe8',
  'Gym & Fitness':         '#fce7f3',
  'Mental Health':         '#ede9fe',
  'Clothing':              '#fde68a',
  'Electronics':           '#bbf7d0',
  'Personal Care':         '#f9a8d4',
  'Gifts':                 '#c4b5fd',
  'Books & Stationery':    '#bae6fd',
  'Cinema & Theatre':      '#fbcfe8',
  'Streaming':             '#c4b5fd',
  'Gaming':                '#a5b4fc',
  'Sports & Hobbies':      '#bbf7d0',
  'Concerts & Events':     '#f9a8d4',
  'Flights':               '#bae6fd',
  'Hotels':                '#93c5fd',
  'Holiday Spending':      '#c4b5fd',
  'Travel Extras':         '#ddd6fe',
  'Courses & Training':    '#bbf7d0',
  'Books & Learning':      '#bae6fd',
  'School/University':     '#c4b5fd',
  'Childcare':             '#fbcfe8',
  'Pet Food':              '#fde68a',
  'Vet Bills':             '#fca5a5',
  'Pet Supplies':          '#fed7aa',
  'Life Insurance':        '#fecdd3',
  'Travel Insurance':      '#fed7aa',
  'Pet Insurance':         '#fef9c3',
  'Charity & Donations':   '#d1fae5',
  'Miscellaneous':         '#e5e7eb',
  'Emergency Fund':        '#86efac',
  'Short-term Savings':    '#6ee7b7',
  'Long-term Savings':     '#4ade80',
  'House Deposit':         '#34d399',
  'Other Savings':         '#2dd4bf',
  'Stocks/ETFs':           '#818cf8',
  'Mutual Funds':          '#6366f1',
  'Cryptocurrency':        '#a78bfa',
  'Real Estate':           '#c084fc',
  'Retirement Fund':       '#d946ef',
  'Bonds':                 '#a5b4fc',
  'Other Investment':      '#8b5cf6',
}

export const GROUP_IDEALS = {
  'Housing':       0.30,
  'Food & Drink':  0.15,
  'Transport':     0.10,
  'Utilities':     0.08,
  'Healthcare':    0.05,
  'Shopping':      0.06,
  'Entertainment': 0.05,
  'Travel':        0.04,
  'Education':     0.04,
  'Insurance':     0.03,
  'Pets':          0.02,
  'Other':         0.02,
}

export function BudgetProvider({ children }) {
  const [entries, setEntries] = useState(() => {
    try { return JSON.parse(localStorage.getItem('budget_entries')) || [] } catch { return [] }
  })
  const [incomeData, setIncomeData] = useState(() => {
    try { return JSON.parse(localStorage.getItem('budget_income')) || {} } catch { return {} }
  })
  const [currency, setCurrencyState] = useState(() => {
    return localStorage.getItem('budget_currency') || 'GBP'
  })

  useEffect(() => { localStorage.setItem('budget_entries', JSON.stringify(entries)) }, [entries])
  useEffect(() => { localStorage.setItem('budget_income', JSON.stringify(incomeData)) }, [incomeData])
  useEffect(() => { localStorage.setItem('budget_currency', currency) }, [currency])

  const addEntry = (entry) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      month: entry.date.substring(0, 7),
    }
    setEntries(prev => [newEntry, ...prev])
  }

  const updateEntry = (id, updates) => {
    setEntries(prev => prev.map(e =>
      e.id === id
        ? { ...e, ...updates, month: (updates.date || e.date).substring(0, 7) }
        : e
    ))
  }

  const deleteEntry = (id) => setEntries(prev => prev.filter(e => e.id !== id))

  const setCurrency = (code) => setCurrencyState(code)

  const setMonthlyIncome = (month, amount) =>
    setIncomeData(prev => ({ ...prev, [month]: parseFloat(amount) || 0 }))

  const getMonthEntries = (month) => entries.filter(e => e.month === month)

  const getAllMonths = () => {
    const months = new Set(entries.map(e => e.month))
    Object.keys(incomeData).forEach(m => months.add(m))
    return Array.from(months).sort().reverse()
  }

  const getCurrentMonth = () => new Date().toISOString().substring(0, 7)

  return (
    <BudgetContext.Provider value={{
      entries, incomeData, currency,
      addEntry, updateEntry, deleteEntry,
      setCurrency, setMonthlyIncome,
      getMonthEntries, getAllMonths, getCurrentMonth,
    }}>
      {children}
    </BudgetContext.Provider>
  )
}

export const useBudget = () => {
  const ctx = useContext(BudgetContext)
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider')
  return ctx
}
