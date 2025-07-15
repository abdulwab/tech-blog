'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Check, AlertCircle, Star, Users, Bell, Gift } from 'lucide-react'

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
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
        
        // Close modal after successful subscription
        setTimeout(() => {
          onClose()
          setStatus('idle')
          setMessage('')
        }, 2000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }

    // Reset error status after 5 seconds
    if (status === 'error') {
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleClose = () => {
    onClose()
    // Reset form state when closing
    setEmail('')
    setStatus('idle')
    setMessage('')
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={handleOverlayClick}
    >
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-2xl max-w-md w-full mx-auto relative animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--hover-bg)] rounded-full transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-[var(--accent-web)] to-[var(--accent-ai)] p-3 rounded-full">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              Don't Miss Out! 🚀
            </h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Join <strong>thousands of developers</strong> getting the latest tech insights, tutorials, and exclusive content delivered to their inbox.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
              <Bell className="h-4 w-4 text-[var(--accent-web)]" />
              <span>Weekly updates</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
              <Star className="h-4 w-4 text-[var(--accent-ai)]" />
              <span>Exclusive content</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
              <Users className="h-4 w-4 text-[var(--accent-web)]" />
              <span>Join community</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-[var(--text-secondary)]">
              <Gift className="h-4 w-4 text-[var(--accent-ai)]" />
              <span>Free resources</span>
            </div>
          </div>

          {/* Subscription Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={status === 'loading' || status === 'success'}
                className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] disabled:opacity-50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="w-full px-6 py-3 bg-gradient-to-r from-[var(--accent-web)] to-[var(--accent-ai)] text-white font-medium rounded-lg hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-200"
            >
              {status === 'loading' ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </div>
              ) : status === 'success' ? (
                <div className="flex items-center justify-center">
                  <Check className="h-5 w-5 mr-2" />
                  Welcome Aboard! 🎉
                </div>
              ) : (
                'Subscribe for Free'
              )}
            </button>

            {/* Message */}
            {message && (
              <div className={`flex items-center space-x-2 p-3 rounded-lg transition-all ${
                status === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
              }`}>
                {status === 'success' ? (
                  <Check className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              No spam, ever. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook to manage subscription modal state and timing
export function useSubscriptionModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // Check if user has already seen the modal
    const hasSeenModal = localStorage.getItem('subscription-modal-seen')
    const hasSubscribed = localStorage.getItem('user-subscribed')
    
    if (hasSeenModal || hasSubscribed) {
      return
    }

    // Show modal after 3 seconds of being on the page
    const timer = setTimeout(() => {
      setIsModalOpen(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const closeModal = () => {
    setIsModalOpen(false)
    // Remember that user has seen the modal
    localStorage.setItem('subscription-modal-seen', 'true')
  }

  const markAsSubscribed = () => {
    localStorage.setItem('user-subscribed', 'true')
    localStorage.setItem('subscription-modal-seen', 'true')
  }

  return {
    isModalOpen,
    closeModal,
    markAsSubscribed
  }
} 