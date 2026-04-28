import { useState } from 'react'
import { BudgetProvider } from './context/BudgetContext'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import AddExpense from './components/AddExpense'
import History from './components/History'
import BudgetAdvice from './components/BudgetAdvice'
import Analytics from './components/Analytics'

const TABS = {
  dashboard: <Dashboard />,
  add:       <AddExpense />,
  analytics: <Analytics />,
  history:   <History />,
  advice:    <BudgetAdvice />,
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <BudgetProvider>
      <div className="flex h-screen overflow-hidden" style={{ background: '#f5f3ff' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6">
          {TABS[activeTab]}
        </main>
      </div>
    </BudgetProvider>
  )
}
