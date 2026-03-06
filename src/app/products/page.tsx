'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Shield,
  Clock,
  Users,
  Building2,
  ArrowRight,
  Menu,
  X,
  CheckCircle,
  TrendingUp,
  Star,
  MapPin,
  Phone,
  Mail,
  Send,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ChevronRight,
  Smartphone,
  Laptop,
  Car,
  Home,
  Zap,
  CreditCard,
  Search,
  Filter,
  Grid3X3,
  List,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const categories = [
  { name: 'All Products', icon: Grid3X3, count: 150, active: true },
  { name: 'Electronics', icon: Smartphone, count: 45, color: 'from-violet-500 to-purple-600' },
  { name: 'Computers', icon: Laptop, count: 32, color: 'from-blue-500 to-cyan-600' },
  { name: 'Vehicles', icon: Car, count: 18, color: 'from-emerald-500 to-teal-600' },
  { name: 'Home & Furniture', icon: Home, count: 25, color: 'from-orange-500 to-amber-600' },
  { name: 'Appliances', icon: Zap, count: 30, color: 'from-pink-500 to-rose-600' }
]

const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    category: 'Electronics',
    price: 'ETB 150,000',
    monthlyPayment: 'ETB 4,167/mo',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    badge: 'Popular',
    rating: 4.9,
    reviews: 128,
    description: 'Latest Apple smartphone with A17 Pro chip'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Electronics',
    price: 'ETB 120,000',
    monthlyPayment: 'ETB 3,333/mo',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop',
    badge: 'New',
    rating: 4.8,
    reviews: 95,
    description: 'Premium Android flagship with S Pen'
  },
  {
    id: 3,
    name: 'MacBook Pro 16"',
    category: 'Computers',
    price: 'ETB 200,000',
    monthlyPayment: 'ETB 5,556/mo',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400&h=300&fit=crop',
    badge: 'Best Value',
    rating: 4.9,
    reviews: 156,
    description: 'M3 Max chip for professionals'
  },
  {
    id: 4,
    name: 'Toyota Corolla 2023',
    category: 'Vehicles',
    price: 'ETB 3,500,000',
    monthlyPayment: 'ETB 97,222/mo',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop',
    badge: 'Featured',
    rating: 4.7,
    reviews: 42,
    description: 'Reliable sedan with fuel efficiency'
  },
  {
    id: 5,
    name: 'Dell XPS 15',
    category: 'Computers',
    price: 'ETB 180,000',
    monthlyPayment: 'ETB 5,000/mo',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=300&fit=crop',
    badge: 'Popular',
    rating: 4.8,
    reviews: 89,
    description: 'Premium Windows laptop for creators'
  },
  {
    id: 6,
    name: 'Samsung 65" QLED TV',
    category: 'Electronics',
    price: 'ETB 85,000',
    monthlyPayment: 'ETB 2,361/mo',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
    badge: 'Hot Deal',
    rating: 4.6,
    reviews: 67,
    description: '4K Smart TV with Quantum Dot'
  },
  {
    id: 7,
    name: 'Modern Sofa Set',
    category: 'Home & Furniture',
    price: 'ETB 75,000',
    monthlyPayment: 'ETB 2,083/mo',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    badge: 'New',
    rating: 4.5,
    reviews: 34,
    description: 'Premium leather 3-seater sofa'
  },
  {
    id: 8,
    name: 'Toyota Hiace Bus',
    category: 'Vehicles',
    price: 'ETB 5,200,000',
    monthlyPayment: 'ETB 144,444/mo',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop',
    badge: 'Featured',
    rating: 4.8,
    reviews: 23,
    description: '15-seater commercial vehicle'
  }
]

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Banks', href: '/#banks' },
  { name: 'Contact', href: '/#contact' }
]

