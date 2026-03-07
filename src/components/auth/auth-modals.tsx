'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Loader2,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Shield,
  Sparkles
} from 'lucide-react'

interface OAuthProvider {
  name: string
  displayName: string
  isEnabled: boolean
  buttonColor: string | null
  buttonTextColor: string | null
}

interface AuthModalsProps {
  showLogin: boolean
  showRegister: boolean
  onClose: () => void
  onSwitchToRegister: () => void
  onSwitchToLogin: () => void
}

// Registration steps
const STEPS = [
  { id: 1, title: 'Account', description: 'Create your credentials' },
  { id: 2, title: 'Personal', description: 'Your personal details' },
  { id: 3, title: 'Contact', description: 'Contact information' },
  { id: 4, title: 'Complete', description: 'Review & submit' },
]

// Password strength indicator
function getPasswordStrength(password: string): { strength: number; label: string; color: string } {
  let strength = 0
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++

  if (strength <= 1) return { strength, label: 'Weak', color: 'bg-red-500' }
  if (strength <= 2) return { strength, label: 'Fair', color: 'bg-orange-500' }
  if (strength <= 3) return { strength, label: 'Good', color: 'bg-yellow-500' }
  if (strength <= 4) return { strength, label: 'Strong', color: 'bg-green-500' }
  return { strength, label: 'Excellent', color: 'bg-emerald-500' }
}

