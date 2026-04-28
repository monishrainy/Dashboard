import { LayoutDashboard, PlusCircle, History, Lightbulb, Wallet, BarChart2 } from 'lucide-react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'add',       label: 'Add Entry',    icon: PlusCircle },
  { id: 'analytics', label: 'Analytics',    icon: BarChart2 },
  { id: 'history',   label: 'History',      icon: History },
  { id: 'advice',    label: 'Budget Advice',icon: Lightbulb },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-60 flex flex-col h-full flex-shrink-0" style={{ background: '#ede9fe', borderRight: '1px solid #ddd6fe' }}>
      <div className="p-5" style={{ borderBottom: '1px solid #ddd6fe' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: '#8b5cf6' }}>
            <Wallet size={17} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm" style={{ color: '#3b0764' }}>BudgetIQ</h1>
            <p className="text-xs" style={{ color: '#a78bfa' }}>Track your finances</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={
              activeTab === id
                ? { background: '#8b5cf6', color: '#ffffff', boxShadow: '0 2px 8px rgba(139,92,246,0.3)' }
                : { color: '#7c3aed', background: 'transparent' }
            }
            onMouseEnter={e => { if (activeTab !== id) e.currentTarget.style.background = '#ddd6fe' }}
            onMouseLeave={e => { if (activeTab !== id) e.currentTarget.style.background = 'transparent' }}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      <div className="p-4" style={{ borderTop: '1px solid #ddd6fe' }}>
        <p className="text-xs text-center" style={{ color: '#c4b5fd' }}>Data stored locally in browser</p>
      </div>
    </div>
  )
}
