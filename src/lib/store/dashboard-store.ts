import { create } from 'zustand'

export type ViewType = 'dashboard' | 'apply' | 'loan' | 'profile' | 'loans'

interface DashboardState {
  currentView: ViewType
  selectedLoanId: string | null
  sidebarOpen: boolean
  setView: (view: ViewType) => void
  setSelectedLoanId: (id: string | null) => void
  setSidebarOpen: (open: boolean) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  currentView: 'dashboard',
  selectedLoanId: null,
  sidebarOpen: false,
  setView: (view) => set({ currentView: view, selectedLoanId: view === 'loan' ? null : undefined }),
  setSelectedLoanId: (id) => set({ selectedLoanId: id, currentView: id ? 'loan' : 'loans' }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
