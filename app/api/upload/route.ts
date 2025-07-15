import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

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

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Check if we're in a serverless environment
    const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY
    
    if (isServerless) {
      return NextResponse.json(
        { 
          error: 'File uploads are not supported in serverless environments. Please use an image URL instead or configure cloud storage (AWS S3, Cloudinary, etc.).',
          suggestion: 'Use the URL input field below to add your image via a link.'
        },
        { status: 501 } // Not Implemented
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist (only in non-serverless environments)
    const uploadsDir = path.join(process.cwd(), 'public/uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist or we don't have write permissions
      console.warn('Could not create uploads directory:', error)
    }

    // Generate unique filename
    const fileExtension = path.extname(file.name)
    const fileName = `${uuidv4()}${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)

    try {
      // Write file to disk
      await writeFile(filePath, buffer)
      
      // Return the URL path that can be used in the frontend
      const fileUrl = `/uploads/${fileName}`

      return NextResponse.json({
        url: fileUrl,
        filename: fileName,
        size: file.size,
        type: file.type
      })
    } catch (writeError) {
      console.error('Failed to write file:', writeError)
      return NextResponse.json(
        { 
          error: 'Failed to save file. This might be a read-only file system.',
          suggestion: 'Please use the URL input field to add your image via a link, or configure cloud storage.'
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 