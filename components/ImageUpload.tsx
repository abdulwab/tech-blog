'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  required?: boolean
  className?: string
}

export default function ImageUpload({ 
  value, 
  onChange, 
  label = "Cover Image", 
  required = false,
  className = ""
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isServerless, setIsServerless] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Reset previous errors
    setUploadError(null)

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setUploadError('File too large. Maximum size is 5MB.')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        onChange(result.url)
        setUploadError(null)
      } else {
        // Handle specific serverless environment error
        if (response.status === 501) {
          setIsServerless(true)
          setUploadError(result.error)
        } else {
          setUploadError(result.error || 'Upload failed. Please try again.')
        }
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('Upload failed. Please check your connection and try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemove = () => {
    onChange('')
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!isServerless && !uploadError) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {value ? (
        // Show preview when image is uploaded
        <div className="relative group">
          <div className="relative w-full h-48 bg-[var(--background-secondary)] rounded-lg overflow-hidden border border-[var(--border-primary)]">
            <Image
              src={value}
              alt="Cover image preview"
              fill
              className="object-cover"
            />
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
              {!isServerless && (
                <button
                  type="button"
                  onClick={handleClick}
                  className="bg-[var(--accent-web)] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--accent-web)]/80 transition-colors"
                >
                  <Upload className="w-4 h-4 inline mr-1" />
                  Change
                </button>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4 inline mr-1" />
                Remove
              </button>
            </div>
          </div>
          
          {/* File info */}
          <div className="mt-2 text-xs text-[var(--text-secondary)]">
            Image loaded successfully
          </div>
        </div>
      ) : (
        // Show upload area when no image
        <div>
          {!isServerless && (
            <div
              className={`
                relative w-full h-48 border-2 border-dashed rounded-lg transition-colors cursor-pointer
                ${dragOver 
                  ? 'border-[var(--accent-web)] bg-[var(--accent-web)]/5' 
                  : 'border-[var(--border-primary)] hover:border-[var(--accent-web)] hover:bg-[var(--background-secondary)]'
                }
                ${uploading || uploadError ? 'pointer-events-none opacity-50' : ''}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-web)] mb-2"></div>
                    <p className="text-sm text-[var(--text-secondary)]">Uploading...</p>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-[var(--text-secondary)] mb-4" />
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      PNG, JPG, GIF or WebP (max 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Error message */}
          {uploadError && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">Upload Failed</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{uploadError}</p>
                  {isServerless && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      💡 <strong>Solution:</strong> Use the URL input field below to add your image via a link from an image hosting service.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Serverless environment notice */}
          {isServerless && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Serverless Environment Detected</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    File uploads are not supported in this deployment environment. Please use the URL input below.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={uploading || isServerless}
      />

      {/* URL input - always available */}
      <div className="mt-3">
        <p className="text-xs text-[var(--text-secondary)] mb-2">
          {isServerless ? 'Add image URL:' : 'Or paste an image URL:'}
        </p>
        <input
          type="url"
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value)
            setUploadError(null) // Clear error when user types URL
          }}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] text-[var(--text-primary)] text-sm"
        />
        {isServerless && (
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            💡 Try free image hosting: <a href="https://imgur.com" target="_blank" rel="noopener" className="text-[var(--accent-web)] hover:underline">Imgur</a>, <a href="https://imgbb.com" target="_blank" rel="noopener" className="text-[var(--accent-web)] hover:underline">ImgBB</a>, or <a href="https://postimages.org" target="_blank" rel="noopener" className="text-[var(--accent-web)] hover:underline">PostImages</a>
          </p>
        )}
      </div>
    </div>
  )
} 