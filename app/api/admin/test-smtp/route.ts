import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { testSMTPConnection } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await testSMTPConnection()

    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: '✅ SMTP connection successful! Your email server is properly configured.' 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: `❌ SMTP connection failed: ${result.error}` 
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error testing SMTP:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to test SMTP connection' 
    }, { status: 500 })
  }
} 