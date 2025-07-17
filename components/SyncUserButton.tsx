'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SyncUserButtonProps {
  className?: string
  children: React.ReactNode
}

export default function SyncUserButton({ className, children }: SyncUserButtonProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleSync = async () => {
    try {
      setLoading(true)
      setMessage('')
      
      const response = await fetch('/api/users/sync', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(`✅ Account ${data.action} successfully!`)
        
        // Refresh the page to show updated role info
        setTimeout(() => {
          router.refresh()
        }, 1000)
      } else {
        const error = await response.json()
        setMessage(`❌ Error: ${error.error}`)
      }
    } catch (error) {
      setMessage('❌ Failed to sync account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleSync}
        disabled={loading}
        className={className}
      >
        {loading ? 'Syncing...' : children}
      </button>
      
      {message && (
        <div className={`mt-2 text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}
    </div>
  )
} 