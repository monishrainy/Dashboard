import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts'
import { useBudget, CATEGORY_COLORS, EXPENSE_CATEGORY_GROUPS, formatCurrency } from '../context/BudgetContext'
import { TrendingUp, TrendingDown, Calendar, Tag } from 'lucide-react'

const tooltipStyle = {
  background: '#ffffff', border: '1px solid #ede9fe', borderRadius: '10px',
  color: '#4c1d95', fontSize: '13px', boxShadow: '0 4px 12px rgba(139,92,246,0.1)',
}

const cardStyle = {
  background: '#ffffff', borderRadius: '16px', border: '1px solid #ede9fe',
  padding: '20px', boxShadow: '0 1px 4px rgba(139,92,246,0.06)',
}

const GROUP_COLORS = [
  '#f9a8d4','#fed7aa','#fde68a','#bbf7d0','#a5f3fc',
  '#a5b4fc','#c4b5fd','#fbcfe8','#bae6fd','#d1fae5','#fef9c3','#e5e7eb',
]

function StatCard({ label, value, sub, icon: Icon, iconColor }) {
  return (
    <div style={cardStyle}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#9ca3af' }}>{label}</p>
          <p className="text-xl font-bold" style={{ color: '#3b0764' }}>{value}</p>
          {sub && <p className="text-xs mt-1" style={{ color: '#c4b5fd' }}>{sub}</p>}
        </div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: iconColor + '22', color: iconColor }}>
          <Icon size={17} />
        </div>
      </div>
    </div>
  )
}

