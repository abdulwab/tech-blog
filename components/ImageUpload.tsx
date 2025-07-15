'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.')
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

      if (response.ok) {
        const result = await response.json()
        onChange(result.url)
      } else {
        const error = await response.json()
        alert(`Upload failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
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
              <button
                type="button"
                onClick={handleClick}
                className="bg-[var(--accent-web)] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[var(--accent-web)]/80 transition-colors"
              >
                <Upload className="w-4 h-4 inline mr-1" />
                Change
              </button>
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
            Image uploaded successfully
          </div>
        </div>
      ) : (
        // Show upload area when no image
        <div
          className={`
            relative w-full h-48 border-2 border-dashed rounded-lg transition-colors cursor-pointer
            ${dragOver 
              ? 'border-[var(--accent-web)] bg-[var(--accent-web)]/5' 
              : 'border-[var(--border-primary)] hover:border-[var(--accent-web)] hover:bg-[var(--background-secondary)]'
            }
            ${uploading ? 'pointer-events-none opacity-50' : ''}
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={uploading}
      />

      {/* URL fallback input */}
      <div className="mt-3">
        <p className="text-xs text-[var(--text-secondary)] mb-2">
          Or paste an image URL:
        </p>
        <input
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 bg-[var(--card-bg)] border border-[var(--border-primary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-web)] text-[var(--text-primary)] text-sm"
        />
      </div>
    </div>
  )
} 