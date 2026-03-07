'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Camera,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Upload,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  Building2,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface BankerProfileProps {
  user: {
    id: string
    fullName: string
    email: string
    phone?: string
    image?: string
    role: string
    bankName?: string
    createdAt?: string
  }
}

export function BankerProfile({ user }: BankerProfileProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Profile picture state
  const [profileImage, setProfileImage] = useState<string | null>(user.image || null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)
  const [imageSuccess, setImageSuccess] = useState<string | null>(null)
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null)
  
  // Password strength
  const [passwordStrength, setPasswordStrength] = useState(0)

  const userInitials = user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()

  // Handle profile picture upload
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size must be less than 5MB')
      return
    }

    setImageError(null)
    setImageSuccess(null)
    setIsUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/user/profile-image', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setProfileImage(data.imageUrl)
        setImageSuccess('Profile picture updated successfully!')
        router.refresh()
      } else {
        setImageError(data.error || 'Failed to upload image')
      }
    } catch (error) {
      setImageError('Failed to upload image. Please try again.')
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Handle remove profile picture
  const handleRemoveImage = async () => {
    setImageError(null)
    setImageSuccess(null)
    setIsUploadingImage(true)

    try {
      const response = await fetch('/api/user/profile-image', {
        method: 'DELETE'
      })

      if (response.ok) {
        setProfileImage(null)
        setImageSuccess('Profile picture removed successfully!')
        router.refresh()
      } else {
        const data = await response.json()
        setImageError(data.error || 'Failed to remove image')
      }
    } catch (error) {
      setImageError('Failed to remove image. Please try again.')
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.match(/[a-z]/)) strength += 25
    if (password.match(/[A-Z]/)) strength += 25
    if (password.match(/[0-9]/)) strength += 12.5
    if (password.match(/[^a-zA-Z0-9]/)) strength += 12.5
    return Math.min(100, strength)
  }

  const handlePasswordChange = (password: string) => {
    setNewPassword(password)
    setPasswordStrength(calculatePasswordStrength(password))
  }

  // Handle password update
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(null)

    // Validation
    if (!currentPassword) {
      setPasswordError('Please enter your current password')
      return
    }
    if (!newPassword) {
      setPasswordError('Please enter a new password')
      return
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from current password')
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordSuccess('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordStrength(0)
      } else {
        setPasswordError(data.error || 'Failed to change password')
      }
    } catch (error) {
      setPasswordError('Failed to change password. Please try again.')
    } finally {
      setIsChangingPassword(false)
    }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return 'bg-red-500'
    if (passwordStrength < 50) return 'bg-orange-500'
    if (passwordStrength < 75) return 'bg-yellow-500'
    return 'bg-emerald-500'
  }

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 25) return 'Weak'
    if (passwordStrength < 50) return 'Fair'
    if (passwordStrength < 75) return 'Good'
    return 'Strong'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="h-6 w-6 text-blue-500" />
          Profile Settings
        </h2>
        <p className="text-gray-500 mt-1">
          Manage your profile picture and account security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-500" />
                Profile Picture
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                {/* Profile Image */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 shadow-lg shadow-blue-500/30">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">{userInitials}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Overlay on hover */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Camera className="h-8 w-8 text-white" />
                  </button>
                </div>

                {/* User Info */}
                <h3 className="mt-4 font-semibold text-gray-900">{user.fullName}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <Badge className="mt-2 bg-blue-100 text-blue-700 border-0">
                  Bank Officer
                </Badge>
                
                {user.bankName && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="h-4 w-4" />
                    <span>{user.bankName}</span>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />

                {/* Action Buttons */}
                <div className="flex gap-2 mt-6 w-full">
                  <Button
                    variant="outline"
                    className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                  >
                    {isUploadingImage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload
                  </Button>
                  {profileImage && (
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={handleRemoveImage}
                      disabled={isUploadingImage}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Messages */}
                {imageError && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 text-red-700 rounded-lg w-full">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="text-sm">{imageError}</span>
                  </div>
                )}
                {imageSuccess && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg w-full">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span className="text-sm">{imageSuccess}</span>
                  </div>
                )}

                {/* Guidelines */}
                <div className="mt-6 text-xs text-gray-500 text-center">
                  <p>JPG, PNG or GIF. Max size 5MB.</p>
                  <p>Recommended: Square image, at least 200x200px</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Password Section */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-500" />
                Change Password
              </CardTitle>
              <CardDescription>
                Ensure your account is using a strong password
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="h-11 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="Enter your new password"
                      className="h-11 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Password Strength */}
                  {newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Password strength</span>
                        <span className={cn(
                          'font-medium',
                          passwordStrength < 50 ? 'text-orange-500' : 'text-emerald-500'
                        )}>
                          {getPasswordStrengthLabel()}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={cn('h-full transition-all duration-300', getPasswordStrengthColor())}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="h-11 pr-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {/* Password match indicator */}
                  {confirmPassword && (
                    <div className={cn(
                      'flex items-center gap-1 text-xs',
                      newPassword === confirmPassword ? 'text-emerald-500' : 'text-orange-500'
                    )}>
                      {newPassword === confirmPassword ? (
                        <>
                          <CheckCircle className="h-3 w-3" />
                          <span>Passwords match</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          <span>Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Error/Success Messages */}
                {passwordError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="text-sm">{passwordError}</span>
                  </div>
                )}
                {passwordSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg">
                    <CheckCircle className="h-4 w-4 shrink-0" />
                    <span className="text-sm">{passwordSuccess}</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/30 h-11"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>

                {/* Password Requirements */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements</h4>
                  <ul className="space-y-1 text-xs text-gray-500">
                    <li className="flex items-center gap-2">
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        newPassword.length >= 8 ? 'bg-emerald-500' : 'bg-gray-300'
                      )} />
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        newPassword.match(/[a-z]/) ? 'bg-emerald-500' : 'bg-gray-300'
                      )} />
                      One lowercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        newPassword.match(/[A-Z]/) ? 'bg-emerald-500' : 'bg-gray-300'
                      )} />
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        newPassword.match(/[0-9]/) ? 'bg-emerald-500' : 'bg-gray-300'
                      )} />
                      One number
                    </li>
                    <li className="flex items-center gap-2">
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        newPassword.match(/[^a-zA-Z0-9]/) ? 'bg-emerald-500' : 'bg-gray-300'
                      )} />
                      One special character (recommended)
                    </li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card className="border-0 shadow-lg shadow-gray-200/50 bg-white overflow-hidden mt-6">
            <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500" />
            <CardHeader className="pb-3 border-b border-gray-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">{user.phone}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Assigned Bank</p>
                    <p className="font-medium text-gray-900">{user.bankName || 'Not assigned'}</p>
                  </div>
                </div>
                
                {user.createdAt && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="font-medium text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
