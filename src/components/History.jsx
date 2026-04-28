import { useState } from 'react'
import { Trash2, Calendar } from 'lucide-react'
import { useBudget, CATEGORY_COLORS, formatCurrency } from '../context/BudgetContext'

const fmtMonth = (m) => new Date(m + '-02').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
const fmtDate  = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

const cardStyle = { background: '#ffffff', borderRadius: '16px', border: '1px solid #ede9fe', padding: '20px', boxShadow: '0 1px 4px rgba(139,92,246,0.06)' }

const BADGE = {
  expense:    { background: '#fce7f3', color: '#be185d' },
  savings:    { background: '#d1fae5', color: '#065f46' },
  investment: { background: '#ede9fe', color: '#6d28d9' },
}

export default function History() {
  const { getAllMonths, getMonthEntries, incomeData, deleteEntry, getCurrentMonth, currency } = useBudget()
  const fmt      = (n) => formatCurrency(n, currency)
  const allMonths = getAllMonths()
  const fallback  = getCurrentMonth()
  const monthList = allMonths.length > 0 ? allMonths : [fallback]

  const [selectedMonth, setSelectedMonth] = useState(monthList[0])

  const entries    = getMonthEntries(selectedMonth)
  const income     = incomeData[selectedMonth] || 0
  const totalSpent = entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0)
  const totalSaved = entries.filter(e => e.type === 'savings').reduce((s, e) => s + e.amount, 0)
  const totalInv   = entries.filter(e => e.type === 'investment').reduce((s, e) => s + e.amount, 0)

  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#3b0764' }}>History</h2>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Browse and manage past months</p>
        </div>
        <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
          className="rounded-xl px-3 py-2 text-sm focus:outline-none"
          style={{ background: '#fff', border: '1px solid #ddd6fe', color: '#6d28d9' }}>
          {monthList.map(m => <option key={m} value={m}>{fmtMonth(m)}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Income',      value: income,     color: '#8b5cf6' },
          { label: 'Expenses',    value: totalSpent, color: '#f43f5e' },
          { label: 'Savings',     value: totalSaved, color: '#10b981' },
          { label: 'Investments', value: totalInv,   color: '#6366f1' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ ...cardStyle, padding: '16px' }}>
            <p className="text-xs uppercase tracking-wide mb-1" style={{ color: '#9ca3af' }}>{label}</p>
            <p className="text-xl font-bold" style={{ color }}>{fmt(value)}</p>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: '#3b0764' }}>
            {fmtMonth(selectedMonth)} — {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </h3>
          <Calendar size={16} style={{ color: '#c4b5fd' }} />
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-14">
            <Calendar size={40} className="mx-auto mb-3" style={{ color: '#ddd6fe' }} />
            <p className="text-sm" style={{ color: '#c4b5fd' }}>No entries for this month</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map(entry => (
              <div key={entry.id}
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                style={{ background: '#faf5ff' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f3f0ff'}
                onMouseLeave={e => e.currentTarget.style.background = '#faf5ff'}>
                <div className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: CATEGORY_COLORS[entry.subcategory] || '#e9d5ff' }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm" style={{ color: '#4c1d95' }}>{entry.subcategory}</span>
                    {entry.categoryGroup && (
                      <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: '#ede9fe', color: '#7c3aed' }}>{entry.categoryGroup}</span>
                    )}
                    <span className="text-xs px-1.5 py-0.5 rounded-md capitalize" style={BADGE[entry.type]}>{entry.type}</span>
                  </div>
                  {entry.description && <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{entry.description}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold" style={{ color: '#3b0764' }}>{fmt(entry.amount)}</p>
                  <p className="text-xs" style={{ color: '#c4b5fd' }}>{fmtDate(entry.date)}</p>
                </div>
                <button onClick={() => deleteEntry(entry.id)}
                  className="ml-1 flex-shrink-0 transition-colors" style={{ color: '#ddd6fe' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f43f5e'}
                  onMouseLeave={e => e.currentTarget.style.color = '#ddd6fe'}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
