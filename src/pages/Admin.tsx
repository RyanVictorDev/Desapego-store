import { useState } from 'react'
import AdminLayout from '../components/admin/AdminLayout'
import Dashboard from '../components/admin/Dashboard'
import ProductsAdmin from '../components/admin/ProductsAdmin'
import SettingsAdmin from '../components/admin/SettingsAdmin'

type AdminTab = 'dashboard' | 'products' | 'settings'

interface AdminProps {
  onToast: (message: string) => void
}

export default function Admin({ onToast }: AdminProps) {
  const [tab, setTab] = useState<AdminTab>('dashboard')

  return (
    <AdminLayout activeTab={tab} onTabChange={setTab}>
      {tab === 'dashboard' && <Dashboard onToast={onToast} />}
      {tab === 'products' && <ProductsAdmin onToast={onToast} />}
      {tab === 'settings' && <SettingsAdmin onToast={onToast} />}
    </AdminLayout>
  )
}
