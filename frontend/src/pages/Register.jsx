import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { userState } from '../state/atoms'
import { register } from '../utils/auth'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const setUser = useSetRecoilState(userState)
  const nav = useNavigate()

  // Validation function
  const validateForm = () => {
    const errors = {}
    
    // Name validation
    if (!form.name.trim()) {
      errors.name = 'Full name is required'
    }
    
    // Email validation
    if (!form.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    // Password validation
    if (!form.password) {
      errors.password = 'Password is required'
    } else if (form.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long'
    }
    
    return errors
  }

  async function submit(e) {
    e.preventDefault()
    setError(null)
    setValidationErrors({})
    
    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }
    
    try {
      const res = await register(form)
      if (res.data.user) setUser(res.data.user)
      nav('/projects')
    } catch (err) {
      setError(err?.response?.data?.message || 'Register failed')
    }
  }

  // Toggle password visibility
  const togglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white px-4">
      <div className="w-full max-w-md bg-white border border-yellow-200 shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-yellow-600 mb-6">
          Create Account
        </h2>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {/* Name Field */}
          <div>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Full Name *"
              required
              className={`border ${validationErrors.name ? 'border-red-400' : 'border-yellow-200'} focus:border-yellow-400 focus:ring focus:ring-yellow-100 p-3 rounded-lg outline-none transition w-full`}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <input
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              type="email"
              placeholder="Email *"
              required
              className={`border ${validationErrors.email ? 'border-red-400' : 'border-yellow-200'} focus:border-yellow-400 focus:ring focus:ring-yellow-100 p-3 rounded-lg outline-none transition w-full`}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>

          {/* Password Field with Toggle */}
          <div>
            <div className="relative">
              <input
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                type={showPassword ? "text" : "password"}
                placeholder="Password (min 8 characters) *"
                required
                minLength="8"
                className={`border ${validationErrors.password ? 'border-red-400' : 'border-yellow-200'} focus:border-yellow-400 focus:ring focus:ring-yellow-100 p-3 rounded-lg outline-none transition w-full pr-12`}
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Hide password icon
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                ) : (
                  // Show password icon
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                )}
              </button>
            </div>
            {validationErrors.password && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
            )}
            {form.password && form.password.length < 8 && (
              <p className="text-orange-500 text-sm mt-1">
                Password strength: {form.password.length}/8 characters
              </p>
            )}
          </div>

          {/* Server Error */}
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg shadow-md transition transform hover:scale-[1.02]"
          >
            Register
          </button>
        </form>
        
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{' '}
          <span
            className="text-yellow-600 hover:underline cursor-pointer"
            onClick={() => nav('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}