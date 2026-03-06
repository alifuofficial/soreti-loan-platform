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
  ChevronLeft,
  Award,
  Zap,
  Wallet,
  Percent,
  Calendar,
  Sparkles,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const featuredBanks = [
  {
    name: 'Commercial Bank of Ethiopia',
    initials: 'CBE',
    tagline: 'Ethiopia\'s Leading Bank',
    color: '#dc2626',
    description: 'The largest commercial bank in Ethiopia with extensive branch network.',
    stats: { rate: '10.5%', maxTerm: '60 mo', maxLoan: '$5M' },
    loansCount: '5,000+'
  },
  {
    name: 'Coop Bank',
    initials: 'CB',
    tagline: 'Banking for All',
    color: '#2563eb',
    description: 'Cooperative Bank of Ethiopia, serving millions with accessible financial services.',
    stats: { rate: '11.5%', maxTerm: '48 mo', maxLoan: '$2M' },
    loansCount: '3,200+'
  },
  {
    name: 'Hijira Bank',
    initials: 'HB',
    tagline: 'Islamic Banking Excellence',
    color: '#059669',
    description: 'Ethiopia\'s premier Islamic bank offering Sharia-compliant financing.',
    stats: { rate: '12%', maxTerm: '36 mo', maxLoan: '$1M' },
    loansCount: '2,500+'
  }
]

const partnerBanks = [
  { name: 'Dashen Bank', initials: 'DB', color: '#7c3aed', rate: '12.5%', maxTerm: '36 mo', maxLoan: '$1.5M' },
  { name: 'Awash Bank', initials: 'AB', color: '#0891b2', rate: '11%', maxTerm: '42 mo', maxLoan: '$1.2M' },
  { name: 'Zemen Bank', initials: 'ZB', color: '#ea580c', rate: '11.5%', maxTerm: '36 mo', maxLoan: '$1M' },
  { name: 'Bunna Bank', initials: 'BB', color: '#16a34a', rate: '12%', maxTerm: '36 mo', maxLoan: '$800K' }
]

const comingSoonBanks = [
  { name: 'Abay Bank', initials: 'AYB', color: '#4f46e5' },
  { name: 'Berhan Bank', initials: 'BrB', color: '#0d9488' },
  { name: 'Enat Bank', initials: 'EB', color: '#be185d' }
]

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Banks', href: '/banks' },
  { name: 'Contact', href: '/#contact' }
]