export default function ProductsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All Products')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All Products' || product.category === activeCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Soreti</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-gray-600 hover:text-primary transition-colors font-medium ${link.name === 'Products' ? 'text-primary' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link href="/">
              <Button>Get Started</Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white py-4 px-4">
            <nav className="flex flex-col gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-gray-600 hover:text-primary transition-colors font-medium ${link.name === 'Products' ? 'text-primary' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-4">
                <Link href="/">
                  <Button variant="outline" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 bg-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-emerald-50" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                Quality Products
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Explore Our <span className="text-primary">Products</span>
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse our curated selection of quality products available for financing through Ethiopia&apos;s leading banks.
              </p>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar - Categories */}
              <aside className="lg:w-64 shrink-0">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-24">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                          activeCategory === cat.name
                            ? 'bg-primary text-white'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                      >
                        <cat.icon className="h-4 w-4" />
                        <span className="flex-1 text-sm font-medium">{cat.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          activeCategory === cat.name
                            ? 'bg-white/20 text-white'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1">
                {/* Search & Filters Bar */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                        className="rounded-xl"
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                        className="rounded-xl"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4'
                  : 'space-y-4'
                }>
                  {filteredProducts.map((product) => (
                    viewMode === 'grid' ? (
                      <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              product.badge === 'Popular' ? 'bg-violet-100 text-violet-700' :
                              product.badge === 'New' ? 'bg-emerald-100 text-emerald-700' :
                              product.badge === 'Best Value' ? 'bg-blue-100 text-blue-700' :
                              product.badge === 'Hot Deal' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {product.badge}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                            <Link href="/">
                              <Button className="w-full bg-white/95 text-gray-900 hover:bg-white" size="sm">
                                Quick Apply
                              </Button>
                            </Link>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4">
                          <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-3 line-clamp-1">{product.description}</p>
                          
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                            <span className="text-xs text-gray-400">({product.reviews})</span>
                          </div>
                          
                          <div className="flex items-end justify-between">
                            <div>
                              <div className="text-lg font-bold text-gray-900">{product.price}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Zap className="h-3 w-3 text-primary" />
                                {product.monthlyPayment}
                              </div>
                            </div>
                            <Link href="/">
                              <Button size="sm">Apply</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div key={product.id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex">
                        <div className="w-48 h-40 shrink-0 overflow-hidden">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 p-4 flex flex-col">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              product.badge === 'Popular' ? 'bg-violet-100 text-violet-700' :
                              product.badge === 'New' ? 'bg-emerald-100 text-emerald-700' :
                              product.badge === 'Best Value' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {product.badge}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                          <div className="flex items-center gap-1 mb-3">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                            <span className="text-xs text-gray-400">({product.reviews} reviews)</span>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-lg font-bold text-gray-900">{product.price}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Zap className="h-3 w-3 text-primary" />
                                {product.monthlyPayment}
                              </div>
                            </div>
                            <Link href="/">
                              <Button size="sm" className="gap-1">
                                Apply Now
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </div>

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-500 text-sm">Try adjusting your search or filter to find what you&apos;re looking for.</p>
                  </div>
                )}

                {/* Load More */}
                {filteredProducts.length > 0 && (
                  <div className="text-center mt-8">
                    <Button variant="outline" size="lg" className="gap-2">
                      Load More Products
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 bg-gradient-to-br from-primary via-primary to-emerald-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-100" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Can&apos;t Find What You&apos;re Looking For?
              </h2>
              <p className="text-white/80 mb-6">
                We partner with 100+ vendors. Tell us what you need and we&apos;ll make it happen.
              </p>
              <Link href="/">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2">
                  Request a Product
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="relative bg-gray-900 text-white mt-auto overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
        
        <div className="container mx-auto px-4 py-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-white">Soreti</span>
                  <div className="text-xs text-gray-400">Loan Origination Platform</div>
                </div>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                Connecting you with Ethiopia&apos;s trusted financial institutions to achieve your goals through accessible financing solutions.
              </p>
              <div className="flex gap-2">
                {[
                  { icon: Facebook, href: '#' },
                  { icon: Twitter, href: '#' },
                  { icon: Linkedin, href: '#' },
                  { icon: Instagram, href: '#' }
                ].map((social, i) => (
                  <a key={i} href={social.href} className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1">
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                      <ChevronRight className="h-3 w-3 text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Services
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                {['Personal Loans', 'Business Financing', 'Asset Financing', 'Equipment Loans', 'Vehicle Financing'].map((service) => (
                  <li key={service} className="flex items-center gap-2 group cursor-pointer hover:text-primary transition-colors">
                    <ChevronRight className="h-3 w-3 text-gray-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Get in Touch
              </h3>
              <div className="space-y-3 mb-4">
                <a href="tel:+251111234567" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors group text-sm">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Call us</div>
                    <div>+251 11 123 4567</div>
                  </div>
                </a>
                <a href="mailto:info@soreti.com" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors group text-sm">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Email us</div>
                    <div>info@soreti.com</div>
                  </div>
                </a>
                <div className="flex items-start gap-2 text-gray-400 text-sm">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Visit us</div>
                    <div>Bole Road, Addis Ababa, Ethiopia</div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3">
                <div className="text-xs text-white mb-2">Subscribe to updates</div>
                <div className="flex gap-2">
                  <input type="email" placeholder="Your email" className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-primary" />
                  <button className="w-8 h-8 bg-primary hover:bg-primary/90 rounded-lg flex items-center justify-center transition-colors">
                    <Send className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-gray-800 mb-6">
            {[
              { value: '10,000+', label: 'Loans Approved', icon: CheckCircle },
              { value: '$50M+', label: 'Total Financed', icon: TrendingUp },
              { value: '15+', label: 'Partner Banks', icon: Building2 },
              { value: '98%', label: 'Satisfaction Rate', icon: Star }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} Soreti International Trading Co. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="h-3 w-3 text-primary" />
              <span>Secured by Bank-Grade Encryption</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
