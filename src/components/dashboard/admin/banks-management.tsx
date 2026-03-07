'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Building2, Plus, Search, MoreHorizontal, Edit, Trash2, 
  Eye, Filter, Download, RefreshCw, MapPin, Phone, Mail,
  Globe, Users, FileText, Shield, CheckCircle, XCircle,
  ArrowUpRight, AlertCircle, Sparkles, LayoutGrid, List
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Bank {
  id: string
  name: string
  code: string
  email: string
  phone: string
  address: string
  isActive: boolean
  createdAt: string
  _count?: {
    users: number
    loans: number
    products: number
  }
}

export function BanksManagement() {
  const [banks, setBanks] = useState<Bank[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingBank, setEditingBank] = useState<Bank | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    address: '',
    isActive: true
  })

  useEffect(() => {
    fetchBanks()
  }, [])

  const fetchBanks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/banks')
      if (response.ok) {
        const data = await response.json()
        const banksArray = data.banks || data || []
        setBanks(Array.isArray(banksArray) ? banksArray : [])
      }
    } catch (error) {
      console.error('Failed to fetch banks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBank = async () => {
    try {
      const response = await fetch('/api/banks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        fetchBanks()
        setShowAddDialog(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to add bank:', error)
    }
  }

  const handleUpdateBank = async () => {
    if (!editingBank) return
    try {
      const response = await fetch(`/api/banks/${editingBank.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        fetchBanks()
        setEditingBank(null)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to update bank:', error)
    }
  }

  const handleToggleStatus = async (bank: Bank) => {
    try {
      const response = await fetch(`/api/banks/${bank.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !bank.isActive })
      })
      if (response.ok) {
        fetchBanks()
      }
    } catch (error) {
      console.error('Failed to toggle bank status:', error)
    }
  }

  const handleDeleteBank = async (bankId: string) => {
    if (!confirm('Are you sure you want to delete this bank?')) return
    try {
      const response = await fetch(`/api/banks/${bankId}`, { method: 'DELETE' })
      if (response.ok) {
        fetchBanks()
      }
    } catch (error) {
      console.error('Failed to delete bank:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      email: '',
      phone: '',
      address: '',
      isActive: true
    })
  }

  const openEditDialog = (bank: Bank) => {
    setEditingBank(bank)
    setFormData({
      name: bank.name,
      code: bank.code,
      email: bank.email || '',
      phone: bank.phone || '',
      address: bank.address || '',
      isActive: bank.isActive
    })
  }

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: banks.length,
    active: banks.filter(b => b.isActive).length,
    inactive: banks.filter(b => !b.isActive).length,
    totalUsers: banks.reduce((sum, b) => sum + (b._count?.users || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Partner Banks</h1>
          </div>
          <p className="text-gray-500 mt-1 ml-10">Manage your banking partners and institutions</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setShowAddDialog(true); }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Bank
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg shadow-violet-500/20">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Banks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-emerald-50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-red-50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-400 to-rose-500 shadow-lg shadow-red-500/20">
                <XCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                <p className="text-xs text-gray-500">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-amber-50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search banks by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={cn('border-gray-200', viewMode === 'grid' && 'bg-emerald-50 text-emerald-600 border-emerald-200')}>
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setViewMode('list')} className={cn('border-gray-200', viewMode === 'list' && 'bg-emerald-50 text-emerald-600 border-emerald-200')}>
                <List className="h-4 w-4" />
              </Button>
              <div className="w-px h-8 bg-gray-200 mx-1" />
              <Button variant="outline" onClick={fetchBanks} className="border-gray-200">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" className="border-gray-200">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banks Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-200" />
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-48 bg-gray-200 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBanks.map((bank) => (
            <BankCard 
              key={bank.id} 
              bank={bank} 
              onEdit={openEditDialog} 
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteBank}
            />
          ))}
          {filteredBanks.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
              <Building2 className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium">No banks found</p>
              <p className="text-sm">Try adjusting your search or add a new bank</p>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Bank</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Users</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Loans</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBanks.map((bank) => (
                  <tr key={bank.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold text-sm">
                          {bank.code.substring(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{bank.name}</p>
                          <p className="text-xs text-gray-500">{bank.code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{bank.email || '-'}</p>
                      <p className="text-xs text-gray-400">{bank.phone || '-'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn(
                        'border-0',
                        bank.isActive 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      )}>
                        {bank.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{bank._count?.users || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{bank._count?.loans || 0}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => openEditDialog(bank)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(bank)}>
                            {bank.isActive ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteBank(bank.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Bank Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-lg border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500">
                <Plus className="h-4 w-4 text-white" />
              </div>
              Add New Bank
            </DialogTitle>
            <DialogDescription>
              Add a new partner bank to the platform
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Bank Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Commercial Bank"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Bank Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., CBE"
                  maxLength={5}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="bank@example.com"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+251 9XX XXX XXX"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address"
                rows={2}
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Active Status</p>
                  <p className="text-xs text-gray-500">Bank will be available for transactions</p>
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="border-gray-200">
              Cancel
            </Button>
            <Button 
              onClick={handleAddBank}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              Add Bank
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Bank Dialog */}
      <Dialog open={!!editingBank} onOpenChange={() => setEditingBank(null)}>
        <DialogContent className="sm:max-w-lg border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                <Edit className="h-4 w-4 text-white" />
              </div>
              Edit Bank
            </DialogTitle>
            <DialogDescription>
              Update bank information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Bank Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-code">Bank Code *</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  maxLength={5}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Active Status</p>
                  <p className="text-xs text-gray-500">Bank will be available for transactions</p>
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBank(null)} className="border-gray-200">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateBank}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Bank Card Component
function BankCard({ 
  bank, 
  onEdit, 
  onToggleStatus, 
  onDelete 
}: { 
  bank: Bank
  onEdit: (bank: Bank) => void
  onToggleStatus: (bank: Bank) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card className={cn(
      'border-0 shadow-lg shadow-gray-200/50 overflow-hidden group hover:shadow-xl transition-all duration-300',
      !bank.isActive && 'opacity-60'
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/20">
              {bank.code.substring(0, 2)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{bank.name}</h3>
              <p className="text-xs text-gray-500">{bank.code}</p>
            </div>
          </div>
          <Badge className={cn(
            'border-0',
            bank.isActive 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-red-100 text-red-700'
          )}>
            {bank.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          {bank.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-3.5 w-3.5 text-gray-400" />
              <span className="truncate">{bank.email}</span>
            </div>
          )}
          {bank.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-3.5 w-3.5 text-gray-400" />
              <span>{bank.phone}</span>
            </div>
          )}
          {bank.address && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="h-3.5 w-3.5 text-gray-400 mt-0.5" />
              <span className="line-clamp-2">{bank.address}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-gray-50 mb-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{bank._count?.users || 0}</p>
            <p className="text-[10px] text-gray-500 uppercase">Users</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <p className="text-lg font-bold text-gray-900">{bank._count?.loans || 0}</p>
            <p className="text-[10px] text-gray-500 uppercase">Loans</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{bank._count?.products || 0}</p>
            <p className="text-[10px] text-gray-500 uppercase">Products</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
            onClick={() => onEdit(bank)}
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-gray-200"
            onClick={() => onToggleStatus(bank)}
          >
            {bank.isActive ? (
              <>
                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                Disable
              </>
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Enable
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            onClick={() => onDelete(bank.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
