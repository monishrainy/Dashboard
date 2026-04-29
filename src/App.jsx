import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { BudgetProvider } from './context/BudgetContext'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import AddExpense from './components/AddExpense'
import History from './components/History'
import BudgetAdvice from './components/BudgetAdvice'
import Analytics from './components/Analytics'
import AuthScreen from './components/auth/AuthScreen'

const TABS = {
  dashboard: <Dashboard />,
  add:       <AddExpense />,
  analytics: <Analytics />,
  history:   <History />,
  advice:    <BudgetAdvice />,
}

function AppShell() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (!currentUser) return <AuthScreen />

  return (
    <BudgetProvider key={currentUser.id} userId={currentUser.id}>
      <div className="flex h-screen overflow-hidden" style={{ background: '#f5f3ff' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6">
          {TABS[activeTab]}
        </main>
      </div>
    </BudgetProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
