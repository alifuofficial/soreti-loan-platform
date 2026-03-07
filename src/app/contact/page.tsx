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
  ChevronRight,
  MessageCircle,
  Globe,
  Headphones,
  Clock3,
  HelpCircle,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Products', href: '/products' },
  { name: 'Banks', href: '/banks' },
  { name: 'Contact', href: '/contact' }
]

const contactMethods = [
  {
    icon: Phone,
    title: 'Call Us',
    value: '+251 11 123 4567',
    description: 'Mon-Fri from 8am to 6pm',
    color: 'from-emerald-500 to-teal-600',
    action: 'tel:+251111234567'
  },
  {
    icon: Mail,
    title: 'Email Us',
    value: 'info@soreti.com',
    description: 'We\'ll respond within 24 hours',
    color: 'from-blue-500 to-indigo-600',
    action: 'mailto:info@soreti.com'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: 'Bole Road, Addis Ababa',
    description: 'Ethiopia',
    color: 'from-violet-500 to-purple-600',
    action: '#'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    value: 'Start a conversation',
    description: 'Available 24/7',
    color: 'from-amber-500 to-orange-600',
    action: '#'
  }
]

const faqs = [
  {
    question: 'How long does loan approval take?',
    answer: 'Most loan applications are processed within 24-48 hours. Complex applications may take up to 5 business days.'
  },
  {
    question: 'What documents do I need to apply?',
    answer: 'You\'ll need a valid ID (Kebele ID or Passport), proof of income, and bank statements. Additional documents may be required based on loan type.'
  },
  {
    question: 'Can I apply for multiple loans?',
    answer: 'Yes, you can apply for multiple loans from different partner banks. Our platform makes it easy to compare and choose the best option.'
  },
  {
    question: 'What are the interest rates?',
    answer: 'Interest rates vary by bank and loan type, ranging from 10.5% to 15% annually. You can compare rates on our platform before applying.'
  }
]

const offices = [
  {
    city: 'Addis Ababa',
    address: 'Bole Road, Atlas Area',
    phone: '+251 11 123 4567',
    hours: 'Mon-Fri: 8am - 6pm',
    isMain: true
  },
  {
    city: 'Adama',
    address: 'Main Street, Central Business District',
    phone: '+251 22 111 2222',
    hours: 'Mon-Fri: 8am - 5pm',
    isMain: false
  }
]

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

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
                className={`text-gray-600 hover:text-primary transition-colors font-medium ${link.name === 'Contact' ? 'text-primary' : ''}`}
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
                <Link key={link.name} href={link.href} className={`text-gray-600 hover:text-primary transition-colors font-medium ${link.name === 'Contact' ? 'text-primary' : ''}`} onClick={() => setMobileMenuOpen(false)}>
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
                <Headphones className="h-4 w-4" />
                We're Here to Help
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Get in <span className="text-primary">Touch</span>
              </h1>
              <p className="text-gray-600 max-w-xl mx-auto">
                Have questions about our loan services? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {contactMethods.map((method, i) => (
                <a
                  key={i}
                  href={method.action}
                  className="group bg-gray-50 rounded-2xl p-5 hover:bg-white hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <method.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{method.title}</h3>
                  <p className="text-primary font-medium text-sm mb-1">{method.value}</p>
                  <p className="text-xs text-gray-500">{method.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-500 text-sm mb-6">Fill out the form below and we&apos;ll get back to you shortly.</p>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-500 mb-4">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                    <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                          placeholder="+251 91 234 5678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        >
                          <option value="">Select a subject</option>
                          <option value="loan">Loan Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>

              {/* Right Side - Info & Map */}
              <div className="space-y-6">
                {/* Office Locations */}
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Our Offices</h2>
                  <div className="space-y-4">
                    {offices.map((office, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl ${office.isMain ? 'bg-primary/5 border border-primary/20' : 'bg-gray-50 border border-gray-100'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${office.isMain ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}>
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{office.city}</h3>
                              {office.isMain && (
                                <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-medium">
                                  HQ
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{office.address}</p>
                            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3 text-primary" />
                                {office.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock3 className="h-3 w-3 text-primary" />
                                {office.hours}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Interactive Map</p>
                      <p className="text-xs text-gray-400">Bole Road, Addis Ababa</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: '24/7', label: 'Support', icon: Headphones },
                    { value: '<1h', label: 'Response', icon: Zap },
                    { value: '98%', label: 'Satisfaction', icon: Star }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                      <stat.icon className="h-5 w-5 text-primary mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-3">
                  <HelpCircle className="h-4 w-4" />
                  Common Questions
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-90' : ''}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                Apply for a loan today and turn your dreams into reality. Our team is here to help you every step of the way.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2">
                    Apply for Loan
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
