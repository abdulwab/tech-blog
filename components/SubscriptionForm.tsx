'use client'

import { useState } from 'react'
import { Mail, Check, AlertCircle } from 'lucide-react'

export default function SubscriptionForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Successfully subscribed! Welcome to our community.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 5000)
  }

  return (
    <div className="bg-gradient-to-r from-[var(--accent-web)] to-[var(--accent-ai)] rounded-lg p-8 text-white">
      <div className="max-w-md mx-auto text-center">
        <Mail className="h-12 w-12 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">
          Stay Updated
        </h3>
        <p className="text-white/90 mb-6">
          Get the latest tech insights and tutorials delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === 'loading'}
              className="flex-1 px-4 py-2 text-[var(--text-primary)] bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-6 py-2 bg-white text-[var(--accent-web)] font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--accent-web)] mr-2"></div>
                  Subscribing...
                </div>
              ) : status === 'success' ? (
                <div className="flex items-center">
                  <Check className="h-4 w-4 mr-2" />
                  Subscribed!
                </div>
              ) : (
                'Subscribe'
              )}
            </button>
          </div>

          {message && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              status === 'success' 
                ? 'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20' 
                : 'bg-[var(--error)]/10 text-[var(--error)] border border-[var(--error)]/20'
            }`}>
              {status === 'success' ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  )
} 