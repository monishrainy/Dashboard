import { useState } from 'react'
import { PlusCircle, Trash2, DollarSign, Pencil, X, Check, Globe } from 'lucide-react'
import {
  useBudget,
  EXPENSE_CATEGORY_GROUPS,
  SAVINGS_SUBCATEGORIES,
  INVESTMENT_SUBCATEGORIES,
  CATEGORY_COLORS,
  CURRENCIES,
  formatCurrency,
} from '../context/BudgetContext'

const todayStr = () => new Date().toISOString().split('T')[0]
const fmtMonth = (m) => new Date(m + '-02').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

const cardStyle  = { background: '#ffffff', borderRadius: '16px', border: '1px solid #ede9fe', padding: '20px', boxShadow: '0 1px 4px rgba(139,92,246,0.06)' }
const inputStyle = { width: '100%', background: '#faf5ff', border: '1px solid #ddd6fe', color: '#3b0764', borderRadius: '10px', padding: '10px 12px', fontSize: '14px', outline: 'none' }

const TYPE_SUBS = { savings: SAVINGS_SUBCATEGORIES, investment: INVESTMENT_SUBCATEGORIES }
const BADGE     = {
  expense:    { background: '#fce7f3', color: '#be185d' },
  savings:    { background: '#d1fae5', color: '#065f46' },
  investment: { background: '#ede9fe', color: '#6d28d9' },
}
const TYPE_BTN_ACTIVE = {
  expense:    { background: '#fca5a5', color: '#7f1d1d' },
  savings:    { background: '#86efac', color: '#14532d' },
  investment: { background: '#a5b4fc', color: '#1e1b4b' },
}

const DEFAULT_GROUP = Object.keys(EXPENSE_CATEGORY_GROUPS)[0]

function deriveGroup(subcategory) {
  return Object.entries(EXPENSE_CATEGORY_GROUPS).find(([, subs]) => subs.includes(subcategory))?.[0] || DEFAULT_GROUP
}

