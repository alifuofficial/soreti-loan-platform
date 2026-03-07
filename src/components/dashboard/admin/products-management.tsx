'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Package, Plus, Search, Edit, Trash2, 
  Filter, Download, RefreshCw, DollarSign,
  Percent, Calendar, Building2, Sparkles,
  LayoutGrid, List, Tag, TrendingUp, Eye,
  MoreHorizontal, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Product {
  id: string
  name: string
  description: string
  category: string
  bankId: string
  bank?: { id: string; name: string; code: string }
  minAmount: number
  maxAmount: number
  interestRate: number
  minTerm: number
  maxTerm: number
  isActive: boolean
  createdAt: string
  _count?: {
    loans: number
  }
}

interface Bank {
  id: string
  name: string
  code: string
  isActive: boolean
}

const categories = [
  'Electronics',
  'Vehicles',
  'Real Estate',
  'Home Appliances',
  'Business Equipment',
  'Medical Equipment',
  'Education',
  'Personal',
  'Agriculture',
  'Other'
]

export function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [banks, setBanks] = useState<Bank[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterBank, setFilterBank] = useState('all')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    bankId: '',
    minAmount: '',
    maxAmount: '',
    interestRate: '',
    minTerm: '',
    maxTerm: '',
    isActive: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [productsRes, banksRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/banks')
      ])

      if (productsRes.ok) {
        const data = await productsRes.json()
        const productsArray = data.products || data || []
        setProducts(Array.isArray(productsArray) ? productsArray : [])
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

  const handleAddProduct = async () => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          minAmount: parseFloat(formData.minAmount) || 0,
          maxAmount: parseFloat(formData.maxAmount) || 0,
          interestRate: parseFloat(formData.interestRate) || 0,
          minTerm: parseInt(formData.minTerm) || 1,
          maxTerm: parseInt(formData.maxTerm) || 12
        })
      })
      if (response.ok) {
        fetchData()
        setShowAddDialog(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to add product:', error)
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct) return
    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          minAmount: parseFloat(formData.minAmount) || 0,
          maxAmount: parseFloat(formData.maxAmount) || 0,
          interestRate: parseFloat(formData.interestRate) || 0,
          minTerm: parseInt(formData.minTerm) || 1,
          maxTerm: parseInt(formData.maxTerm) || 12
        })
      })
      if (response.ok) {
        fetchData()
        setEditingProduct(null)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  const handleToggleStatus = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !product.isActive })
      })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to toggle product status:', error)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const response = await fetch(`/api/products/${productId}`, { method: 'DELETE' })
      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      bankId: '',
      minAmount: '',
      maxAmount: '',
      interestRate: '',
      minTerm: '',
      maxTerm: '',
      isActive: true
    })
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category,
      bankId: product.bankId,
      minAmount: product.minAmount.toString(),
      maxAmount: product.maxAmount.toString(),
      interestRate: product.interestRate.toString(),
      minTerm: product.minTerm.toString(),
      maxTerm: product.maxTerm.toString(),
      isActive: product.isActive
    })
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    const matchesBank = filterBank === 'all' || product.bankId === filterBank
    return matchesSearch && matchesCategory && matchesBank
  })

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    categories: [...new Set(products.map(p => p.category))].length,
    avgInterest: products.length > 0 
      ? (products.reduce((sum, p) => sum + p.interestRate, 0) / products.length).toFixed(1)
      : '0'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-purple-500">
              <Package className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Loan Products</h1>
          </div>
          <p className="text-gray-500 mt-1 ml-10">Manage loan products offered by partner banks</p>
        </div>
        <Button 
          onClick={() => { resetForm(); setShowAddDialog(true); }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/25"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-gray-50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 shadow-lg shadow-violet-500/20">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Products</p>
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
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-amber-50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
                <p className="text-xs text-gray-500">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-gray-200/50 bg-gradient-to-br from-white to-cyan-50">
          <CardContent className="pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/20">
                <Percent className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.avgInterest}%</p>
                <p className="text-xs text-gray-500">Avg. Rate</p>
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
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[150px] border-gray-200 focus:border-emerald-500">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterBank} onValueChange={setFilterBank}>
                <SelectTrigger className="w-[150px] border-gray-200 focus:border-emerald-500">
                  <Building2 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banks</SelectItem>
                  {banks.map(bank => (
                    <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
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
              <div className="w-px h-8 bg-gray-200 mx-1 hidden sm:block" />
              <Button variant="outline" onClick={fetchData} className="border-gray-200 hidden sm:inline-flex">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-6 w-40 bg-gray-200 rounded" />
                  <div className="h-4 w-full bg-gray-200 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onEdit={openEditDialog} 
              onToggleStatus={handleToggleStatus}
              onDelete={handleDeleteProduct}
              formatCurrency={formatCurrency}
            />
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
              <Package className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try adjusting your filters or add a new product</p>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Bank</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount Range</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Rate</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Term</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold">
                          {product.bank?.code?.substring(0, 2) || 'NA'}
                        </div>
                        <span className="text-sm text-gray-600">{product.bank?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="bg-violet-100 text-violet-700 border-0">
                        {product.interestRate}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{product.minTerm}-{product.maxTerm} months</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={cn(
                        'border-0',
                        product.isActive 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      )}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => openEditDialog(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(product)}>
                            {product.isActive ? (
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
                          <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-red-600">
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

      {/* Add Product Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-2xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500">
                <Plus className="h-4 w-4 text-white" />
              </div>
              Add New Product
            </DialogTitle>
            <DialogDescription>
              Create a new loan product for a partner bank
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Personal Loan"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description..."
                rows={2}
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank">Partner Bank *</Label>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAmount">Minimum Amount (ETB) *</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                  placeholder="10000"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAmount">Maximum Amount (ETB) *</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={formData.maxAmount}
                  onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                  placeholder="1000000"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%) *</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  placeholder="12.5"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minTerm">Min Term (months) *</Label>
                <Input
                  id="minTerm"
                  type="number"
                  value={formData.minTerm}
                  onChange={(e) => setFormData({ ...formData, minTerm: e.target.value })}
                  placeholder="3"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTerm">Max Term (months) *</Label>
                <Input
                  id="maxTerm"
                  type="number"
                  value={formData.maxTerm}
                  onChange={(e) => setFormData({ ...formData, maxTerm: e.target.value })}
                  placeholder="60"
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Active Status</p>
                  <p className="text-xs text-gray-500">Product will be available for applications</p>
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
              onClick={handleAddProduct}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="sm:max-w-2xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500">
                <Edit className="h-4 w-4 text-white" />
              </div>
              Edit Product
            </DialogTitle>
            <DialogDescription>
              Update product information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="border-gray-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-bank">Partner Bank *</Label>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-minAmount">Minimum Amount (ETB) *</Label>
                <Input
                  id="edit-minAmount"
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxAmount">Maximum Amount (ETB) *</Label>
                <Input
                  id="edit-maxAmount"
                  type="number"
                  value={formData.maxAmount}
                  onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-interestRate">Interest Rate (%) *</Label>
                <Input
                  id="edit-interestRate"
                  type="number"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-minTerm">Min Term (months) *</Label>
                <Input
                  id="edit-minTerm"
                  type="number"
                  value={formData.minTerm}
                  onChange={(e) => setFormData({ ...formData, minTerm: e.target.value })}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-maxTerm">Max Term (months) *</Label>
                <Input
                  id="edit-maxTerm"
                  type="number"
                  value={formData.maxTerm}
                  onChange={(e) => setFormData({ ...formData, maxTerm: e.target.value })}
                  className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Active Status</p>
                  <p className="text-xs text-gray-500">Product will be available for applications</p>
                </div>
              </div>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingProduct(null)} className="border-gray-200">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProduct}
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

// Product Card Component
function ProductCard({ 
  product, 
  onEdit, 
  onToggleStatus, 
  onDelete,
  formatCurrency
}: { 
  product: Product
  onEdit: (product: Product) => void
  onToggleStatus: (product: Product) => void
  onDelete: (id: string) => void
  formatCurrency: (value: number) => string
}) {
  return (
    <Card className={cn(
      'border-0 shadow-lg shadow-gray-200/50 overflow-hidden group hover:shadow-xl transition-all duration-300',
      !product.isActive && 'opacity-60'
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <Badge variant="secondary" className="bg-violet-100 text-violet-700 border-0 text-[10px] mb-2">
              {product.category}
            </Badge>
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
          </div>
          <Badge className={cn(
            'border-0',
            product.isActive 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-red-100 text-red-700'
          )}>
            {product.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-amber-400 to-orange-500 text-white text-[10px] font-bold">
            {product.bank?.code?.substring(0, 2) || 'NA'}
          </div>
          <span className="text-sm text-gray-600">{product.bank?.name || 'Unknown Bank'}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-gray-50">
            <p className="text-[10px] text-gray-500 uppercase">Amount Range</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {formatCurrency(product.minAmount).replace('ETB', '')} - {formatCurrency(product.maxAmount).replace('ETB', '')}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-gray-50">
            <p className="text-[10px] text-gray-500 uppercase">Interest Rate</p>
            <p className="text-sm font-medium text-gray-900">{product.interestRate}% p.a.</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>{product.minTerm}-{product.maxTerm} months</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="h-3.5 w-3.5 text-gray-400" />
            <span>{product._count?.loans || 0} loans</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 border-gray-200"
            onClick={() => onToggleStatus(product)}
          >
            {product.isActive ? (
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
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
