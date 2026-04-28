import { useBudget, EXPENSE_CATEGORY_GROUPS, GROUP_IDEALS, NEEDS, WANTS, formatCurrency } from '../context/BudgetContext'
import { Lightbulb, CheckCircle, AlertCircle, XCircle, TrendingUp } from 'lucide-react'

const pct      = (n, t) => t > 0 ? Math.round((n / t) * 100) : 0
const fmtMonth = (m) => new Date(m + '-02').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

const cardStyle = { background: '#ffffff', borderRadius: '16px', border: '1px solid #ede9fe', padding: '20px', boxShadow: '0 1px 4px rgba(139,92,246,0.06)' }

function StatusIcon({ status }) {
  if (status === 'good') return <CheckCircle size={15} style={{ color: '#10b981', flexShrink: 0 }} />
  if (status === 'warn') return <AlertCircle size={15} style={{ color: '#f59e0b', flexShrink: 0 }} />
  return <XCircle size={15} style={{ color: '#f43f5e', flexShrink: 0 }} />
}

function AdviceRow({ group, actual, idealRatio, income, fmt }) {
  const idealAmt = income * idealRatio
  const ratio    = idealRatio > 0 && income > 0 ? actual / idealAmt : 0
  const status   = actual === 0 ? 'good' : ratio <= 1.0 ? 'good' : ratio <= 1.2 ? 'warn' : 'bad'
  const barWidth = income > 0 ? Math.min(100, (actual / (idealAmt * 1.5 || 1)) * 100) : 0
  const barColor = status === 'good' ? '#86efac' : status === 'warn' ? '#fde68a' : '#fca5a5'

  const advice = actual === 0
    ? `No ${group.toLowerCase()} expenses logged this month.`
    : ratio <= 1.0
    ? `${group} at ${pct(actual, income)}% of income — within the ${Math.round(idealRatio * 100)}% guideline.`
    : ratio <= 1.2
    ? `${group} slightly over at ${pct(actual, income)}% — guideline is ${Math.round(idealRatio * 100)}%.`
    : `${group} over budget at ${pct(actual, income)}% — aim for ${Math.round(idealRatio * 100)}% or less.`

  return (
    <div className="p-4 rounded-xl space-y-2" style={{ background: '#faf5ff' }}>
      <div className="flex items-center gap-2">
        <StatusIcon status={status} />
        <span className="text-sm font-medium flex-1" style={{ color: '#4c1d95' }}>{group}</span>
        <span className="text-sm font-semibold" style={{ color: '#3b0764' }}>{fmt(actual)}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#ede9fe' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${barWidth}%`, background: barColor }} />
        </div>
        <span className="text-xs flex-shrink-0" style={{ color: '#a78bfa', minWidth: '130px', textAlign: 'right' }}>
          {pct(actual, income)}% / ideal ≤{Math.round(idealRatio * 100)}%
        </span>
      </div>
      <p className="text-xs" style={{ color: '#9ca3af' }}>{advice}</p>
    </div>
  )
}

