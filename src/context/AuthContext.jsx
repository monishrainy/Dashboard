import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const USERS_KEY   = 'budgetiq_users'
const SESSION_KEY = 'budgetiq_session'

const loadUsers   = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] } }
const loadSession = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null } catch { return null } }

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(loadSession)

  const register = (name, email, password) => {
    const users = loadUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
      return { error: 'An account with this email already exists.' }
    const user = { id: Date.now().toString() + Math.random().toString(36).slice(2), name: name.trim(), email: email.trim().toLowerCase(), password }
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
    const session = { id: user.id, name: user.name, email: user.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setCurrentUser(session)
    return { success: true }
  }

  const login = (email, password) => {
    const users = loadUsers()
    const user  = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password)
    if (!user) return { error: 'Incorrect email or password.' }
    const session = { id: user.id, name: user.name, email: user.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setCurrentUser(session)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setCurrentUser(null)
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
