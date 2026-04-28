import { useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { useBudget, CATEGORY_COLORS, formatCurrency } from '../context/BudgetContext'
import { TrendingDown, TrendingUp, Wallet, PiggyBank } from 'lucide-react'

const fmtMonth = (m) => new Date(m + '-02').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

const tooltipStyle = {
  background: '#ffffff', border: '1px solid #ede9fe',
  borderRadius: '10px', color: '#4c1d95', fontSize: '13px',
  boxShadow: '0 4px 12px rgba(139,92,246,0.1)',
}

const cardStyle = { background: '#ffffff', borderRadius: '16px', border: '1px solid #ede9fe', padding: '16px', boxShadow: '0 1px 4px rgba(139,92,246,0.06)' }

function SummaryCard({ title, value, icon: Icon, accent }) {
  return (
    <div style={cardStyle}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wide" style={{ color: '#9ca3af' }}>{title}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: accent + '22', color: accent }}>
          <Icon size={15} />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: '#3b0764' }}>{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const { getMonthEntries, incomeData, getAllMonths, getCurrentMonth, currency } = useBudget()
  const fmt      = (n) => formatCurrency(n, currency)
  const currentMonth = getCurrentMonth()
  const allMonths    = getAllMonths()
  const monthOptions = allMonths.length > 0 ? allMonths : [currentMonth]

  const [selectedMonth, setSelectedMonth] = useState(currentMonth)

  const entries     = getMonthEntries(selectedMonth)
  const income      = incomeData[selectedMonth] || 0
  const totalSpent  = entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0)
  const totalSaved  = entries.filter(e => e.type === 'savings').reduce((s, e) => s + e.amount, 0)
  const totalInvest = entries.filter(e => e.type === 'investment').reduce((s, e) => s + e.amount, 0)
  const balance     = income - totalSpent - totalSaved - totalInvest

  const subcatMap = {}
  entries.filter(e => e.type === 'expense').forEach(e => {
    subcatMap[e.subcategory] = (subcatMap[e.subcategory] || 0) + e.amount
  })
  const pieData = Object.entries(subcatMap).map(([name, value]) => ({ name, value }))

  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const m = d.toISOString().substring(0, 7)
    const mes = getMonthEntries(m)
    return {
      month:       new Date(m + '-02').toLocaleDateString('en-GB', { month: 'short' }),
      Expenses:    mes.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0),
      Savings:     mes.filter(e => e.type === 'savings').reduce((s, e) => s + e.amount, 0),
      Investments: mes.filter(e => e.type === 'investment').reduce((s, e) => s + e.amount, 0),
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#3b0764' }}>Dashboard</h2>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Your financial overview</p>
        </div>
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm focus:outline-none"
          style={{ background: '#fff', border: '1px solid #ddd6fe', color: '#6d28d9' }}>
          {monthOptions.map(m => <option key={m} value={m}>{fmtMonth(m)}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard title="Monthly Income" value={fmt(income)}      icon={Wallet}       accent="#8b5cf6" />
        <SummaryCard title="Total Spent"    value={fmt(totalSpent)}  icon={TrendingDown} accent="#f43f5e" />
        <SummaryCard title="Saved"          value={fmt(totalSaved)}  icon={PiggyBank}    accent="#10b981" />
        <SummaryCard title="Invested"       value={fmt(totalInvest)} icon={TrendingUp}   accent="#6366f1" />
      </div>

      {income > 0 && (
        <div style={cardStyle}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm" style={{ color: '#9ca3af' }}>Monthly Balance</span>
            <span className="font-bold" style={{ color: balance >= 0 ? '#10b981' : '#f43f5e' }}>{fmt(balance)}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#f3f0ff' }}>
            <div className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.max(0, (totalSpent / income) * 100))}%`,
                background: 'linear-gradient(to right, #86efac, #fde68a, #fca5a5)',
              }} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs" style={{ color: '#c4b5fd' }}>Spent {income > 0 ? Math.round((totalSpent / income) * 100) : 0}%</span>
            <span className="text-xs" style={{ color: '#c4b5fd' }}>Remaining {income > 0 ? Math.round((balance / income) * 100) : 0}%</span>
          </div>
        </div>
      )}

      {entries.length === 0 && income === 0 ? (
        <div className="text-center py-16" style={{ ...cardStyle, padding: '64px 16px' }}>
          <Wallet size={48} className="mx-auto mb-4" style={{ color: '#ddd6fe' }} />
          <h3 className="font-semibold text-lg mb-2" style={{ color: '#6d28d9' }}>No data yet</h3>
          <p className="text-sm" style={{ color: '#9ca3af' }}>Head to "Add Entry" to set your income and log your first expense.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div style={{ ...cardStyle, padding: '20px' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#3b0764' }}>Expense Breakdown</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={2} dataKey="value">
                    {pieData.map(entry => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#e9d5ff'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={v => fmt(v)} contentStyle={tooltipStyle} />
                  <Legend formatter={v => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center text-sm" style={{ color: '#c4b5fd' }}>No expenses logged this month</div>
            )}
          </div>

          <div style={{ ...cardStyle, padding: '20px' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#3b0764' }}>6-Month Overview</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={last6} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f0ff" />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={v => formatCurrency(v, currency)} />
                <Tooltip formatter={v => fmt(v)} contentStyle={tooltipStyle} />
                <Legend formatter={v => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{v}</span>} />
                <Bar dataKey="Expenses"    fill="#fca5a5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Savings"     fill="#86efac" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Investments" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {pieData.length > 0 && (
        <div style={{ ...cardStyle, padding: '20px' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#3b0764' }}>Top Spending Categories</h3>
          <div className="space-y-3">
            {[...pieData].sort((a, b) => b.value - a.value).slice(0, 6).map(({ name, value }) => (
              <div key={name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[name] || '#e9d5ff' }} />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm" style={{ color: '#6b7280' }}>{name}</span>
                    <span className="text-sm font-semibold" style={{ color: '#3b0764' }}>{fmt(value)}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f3f0ff' }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${(value / totalSpent) * 100}%`, background: CATEGORY_COLORS[name] || '#e9d5ff' }} />
                  </div>
                </div>
                <span className="text-xs w-9 text-right" style={{ color: '#c4b5fd' }}>{Math.round((value / totalSpent) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