export default function Analytics() {
  const { entries, incomeData, getMonthEntries, getCurrentMonth, currency } = useBudget()
  const fmt = (n) => formatCurrency(n, currency)

  const last6 = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    const m = d.toISOString().substring(0, 7)
    const mes = getMonthEntries(m)
    return {
      month:       new Date(m + '-02').toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
      Expenses:    mes.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0),
      Savings:     mes.filter(e => e.type === 'savings').reduce((s, e) => s + e.amount, 0),
      Investments: mes.filter(e => e.type === 'investment').reduce((s, e) => s + e.amount, 0),
      Income:      incomeData[m] || 0,
    }
  })

  const currentMonth    = getCurrentMonth()
  const currentEntries  = getMonthEntries(currentMonth)
  const currentExpenses = currentEntries.filter(e => e.type === 'expense')
  const totalThisMonth  = currentExpenses.reduce((s, e) => s + e.amount, 0)

  const dayOfMonth = new Date().getDate()
  const avgDaily   = dayOfMonth > 0 ? totalThisMonth / dayOfMonth : 0

  const nonZero       = last6.filter(m => m.Expenses > 0)
  const avgMonthlyExp = nonZero.length > 0 ? nonZero.reduce((s, m) => s + m.Expenses, 0) / nonZero.length : 0

  const thisMonthExp = last6[5]?.Expenses || 0
  const lastMonthExp = last6[4]?.Expenses || 0
  const momChange    = lastMonthExp > 0 ? ((thisMonthExp - lastMonthExp) / lastMonthExp) * 100 : 0

  const groupTotals = {}
  Object.keys(EXPENSE_CATEGORY_GROUPS).forEach(g => {
    const subs  = EXPENSE_CATEGORY_GROUPS[g]
    const total = currentExpenses.filter(e => subs.includes(e.subcategory)).reduce((s, e) => s + e.amount, 0)
    if (total > 0) groupTotals[g] = total
  })
  const groupData = Object.entries(groupTotals).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }))

  const dayNames  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const dayTotals = Array(7).fill(0)
  const dayCounts = Array(7).fill(0)
  entries.filter(e => e.type === 'expense').forEach(e => {
    const day = (new Date(e.date + 'T00:00:00').getDay() + 6) % 7
    dayTotals[day] += e.amount
    dayCounts[day]++
  })
  const dayData = dayNames.map((name, i) => ({
    name,
    'Avg Spend': dayCounts[i] > 0 ? Math.round((dayTotals[i] / dayCounts[i]) * 100) / 100 : 0,
  }))
  const maxDay = Math.max(...dayData.map(d => d['Avg Spend']))

  const subcatMap = {}
  currentExpenses.forEach(e => {
    subcatMap[e.subcategory] = (subcatMap[e.subcategory] || 0) + e.amount
  })
  const subcatData = Object.entries(subcatMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({ name, value }))

  const hasData = entries.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: '#3b0764' }}>Analytics</h2>
        <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Deep insights into your spending patterns</p>
      </div>

      {!hasData ? (
        <div className="text-center py-16" style={cardStyle}>
          <TrendingUp size={48} className="mx-auto mb-4" style={{ color: '#ddd6fe' }} />
          <h3 className="font-semibold text-lg mb-2" style={{ color: '#6d28d9' }}>No data yet</h3>
          <p className="text-sm" style={{ color: '#9ca3af' }}>Add some entries to unlock your spending analytics.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Avg Monthly Spend" value={fmt(avgMonthlyExp)}   sub="Last 6 months"                icon={TrendingDown}  iconColor="#f43f5e" />
            <StatCard label="Avg Daily Spend"   value={fmt(avgDaily)}        sub={`${dayOfMonth} days so far`} icon={Calendar}      iconColor="#f97316" />
            <StatCard
              label="vs Last Month"
              value={`${momChange >= 0 ? '+' : ''}${momChange.toFixed(1)}%`}
              sub={momChange >= 0 ? 'Spending up' : 'Spending down'}
              icon={momChange >= 0 ? TrendingUp : TrendingDown}
              iconColor={momChange >= 0 ? '#f43f5e' : '#10b981'}
            />
            <StatCard label="Top Category" value={groupData[0]?.name || '—'}
              sub={groupData[0] ? fmt(groupData[0].value) + ' this month' : 'No expenses yet'}
              icon={Tag} iconColor="#8b5cf6" />
          </div>

          <div style={cardStyle}>
            <h3 className="font-semibold mb-4" style={{ color: '#3b0764' }}>Spending Trend — Last 6 Months</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={last6} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#fca5a5" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#fca5a5" stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#86efac" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#86efac" stopOpacity={0}   />
                  </linearGradient>
                  <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#a5b4fc" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#a5b4fc" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f0ff" />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={v => fmt(v)} />
                <Tooltip formatter={v => fmt(v)} contentStyle={tooltipStyle} />
                <Legend formatter={v => <span style={{ color: '#9ca3af', fontSize: '12px' }}>{v}</span>} />
                <Area type="monotone" dataKey="Expenses"    stroke="#fca5a5" strokeWidth={2.5} fill="url(#expGrad)" dot={{ fill: '#fca5a5', r: 3 }} />
                <Area type="monotone" dataKey="Savings"     stroke="#86efac" strokeWidth={2.5} fill="url(#savGrad)" dot={{ fill: '#86efac', r: 3 }} />
                <Area type="monotone" dataKey="Investments" stroke="#a5b4fc" strokeWidth={2.5} fill="url(#invGrad)" dot={{ fill: '#a5b4fc', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div style={cardStyle}>
              <h3 className="font-semibold mb-4" style={{ color: '#3b0764' }}>Spending by Category — This Month</h3>
              {groupData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={groupData} layout="vertical" margin={{ top: 0, right: 20, left: 80, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f0ff" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={v => fmt(v)} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} width={80} />
                    <Tooltip formatter={v => fmt(v)} contentStyle={tooltipStyle} />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {groupData.map((entry, i) => (
                        <Cell key={entry.name} fill={GROUP_COLORS[i % GROUP_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-sm" style={{ color: '#c4b5fd' }}>No expenses this month</div>
              )}
            </div>

            <div style={cardStyle}>
              <h3 className="font-semibold mb-4" style={{ color: '#3b0764' }}>Avg Spend by Day of Week</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dayData} margin={{ top: 0, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f0ff" />
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} tickFormatter={v => fmt(v)} />
                  <Tooltip formatter={v => fmt(v)} contentStyle={tooltipStyle} />
                  <Bar dataKey="Avg Spend" radius={[6, 6, 0, 0]}>
                    {dayData.map((entry) => {
                      const ratio = maxDay > 0 ? entry['Avg Spend'] / maxDay : 0
                      return <Cell key={entry.name} fill={ratio > 0.7 ? '#c084fc' : ratio > 0.4 ? '#ddd6fe' : '#f3f0ff'} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {subcatData.length > 0 && (
            <div style={cardStyle}>
              <h3 className="font-semibold mb-4" style={{ color: '#3b0764' }}>Top Subcategories — This Month</h3>
              <div className="space-y-3">
                {subcatData.map(({ name, value }) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[name] || '#e9d5ff' }} />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm" style={{ color: '#6b7280' }}>{name}</span>
                        <span className="text-sm font-semibold" style={{ color: '#3b0764' }}>{fmt(value)}</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f3f0ff' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${(value / subcatData[0].value) * 100}%`, background: CATEGORY_COLORS[name] || '#e9d5ff' }} />
                      </div>
                    </div>
                    <span className="text-xs w-9 text-right" style={{ color: '#c4b5fd' }}>
                      {totalThisMonth > 0 ? Math.round((value / totalThisMonth) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