function EntryForm({ initial, onSubmit, onCancel, currency, submitLabel = 'Save' }) {
  const [type,          setType]          = useState(initial.type || 'expense')
  const [categoryGroup, setCategoryGroup] = useState(initial.categoryGroup || deriveGroup(initial.subcategory || ''))
  const [subcategory,   setSubcategory]   = useState(initial.subcategory || EXPENSE_CATEGORY_GROUPS[DEFAULT_GROUP][0])
  const [amount,        setAmount]        = useState(initial.amount?.toString() || '')
  const [date,          setDate]          = useState(initial.date || todayStr())
  const [description,   setDescription]  = useState(initial.description || '')

  const handleTypeChange = (t) => {
    setType(t)
    if (t === 'expense') {
      setCategoryGroup(DEFAULT_GROUP)
      setSubcategory(EXPENSE_CATEGORY_GROUPS[DEFAULT_GROUP][0])
    } else {
      setSubcategory(TYPE_SUBS[t][0])
    }
  }

  const handleGroupChange = (g) => {
    setCategoryGroup(g)
    setSubcategory(EXPENSE_CATEGORY_GROUPS[g][0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return
    onSubmit({
      type, subcategory,
      categoryGroup: type === 'expense' ? categoryGroup : undefined,
      amount: parseFloat(amount),
      date, description,
    })
  }

  const sym = CURRENCIES.find(c => c.code === currency)?.symbol || currency

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        {['expense', 'savings', 'investment'].map(t => (
          <button key={t} type="button" onClick={() => handleTypeChange(t)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all"
            style={type === t ? TYPE_BTN_ACTIVE[t] : { background: '#f3f0ff', color: '#7c3aed' }}>
            {t}
          </button>
        ))}
      </div>

      {type === 'expense' ? (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: '#a78bfa' }}>Category</label>
            <select value={categoryGroup} onChange={e => handleGroupChange(e.target.value)} style={inputStyle}>
              {Object.keys(EXPENSE_CATEGORY_GROUPS).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: '#a78bfa' }}>Subcategory</label>
            <select value={subcategory} onChange={e => setSubcategory(e.target.value)} style={inputStyle}>
              {EXPENSE_CATEGORY_GROUPS[categoryGroup].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      ) : (
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: '#a78bfa' }}>Category</label>
          <select value={subcategory} onChange={e => setSubcategory(e.target.value)} style={inputStyle}>
            {TYPE_SUBS[type].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: '#a78bfa' }}>Amount ({sym})</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#a78bfa' }}>{sym}</span>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0.00" min="0.01" step="0.01" required
              style={{ ...inputStyle, paddingLeft: sym.length > 1 ? '36px' : '28px' }} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: '#a78bfa' }}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={inputStyle} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide mb-1.5" style={{ color: '#a78bfa' }}>Description (optional)</label>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)}
          placeholder="e.g. Monthly rent payment" style={inputStyle} />
      </div>

      <div className="flex gap-3">
        <button type="submit"
          className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
          style={{ background: '#8b5cf6', color: '#fff', boxShadow: '0 2px 12px rgba(139,92,246,0.3)' }}>
          <Check size={15} /> {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ background: '#f3f0ff', color: '#7c3aed' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default function AddExpense() {
  const { addEntry, updateEntry, deleteEntry, entries, incomeData, setMonthlyIncome, getCurrentMonth, currency, setCurrency } = useBudget()
  const currentMonth = getCurrentMonth()
  const fmt = (n) => formatCurrency(n, currency)

  const [incomeInput, setIncomeInput] = useState(incomeData[currentMonth]?.toString() || '')
  const [incomeSaved, setIncomeSaved] = useState(false)
  const [editingId,   setEditingId]   = useState(null)

  const handleSaveIncome = () => {
    setMonthlyIncome(currentMonth, incomeInput)
    setIncomeSaved(true)
    setTimeout(() => setIncomeSaved(false), 2000)
  }

  const handleAdd = (fields) => addEntry(fields)

  const handleEditSave = (fields) => {
    updateEntry(editingId, fields)
    setEditingId(null)
  }

  // Group all entries by month, sorted newest first
  const grouped = {}
  entries.forEach(e => {
    if (!grouped[e.month]) grouped[e.month] = []
    grouped[e.month].push(e)
  })
  const sortedMonths = Object.keys(grouped).sort().reverse()

  const sym = CURRENCIES.find(c => c.code === currency)?.symbol || currency

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#3b0764' }}>Add Entry</h2>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Log expenses, savings, and investments</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#fff', border: '1px solid #ede9fe' }}>
          <Globe size={14} style={{ color: '#8b5cf6' }} />
          <select value={currency} onChange={e => setCurrency(e.target.value)}
            className="text-sm focus:outline-none" style={{ background: 'transparent', color: '#4c1d95', border: 'none' }}>
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.symbol} {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Left: income + form */}
        <div className="space-y-5">
          <div style={cardStyle}>
            <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: '#3b0764' }}>
              <DollarSign size={16} style={{ color: '#8b5cf6' }} />
              Monthly Income — {fmtMonth(currentMonth)}
            </h3>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#a78bfa' }}>{sym}</span>
                <input type="number" value={incomeInput} onChange={e => setIncomeInput(e.target.value)}
                  placeholder="0.00"
                  style={{ ...inputStyle, paddingLeft: sym.length > 1 ? '36px' : '28px' }} />
              </div>
              <button onClick={handleSaveIncome}
                className="px-5 rounded-xl text-sm font-medium transition-all"
                style={{ background: '#8b5cf6', color: '#fff', boxShadow: '0 2px 8px rgba(139,92,246,0.25)' }}>
                {incomeSaved ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>

          <div style={cardStyle}>
            <h3 className="font-semibold mb-4" style={{ color: '#3b0764' }}>New Entry</h3>
            <EntryForm
              key="add-form"
              initial={{}}
              onSubmit={handleAdd}
              currency={currency}
              submitLabel="Add Entry"
            />
          </div>
        </div>

        {/* Right: entries grouped by month */}
        <div className="space-y-4">
          {sortedMonths.length === 0 ? (
            <div className="text-center py-16" style={cardStyle}>
              <PlusCircle size={40} className="mx-auto mb-3" style={{ color: '#ddd6fe' }} />
              <p className="text-sm" style={{ color: '#c4b5fd' }}>No entries yet — add one on the left!</p>
            </div>
          ) : sortedMonths.map(month => (
            <div key={month} style={cardStyle}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm" style={{ color: '#3b0764' }}>{fmtMonth(month)}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                  {grouped[month].length} {grouped[month].length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              <div className="space-y-2">
                {[...grouped[month]].sort((a, b) => new Date(b.date) - new Date(a.date)).map(entry => (
                  <div key={entry.id}>
                    {editingId === entry.id ? (
                      <div className="p-3 rounded-xl" style={{ background: '#f3f0ff', border: '1px solid #ddd6fe' }}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#7c3aed' }}>Editing entry</span>
                          <button onClick={() => setEditingId(null)} style={{ color: '#c4b5fd' }}>
                            <X size={14} />
                          </button>
                        </div>
                        <EntryForm
                          key={`edit-${entry.id}`}
                          initial={entry}
                          onSubmit={handleEditSave}
                          onCancel={() => setEditingId(null)}
                          currency={currency}
                          submitLabel="Save Changes"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl transition-all"
                        style={{ background: '#faf5ff' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f3f0ff'}
                        onMouseLeave={e => e.currentTarget.style.background = '#faf5ff'}>
                        <div className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ background: CATEGORY_COLORS[entry.subcategory] || '#e9d5ff' }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm truncate" style={{ color: '#4c1d95' }}>{entry.subcategory}</span>
                            {entry.categoryGroup && (
                              <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: '#ede9fe', color: '#7c3aed' }}>{entry.categoryGroup}</span>
                            )}
                            <span className="text-xs px-1.5 py-0.5 rounded-md capitalize" style={BADGE[entry.type]}>{entry.type}</span>
                          </div>
                          {entry.description && <p className="text-xs mt-0.5 truncate" style={{ color: '#9ca3af' }}>{entry.description}</p>}
                          <p className="text-xs mt-0.5" style={{ color: '#c4b5fd' }}>
                            {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <p className="text-sm font-semibold flex-shrink-0" style={{ color: '#3b0764' }}>{fmt(entry.amount)}</p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => setEditingId(entry.id)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#c4b5fd' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#8b5cf6'}
                            onMouseLeave={e => e.currentTarget.style.color = '#c4b5fd'}>
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => deleteEntry(entry.id)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: '#c4b5fd' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#f43f5e'}
                            onMouseLeave={e => e.currentTarget.style.color = '#c4b5fd'}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
