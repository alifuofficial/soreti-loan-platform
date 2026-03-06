'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users, Plus, Search, Edit, Trash2, 
  Filter, Download, RefreshCw, Shield,
  Building2, Mail, Phone, Calendar,
  MoreHorizontal, CheckCircle, XCircle,
  UserCheck, UserX, Clock, Activity,
  LayoutGrid, List
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface User {
  id: string
  fullName: string
  email: string
  phone?: string
  role: string
  status: string
  bankId?: string
  bank?: { id: string; name: string; code: string }
  createdAt: string
  lastLogin?: string
}

interface Bank {
  id: string
  name: string
  code: string
  isActive: boolean
}

const roles = [
  { value: 'CUSTOMER', label: 'Customer', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'BANKER', label: 'Banker', color: 'bg-amber-100 text-amber-700' },
  { value: 'ADMIN', label: 'Admin', color: 'bg-violet-100 text-violet-700' },
  { value: 'SUPER_ADMIN', label: 'Super Admin', color: 'bg-rose-100 text-rose-700' },
  { value: 'CEO', label: 'CEO', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'GENERAL_MANAGER', label: 'General Manager', color: 'bg-teal-100 text-teal-700' },
  { value: 'FINANCE_MANAGER', label: 'Finance Manager', color: 'bg-orange-100 text-orange-700' },
  { value: 'MARKETING_MANAGER', label: 'Marketing Manager', color: 'bg-pink-100 text-pink-700' },
]

const statuses = [
  { value: 'ACTIVE', label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'INACTIVE', label: 'Inactive', color: 'bg-gray-100 text-gray-700' },
  { value: 'SUSPENDED', label: 'Suspended', color: 'bg-red-100 text-red-700' },
  { value: 'PENDING', label: 'Pending', color: 'bg-amber-100 text-amber-700' },
]

export function UsersManagement({ isLoading: externalLoading }: { isLoading?: boolean }) {
  const [users, setUsers] = useState<User[]>([])
  const [banks, setBanks] = useState<Bank[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    status: 'ACTIVE',
    bankId: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [usersRes, banksRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/banks')
      ])

      if (usersRes.ok) {
        const data = await usersRes.json()
        const usersArray = data.users || data || []
        setUsers(Array.isArray(usersArray) ? usersArray : [])
      }

      if (banksRes.ok) {
        const data = await banksRes.json()
        const banksArray = data.banks || data || []
        setBanks(Array.isArray(banksArray) ? banksArray.filter((b: Bank) => b.isActive) : [])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return
    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        fetchData()
        setEditingUser(null)
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      const response = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const handleUpdateStatus = async (user: User, newStatus: string) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status,
      bankId: user.bankId || ''
    })
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'ACTIVE').length,
    customers: users.filter(u => u.role === 'CUSTOMER').length,
    bankers: users.filter(u => u.role === 'BANKER').length
  }

  const getRoleColor = (role: string) => roles.find(r => r.value === role)?.color || 'bg-gray-100 text-gray-700'
  const getStatusColor = (status: string) => statuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700'
  const getRoleLabel = (role: string) => roles.find(r => r.value === role)?.label || role
  const getStatusLabel = (status: string) => statuses.find(s => s.value === status)?.label || status

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          </div>
          <p className="text-gray-500 mt-1 ml-10">Manage platform users and their roles</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData} className="border-gray-200">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="border-gray-200">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/20">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-emerald-50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/20">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-violet-50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg shadow-violet-500/20">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.customers}</p>
                <p className="text-xs text-gray-500">Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-amber-50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.bankers}</p>
                <p className="text-xs text-gray-500">Bankers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg shadow-gray-200/50">
        <CardContent className="pt-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[140px] border-gray-200 focus:border-emerald-500">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map(role => (
                    <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px] border-gray-200 focus:border-emerald-500">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1 ml-2">
                <Button variant="outline" size="icon" onClick={() => setViewMode('grid')} className={cn('border-gray-200', viewMode === 'grid' && 'bg-emerald-50 text-emerald-600 border-emerald-200')}>
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setViewMode('list')} className={cn('border-gray-200', viewMode === 'list' && 'bg-emerald-50 text-emerald-600 border-emerald-200')}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="pt-4">
                <div className="animate-pulse flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-3 w-48 bg-gray-200 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewMode === 'list' ? (
        <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Bank</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow">
                          <AvatarFallback className={cn(
                            'text-sm font-medium',
                            user.role === 'CUSTOMER' ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white' :
                            user.role === 'BANKER' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                            'bg-gradient-to-br from-violet-400 to-purple-500 text-white'
                          )}>
                            {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn('border-0', getRoleColor(user.role))}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn('border-0', getStatusColor(user.status))}>
                        {getStatusLabel(user.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{user.bank?.name || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          {user.status === 'ACTIVE' ? (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(user, 'SUSPENDED')}>
                              <UserX className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(user, 'ACTIVE')}>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <Users className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              onEdit={openEditDialog}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteUser}
              getRoleColor={getRoleColor}
              getStatusColor={getStatusColor}
              getRoleLabel={getRoleLabel}
              getStatusLabel={getStatusLabel}
            />
          ))}
          {filteredUsers.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
              <Users className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="sm:max-w-lg border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                <Edit className="h-4 w-4 text-white" />
              </div>
              Edit User
            </DialogTitle>
            <DialogDescription>
              Update user information and role
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fullName">Full Name</Label>
              <Input
                id="edit-fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                  <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {formData.role === 'BANKER' && (
              <div className="space-y-2">
                <Label htmlFor="edit-bank">Assigned Bank</Label>
                <Select value={formData.bankId} onValueChange={(v) => setFormData({ ...formData, bankId: v })}>
                  <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map(bank => (
                      <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)} className="border-gray-200">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateUser}
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

// User Card Component
function UserCard({ 
  user, 
  onEdit, 
  onUpdateStatus,
  onDelete,
  getRoleColor,
  getStatusColor,
  getRoleLabel,
  getStatusLabel
}: { 
  user: User
  onEdit: (user: User) => void
  onUpdateStatus: (user: User, status: string) => void
  onDelete: (id: string) => void
  getRoleColor: (role: string) => string
  getStatusColor: (status: string) => string
  getRoleLabel: (role: string) => string
  getStatusLabel: (status: string) => string
}) {
  return (
    <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden group hover:shadow-xl transition-all duration-300">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-white shadow">
              <AvatarFallback className={cn(
                'text-sm font-medium',
                user.role === 'CUSTOMER' ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white' :
                user.role === 'BANKER' ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                'bg-gradient-to-br from-violet-400 to-purple-500 text-white'
              )}>
                {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <Badge className={cn('border-0', getStatusColor(user.status))}>
            {getStatusLabel(user.status)}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <Badge className={cn('border-0', getRoleColor(user.role))}>
              {getRoleLabel(user.role)}
            </Badge>
            {user.bank && (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-0">
                {user.bank.name}
              </Badge>
            )}
          </div>
          {user.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-3.5 w-3.5 text-gray-400" />
              <span>{user.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
            onClick={() => onEdit(user)}
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          {user.status === 'ACTIVE' ? (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              onClick={() => onUpdateStatus(user, 'SUSPENDED')}
            >
              <UserX className="h-3.5 w-3.5 mr-1.5" />
              Suspend
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
              onClick={() => onUpdateStatus(user, 'ACTIVE')}
            >
              <UserCheck className="h-3.5 w-3.5 mr-1.5" />
              Activate
            </Button>
          )}
          <Button 
            variant="outline" 
            size="icon" 
            className="border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            onClick={() => onDelete(user.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