export function AuthModals({
  showLogin,
  showRegister,
  onClose,
  onSwitchToRegister,
  onSwitchToLogin,
}: AuthModalsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [oauthProviders, setOauthProviders] = useState<OAuthProvider[]>([])
  const [currentStep, setCurrentStep] = useState(1)

  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  // Registration state
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    dateOfBirth: '',
    phone: '',
    agreeTerms: false,
    agreeMarketing: false,
  })

  // Fetch OAuth providers
  useEffect(() => {
    async function fetchProviders() {
      try {
        const res = await fetch('/api/settings/oauth')
        if (res.ok) {
          const data = await res.json()
          setOauthProviders(data.providers || [])
        }
      } catch (error) {
        console.error('Failed to fetch OAuth providers:', error)
      }
    }
    fetchProviders()
  }, [])

  // Handle social login
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, {
        callbackUrl: '/?view=dashboard',
      })
    } catch (error) {
      setError(`Failed to sign in with ${provider}`)
      setIsLoading(false)
    }
  }

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: loginData.email,
        password: loginData.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        onClose()
        router.refresh()
        window.location.href = '/?view=dashboard'
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Validate current step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!registerData.email || !registerData.password || !registerData.confirmPassword) {
          setError('Please fill in all fields')
          return false
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
          setError('Please enter a valid email address')
          return false
        }
        if (registerData.password.length < 8) {
          setError('Password must be at least 8 characters')
          return false
        }
        if (registerData.password !== registerData.confirmPassword) {
          setError('Passwords do not match')
          return false
        }
        break
      case 2:
        if (!registerData.fullName) {
          setError('Please enter your full name')
          return false
        }
        if (registerData.fullName.length < 2) {
          setError('Name must be at least 2 characters')
          return false
        }
        break
      case 3:
        if (!registerData.phone) {
          setError('Please enter your phone number')
          return false
        }
        if (!registerData.agreeTerms) {
          setError('You must agree to the terms and conditions')
          return false
        }
        break
    }
    setError(null)
    return true
  }

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setError(null)
  }

  // Handle final registration
  const handleRegister = async () => {
    if (!validateStep(3)) return

    setIsLoading(true)
    setError(null)

    try {
      const utmParams: Record<string, string> = {}
      searchParams.forEach((value, key) => {
        if (key.startsWith('utm_')) {
          utmParams[key] = value
        }
      })

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          fullName: registerData.fullName,
          phone: registerData.phone,
          dateOfBirth: registerData.dateOfBirth || undefined,
          marketingConsent: registerData.agreeMarketing,
          ...utmParams,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
      } else {
        const result = await signIn('credentials', {
          email: registerData.email,
          password: registerData.password,
          redirect: false,
        })

        if (result?.ok) {
          onClose()
          router.refresh()
          window.location.href = '/?view=dashboard'
        } else {
          onSwitchToLogin()
        }
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(registerData.password)

  // Social login icons
  const SocialIcons = () => (
    <div className="flex justify-center gap-3 mb-6">
      {/* Google */}
      {(oauthProviders.find(p => p.name === 'google')?.isEnabled || process.env.NODE_ENV === 'development') && (
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-2 hover:border-primary hover:bg-primary/5 transition-all"
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
          title="Continue with Google"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </Button>
      )}
      {/* Facebook */}
      {(oauthProviders.find(p => p.name === 'facebook')?.isEnabled || process.env.NODE_ENV === 'development') && (
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white transition-all"
          onClick={() => handleSocialLogin('facebook')}
          disabled={isLoading}
          title="Continue with Facebook"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </Button>
      )}
      {/* Telegram */}
      {(oauthProviders.find(p => p.name === 'telegram')?.isEnabled || process.env.NODE_ENV === 'development') && (
        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-[#0088cc] hover:bg-[#0088cc]/90 text-white transition-all"
          onClick={() => handleSocialLogin('telegram')}
          disabled={isLoading}
          title="Continue with Telegram"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Login Modal */}
      <Dialog open={showLogin} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[420px] max-h-[90vh] flex flex-col p-0 gap-0">
          <VisuallyHidden>
            <DialogTitle>Sign in to your account</DialogTitle>
          </VisuallyHidden>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {/* Header */}
            <div className="p-6 pb-4 text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to continue</p>
            </div>

            <div className="px-6 pb-6">
              {/* Social Login */}
              <SocialIcons />

              {/* Divider */}
              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-400">or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="animate-shake py-2">
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 h-10"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-sm">Password</Label>
                    <button type="button" className="text-xs text-primary hover:underline">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      className="pl-10 pr-10 h-10"
                      placeholder="Enter password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={loginData.remember}
                    onCheckedChange={(checked) => setLoginData({ ...loginData, remember: !!checked })}
                  />
                  <Label htmlFor="remember" className="text-xs text-gray-600 cursor-pointer">
                    Remember me
                  </Label>
                </div>

                <Button type="submit" className="w-full h-10" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-primary hover:underline font-medium"
                  >
                    Create account
                  </button>
                </div>
              </form>

              {/* Test Accounts - Only visible in development */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg text-xs text-amber-700 border border-amber-200">
                  <p className="font-medium mb-1">⚠️ Test Accounts (DEV ONLY):</p>
                  <p>Customer: customer@test.com</p>
                  <p>Banker: banker@hijira.com</p>
                  <p>Admin: admin@soreti.com</p>
                  <p className="mt-1 text-amber-600">Password: password123</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Registration Modal */}
      <Dialog open={showRegister} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[440px] max-h-[90vh] flex flex-col p-0 gap-0">
          <VisuallyHidden>
            <DialogTitle>Create your account</DialogTitle>
          </VisuallyHidden>
          
          {/* Header - Fixed */}
          <div className="flex-shrink-0 p-5 pb-4 border-b bg-white">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <User className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Create account</h2>
              <p className="text-gray-500 text-xs mt-0.5">Join thousands achieving their goals</p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between mt-4 px-2">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                        currentStep > step.id
                          ? 'bg-primary text-white'
                          : currentStep === step.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                      initial={false}
                      animate={{ scale: currentStep === step.id ? 1.1 : 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      {currentStep > step.id ? <Check className="h-3 w-3" /> : step.id}
                    </motion.div>
                    <span className={`text-[10px] mt-1 ${currentStep >= step.id ? 'text-gray-700' : 'text-gray-400'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 mx-1 bg-gray-200">
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: currentStep > step.id ? '100%' : '0%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-5">
              {/* Social Login (Step 1 only) */}
              {currentStep === 1 && (
                <>
                  <SocialIcons />

                  <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-white text-gray-400">or register with email</span>
                    </div>
                  </div>
                </>
              )}

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-4 animate-shake py-2">
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              )}

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Step 1: Account */}
                  {currentStep === 1 && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="register-email" className="text-sm">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10 h-10"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="register-password" className="text-sm">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            className="pl-10 pr-10 h-10"
                            placeholder="Create a password"
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {registerData.password && (
                          <div className="space-y-1">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                  key={i}
                                  className={`h-1 flex-1 rounded-full transition-colors ${
                                    i <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-[10px] text-gray-500">Strength: {passwordStrength.label}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="register-confirm" className="text-sm">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-confirm"
                            type="password"
                            className="pl-10 h-10"
                            placeholder="Confirm password"
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Personal */}
                  {currentStep === 2 && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="register-name" className="text-sm">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-name"
                            type="text"
                            className="pl-10 h-10"
                            placeholder="Your full name"
                            value={registerData.fullName}
                            onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="register-dob" className="text-sm">Date of Birth (Optional)</Label>
                        <Input
                          id="register-dob"
                          type="date"
                          className="h-10"
                          value={registerData.dateOfBirth}
                          onChange={(e) => setRegisterData({ ...registerData, dateOfBirth: e.target.value })}
                        />
                      </div>

                      <div className="p-3 bg-primary/5 rounded-lg flex items-start gap-2">
                        <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600">Your information is encrypted and secure.</p>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Contact */}
                  {currentStep === 3 && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="register-phone" className="text-sm">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="register-phone"
                            type="tel"
                            className="pl-10 h-10"
                            placeholder="+251 91 234 5678"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <div className="flex items-start gap-2">
                          <Checkbox
                            id="terms"
                            checked={registerData.agreeTerms}
                            onCheckedChange={(checked) => setRegisterData({ ...registerData, agreeTerms: !!checked })}
                            className="mt-0.5"
                          />
                          <Label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                            I agree to the{' '}
                            <a href="#" className="text-primary hover:underline">Terms</a>
                            {' '}and{' '}
                            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                          </Label>
                        </div>

                        <div className="flex items-start gap-2">
                          <Checkbox
                            id="marketing"
                            checked={registerData.agreeMarketing}
                            onCheckedChange={(checked) => setRegisterData({ ...registerData, agreeMarketing: !!checked })}
                            className="mt-0.5"
                          />
                          <Label htmlFor="marketing" className="text-xs text-gray-600 cursor-pointer leading-relaxed">
                            Send me product updates and offers
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {currentStep === 4 && (
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email</span>
                          <span className="font-medium truncate ml-2">{registerData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Name</span>
                          <span className="font-medium">{registerData.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Phone</span>
                          <span className="font-medium">{registerData.phone}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-primary/5 rounded-lg flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600">You&apos;re almost there! Complete registration to start.</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-2 mt-5">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10"
                    onClick={handlePrevStep}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                )}

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    className="flex-1 h-10"
                    onClick={handleNextStep}
                    disabled={isLoading}
                  >
                    Continue
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="flex-1 h-10"
                    onClick={handleRegister}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Account
                        <Check className="ml-1 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Switch to Login */}
              <div className="text-center text-xs text-gray-500 mt-4">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
