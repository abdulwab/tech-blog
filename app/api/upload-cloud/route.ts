// EXAMPLE: Cloud Storage Implementation with Database URLs
// This is a template - requires installation of cloud storage packages

import { NextRequest, NextResponse } from 'next/server'
// import { put } from '@vercel/blob' // npm install @vercel/blob
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB for cloud storage)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Example: Upload to cloud storage (requires setup)
    // const blob = await put(file.name, file, {
    //   access: 'public',
    //   addRandomSuffix: true,
    // })

    // Placeholder URL for example
    const exampleUrl = `https://your-storage.com/images/${file.name}`

    // Store image metadata in database (requires schema update)
    // See schema-example.prisma for the required model
    
    return NextResponse.json({
      url: exampleUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      message: "This is an example implementation. Please set up cloud storage first."
    })

  } catch (error) {
    console.error('Error uploading to cloud storage:', error)
    return NextResponse.json(
      { error: 'Failed to upload file to cloud storage' },
      { status: 500 }
    )
  }
} 