export default function BanksPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeBank, setActiveBank] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Auto-rotate featured banks
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBank((prev) => (prev + 1) % featuredBanks.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
                className={`text-gray-600 hover:text-primary transition-colors font-medium ${link.name === 'Banks' ? 'text-primary' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link href="/">
              <Button>Get Started</Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white py-4 px-4">
            <nav className="flex flex-col gap-4">
              {quickLinks.map((link) => (
                <Link key={link.name} href={link.href} className={`text-gray-600 hover:text-primary transition-colors font-medium ${link.name === 'Banks' ? 'text-primary' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-emerald-50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                <Building2 className="h-4 w-4" />
                Trusted Network
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Our Partner <span className="text-primary">Banks</span>
              </h1>
              <p className="text-gray-600 max-w-xl mx-auto">
                We&apos;ve partnered with Ethiopia&apos;s leading financial institutions to bring you competitive rates and seamless financing.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{featuredBanks.length + partnerBanks.length}</div>
                  <div className="text-xs text-gray-500">Partner Banks</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">{featuredBanks.length + partnerBanks.length}</div>
                  <div className="text-xs text-gray-500">Active Now</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-amber-600">{comingSoonBanks.length}</div>
                  <div className="text-xs text-gray-500">Coming Soon</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Banks - Large Cards */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Featured Banks</h2>
                <p className="text-sm text-gray-500">Our top financing partners</p>
              </div>
              <div className="flex gap-1">
                {featuredBanks.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveBank(i)}
                    className={`w-2 h-2 rounded-full transition-all ${activeBank === i ? 'bg-primary w-6' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Featured Bank Card */}
              {featuredBanks.map((bank, index) => (
                <div
                  key={bank.name}
                  className={`transition-all duration-500 ${index === activeBank ? 'opacity-100 translate-x-0' : 'opacity-0 absolute inset-0 translate-x-full'}`}
                  style={{ display: index === activeBank ? 'block' : 'none' }}
                >
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Bank Logo */}
                        <div
                          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${bank.color}, ${bank.color}dd)`,
                            boxShadow: `0 20px 40px -10px ${bank.color}60`
                          }}
                        >
                          {bank.initials}
                        </div>
                        
                        {/* Bank Info */}
                        <div className="flex-1 text-white">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-2xl font-bold">{bank.name}</h3>
                            <span className="px-2 py-0.5 bg-primary/20 rounded-full text-xs text-primary font-medium">
                              Featured
                            </span>
                          </div>
                          <p className="text-gray-400 mb-3">{bank.tagline}</p>
                          <p className="text-gray-300 text-sm max-w-lg">{bank.description}</p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 md:gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-primary">{bank.stats.rate}</div>
                            <div className="text-xs text-gray-500">Interest Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{bank.stats.maxTerm}</div>
                            <div className="text-xs text-gray-500">Max Term</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{bank.stats.maxLoan}</div>
                            <div className="text-xs text-gray-500">Max Loan</div>
                          </div>
                        </div>

                        {/* CTA */}
                        <Link href="/">
                          <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2 shrink-0">
                            Apply Now
                            <ArrowRight className="h-5 w-5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Bottom Stats */}
                    <div className="bg-gray-800/50 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-primary" />
                          <span><strong className="text-white">{bank.loansCount}</strong> via Soreti</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                          <span className="text-white">4.9</span>
                          <span>Rating</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {['Trusted Legacy', 'Digital Banking', 'Fast Approval'].map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Partner Banks - Horizontal Scroll */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">All Partner Banks</h2>
                <p className="text-sm text-gray-500">Choose from our network of trusted institutions</p>
              </div>
              <div className="text-sm text-gray-500">
                Swipe to explore →
              </div>
            </div>

            <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <div className="flex gap-4" style={{ width: 'max-content' }}>
                {[...featuredBanks, ...partnerBanks].map((bank) => (
                  <div
                    key={bank.name}
                    className="w-72 shrink-0 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    {/* Card Header */}
                    <div className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg"
                          style={{
                            background: `linear-gradient(135deg, ${bank.color}, ${bank.color}dd)`,
                            boxShadow: `0 8px 20px -8px ${bank.color}40`
                          }}
                        >
                          {bank.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                            {bank.name}
                          </h3>
                          <p className="text-xs text-gray-500">Partner Bank</p>
                        </div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          Active
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-0 border-t border-gray-100">
                      <div className="text-center py-3 border-r border-gray-100">
                        <div className="text-sm font-semibold text-gray-900">{bank.rate}</div>
                        <div className="text-[10px] text-gray-500">Rate</div>
                      </div>
                      <div className="text-center py-3 border-r border-gray-100">
                        <div className="text-sm font-semibold text-gray-900">{bank.maxTerm}</div>
                        <div className="text-[10px] text-gray-500">Max Term</div>
                      </div>
                      <div className="text-center py-3">
                        <div className="text-sm font-semibold text-gray-900">{bank.maxLoan}</div>
                        <div className="text-[10px] text-gray-500">Max Loan</div>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="p-3 bg-gray-50 border-t border-gray-100">
                      <Link href="/" className="block">
                        <Button variant="outline" size="sm" className="w-full gap-1 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors">
                          Apply Now
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon Banks */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-bold text-gray-900">Coming Soon</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {comingSoonBanks.map((bank) => (
                <div
                  key={bank.name}
                  className="relative bg-gray-50 rounded-2xl border border-gray-100 p-5 overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-30" style={{ background: `radial-gradient(circle, ${bank.color}30, transparent)` }} />
                  
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm opacity-60"
                      style={{ background: `linear-gradient(135deg, ${bank.color}, ${bank.color}dd)` }}
                    >
                      {bank.initials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">{bank.name}</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Partner Section */}
        <section className="py-10 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-primary text-sm font-medium mb-3">
                <Award className="h-4 w-4" />
                Why Partner With Us
              </div>
              <h2 className="text-2xl font-bold">Trusted by Ethiopia&apos;s Leading Banks</h2>
            </div>

            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: Shield, title: 'Secure Platform', desc: 'Bank-grade security' },
                { icon: Zap, title: 'Fast Processing', desc: 'Quick approvals' },
                { icon: Users, title: 'Large Network', desc: 'Thousands of customers' },
                { icon: TrendingUp, title: 'Growth', desc: 'Consistent expansion' }
              ].map((item, i) => (
                <div key={i} className="text-center p-5 bg-white/5 rounded-2xl border border-white/10">
                  <item.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-br from-primary via-primary to-emerald-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-100" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Ready to Get Started?
              </h2>
              <p className="text-white/80 mb-6">
                Choose a bank and apply for financing today. Our team is here to help you every step of the way.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2">
                    Apply Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
        
        <div className="container mx-auto px-4 py-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-xl font-bold">Soreti</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Connecting you with Ethiopia&apos;s trusted financial institutions.</p>
              <div className="flex gap-2">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-sm">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-400 hover:text-primary transition-colors">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-sm">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Personal Loans</li>
                <li>Business Financing</li>
                <li>Asset Financing</li>
                <li>Vehicle Financing</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-sm">Contact</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <a href="tel:+251111234567" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                  +251 11 123 4567
                </a>
                <a href="mailto:info@soreti.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                  info@soreti.com
                </a>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  Bole Road, Addis Ababa
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Soreti International Trading Co. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
