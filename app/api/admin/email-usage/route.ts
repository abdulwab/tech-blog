import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getGmailLimits } from '@/lib/email'

export async function GET() {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const limits = getGmailLimits()
    
    return NextResponse.json(limits)
  } catch (error) {
    console.error('Error fetching email limits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email limits' },
      { status: 500 }
    )
  }
} 