export default function BudgetAdvice() {
  const { getMonthEntries, incomeData, getCurrentMonth, currency } = useBudget()
  const fmt = (n) => formatCurrency(n, currency)

  const currentMonth = getCurrentMonth()
  const income       = incomeData[currentMonth] || 0
  const entries      = getMonthEntries(currentMonth)

  const groupTotal = (group) => {
    const subs = EXPENSE_CATEGORY_GROUPS[group] || []
    return entries.filter(e => subs.includes(e.subcategory)).reduce((s, e) => s + e.amount, 0)
  }

  const totalNeeds  = entries.filter(e => NEEDS.includes(e.subcategory)).reduce((s, e) => s + e.amount, 0)
  const totalWants  = entries.filter(e => WANTS.includes(e.subcategory)).reduce((s, e) => s + e.amount, 0)
  const totalSaved  = entries.filter(e => e.type === 'savings').reduce((s, e) => s + e.amount, 0)
  const totalInvest = entries.filter(e => e.type === 'investment').reduce((s, e) => s + e.amount, 0)
  const totalSI     = totalSaved + totalInvest

  const ruleStatus = (actual, target) => {
    if (income === 0) return 'warn'
    const r = actual / (income * target)
    return r <= 1.0 ? 'good' : r <= 1.15 ? 'warn' : 'bad'
  }

  const rules = [
    { label: 'Needs (50%)',         actual: totalNeeds, target: 0.50, idealAmt: income * 0.50 },
    { label: 'Wants (30%)',         actual: totalWants, target: 0.30, idealAmt: income * 0.30 },
    { label: 'Save & Invest (20%)', actual: totalSI,    target: 0.20, idealAmt: income * 0.20 },
  ]

  const tips = [
    { icon: '💡', tip: 'Follow the 50/30/20 rule: 50% needs, 30% wants, 20% savings and investments.' },
    { icon: '🏦', tip: 'Build an emergency fund of 3–6 months of expenses before investing aggressively.' },
    { icon: '📈', tip: 'Low-cost index funds (e.g. S&P 500 ETFs) are ideal for long-term wealth building.' },
    { icon: '🔄', tip: 'Automate savings — transfer to savings on the day you get paid.' },
    { icon: '📊', tip: 'Review your budget monthly and identify categories that consistently go over.' },
    { icon: '🍽️', tip: 'Meal prepping can cut grocery and dining costs by up to 30%.' },
    { icon: '📱', tip: 'Audit your subscriptions quarterly — cancel anything unused or redundant.' },
    { icon: '🚗', tip: 'If transport exceeds 10% of income, consider public transit, cycling, or carpooling.' },
  ]

  if (!income) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#3b0764' }}>Budget Advice</h2>
          <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Smart recommendations based on your spending</p>
        </div>
        <div className="text-center py-16" style={cardStyle}>
          <Lightbulb size={48} className="mx-auto mb-4" style={{ color: '#ddd6fe' }} />
          <h3 className="font-semibold text-lg mb-2" style={{ color: '#6d28d9' }}>Set your monthly income first</h3>
          <p className="text-sm" style={{ color: '#9ca3af' }}>Go to "Add Entry" and enter your income to unlock personalised advice.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: '#3b0764' }}>Budget Advice</h2>
        <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>50/30/20 analysis for {fmtMonth(currentMonth)}</p>
      </div>

      <div style={cardStyle}>
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={17} style={{ color: '#8b5cf6' }} />
          <h3 className="font-semibold" style={{ color: '#3b0764' }}>Monthly Income: {fmt(income)}</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {rules.map(({ label, actual, target, idealAmt }) => {
            const st  = ruleStatus(actual, target)
            const bg  = st === 'good' ? '#d1fae5' : st === 'warn' ? '#fef9c3' : '#fce7f3'
            const clr = st === 'good' ? '#065f46' : st === 'warn' ? '#92400e' : '#9f1239'
            const bdr = st === 'good' ? '#a7f3d0' : st === 'warn' ? '#fde68a' : '#fbcfe8'
            return (
              <div key={label} className="p-4 rounded-xl" style={{ background: bg, border: `1px solid ${bdr}` }}>
                <p className="text-xs mb-1" style={{ color: '#9ca3af' }}>{label}</p>
                <p className="text-2xl font-bold" style={{ color: clr }}>{pct(actual, income)}%</p>
                <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{fmt(actual)} of {fmt(idealAmt)} ideal</p>
              </div>
            )
          })}
        </div>
      </div>

      <div style={cardStyle}>
        <h3 className="font-semibold mb-4" style={{ color: '#3b0764' }}>Category Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(GROUP_IDEALS).map(([group, ideal]) => (
            <AdviceRow key={group} group={group} actual={groupTotal(group)} idealRatio={ideal} income={income} fmt={fmt} />
          ))}
          <AdviceRow group="Savings"     actual={totalSaved}  idealRatio={0.15} income={income} fmt={fmt} />
          <AdviceRow group="Investments" actual={totalInvest} idealRatio={0.10} income={income} fmt={fmt} />
        </div>
      </div>

      <div style={cardStyle}>
        <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#3b0764' }}>
          <Lightbulb size={16} style={{ color: '#f59e0b' }} />
          General Tips
        </h3>
        <div className="space-y-2">
          {tips.map(({ icon, tip }) => (
            <div key={tip} className="flex gap-3 p-3 rounded-xl" style={{ background: '#faf5ff' }}>
              <span className="flex-shrink-0 text-base">{icon}</span>
              <p className="text-sm" style={{ color: '#6b7280' }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
