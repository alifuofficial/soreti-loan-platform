'use client'

import { useState } from 'react'
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
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/#products' },
    { name: 'Banks', href: '/#banks' },
    { name: 'Contact', href: '/#contact' }
  ]

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/#products' },
    { name: 'Banks', href: '/#banks' },
    { name: 'Contact', href: '/#contact' }
  ]

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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-gray-600 hover:text-primary transition-colors font-medium ${link.name === 'About' ? 'text-primary' : ''}`}
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
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-gray-600 hover:text-primary transition-colors font-medium ${link.name === 'About' ? 'text-primary' : ''}`}
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
        <section className="relative py-16 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-emerald-50" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                <Shield className="h-4 w-4" />
                Trusted Loan Platform
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                About <span className="text-primary">Soreti</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ethiopia&apos;s leading loan origination platform, connecting customers with trusted banks for seamless product financing.
              </p>
            </div>
          </div>
        </section>

        {/* Platform Description */}
        <section className="py-10 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-lg mb-8">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                  Soreti is Ethiopia&apos;s leading loan origination platform that connects customers with trusted partner banks for quality product financing. Whether you need a smartphone, laptop, vehicle, or business equipment, we make financing simple, fast, and accessible. Apply online, choose from multiple banks with competitive rates, and get approved in as little as 48 hours.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/">
                    <Button size="lg" className="gap-2">
                      Apply for Loan
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/#banks">
                    <Button size="lg" variant="outline" className="gap-2">
                      <Building2 className="h-5 w-5" />
                      View Partner Banks
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: Clock, label: '48h Approval', color: 'from-violet-500 to-purple-600' },
                  { icon: Shield, label: 'Secure Process', color: 'from-blue-500 to-cyan-600' },
                  { icon: TrendingUp, label: 'Competitive Rates', color: 'from-primary to-emerald-600' },
                  { icon: Users, label: '10K+ Customers', color: 'from-amber-500 to-orange-600' }
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-2`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Company Section */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full text-primary text-sm font-medium mb-3">
                  <Building2 className="h-4 w-4" />
                  Our Parent Company
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Powered by Soreti International Trading Co.
                </h2>
              </div>

              {/* Company Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Logo/Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shrink-0 shadow-lg">
                      <span className="text-white font-bold text-2xl">S</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Soreti International Trading Co. (SITCO)</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        Founded in 2005 by Mr. Bulbula Tule and Mrs. Damma Sheko, SITCO is one of Ethiopia&apos;s leading diversified enterprises. Registered under the Ethiopian Commercial Code, we operate across import and export, manufacturing, hospitality, and real estate — connecting Ethiopia&apos;s industries to global markets.
                      </p>
                      
                      {/* Business Areas */}
                      <div className="flex flex-wrap gap-2">
                        {['Export Trading', 'Import Trading', 'Manufacturing', 'Real Estate', 'Financial Services'].map((area, i) => (
                          <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="bg-gray-900 px-6 py-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-primary">2005</div>
                      <div className="text-xs text-gray-400">Founded</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">100+</div>
                      <div className="text-xs text-gray-400">Team</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">5</div>
                      <div className="text-xs text-gray-400">Continents</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">3</div>
                      <div className="text-xs text-gray-400">Facilities</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Global Presence */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Mojo</div>
                    <div className="text-xs text-gray-500">Vehicle Assembly</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Adama</div>
                    <div className="text-xs text-gray-500">Edible Oil Production</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-gray-900 text-sm">Jimma</div>
                    <div className="text-xs text-gray-500">Avocado Oil Processing</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-primary/5 to-emerald-50 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-gray-900 text-center mb-6">How It Works</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { step: '1', title: 'Register', desc: 'Create account' },
                    { step: '2', title: 'Choose Bank', desc: 'Compare rates' },
                    { step: '3', title: 'Apply', desc: 'Submit docs' },
                    { step: '4', title: 'Get Approved', desc: 'Receive funds' }
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="w-9 h-9 mx-auto rounded-full bg-primary text-white font-bold flex items-center justify-center mb-2 text-sm">
                        {item.step}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{item.title}</h3>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-6 bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Flexible Repayment</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="relative bg-gray-900 text-white mt-auto overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
        
        <div className="container mx-auto px-4 py-12 relative">
          {/* Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand Column */}
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
              
              {/* Social Links */}
              <div className="flex gap-2">
                {[
                  { icon: Facebook, href: '#' },
                  { icon: Twitter, href: '#' },
                  { icon: Linkedin, href: '#' },
                  { icon: Instagram, href: '#' }
                ].map((social, i) => (
                  <a 
                    key={i}
                    href={social.href} 
                    className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
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
            
            {/* Services */}
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
            
            {/* Contact & Newsletter */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Get in Touch
              </h3>
              
              {/* Contact Info */}
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
              
              {/* Newsletter */}
              <div className="bg-gray-800/50 rounded-xl p-3">
                <div className="text-xs text-white mb-2">Subscribe to updates</div>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-primary"
                  />
                  <button className="w-8 h-8 bg-primary hover:bg-primary/90 rounded-lg flex items-center justify-center transition-colors">
                    <Send className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Banner */}
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
          
          {/* Bottom Section */}
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
