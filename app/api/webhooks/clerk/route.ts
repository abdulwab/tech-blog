import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occurred', {
      status: 400,
    })
  }

  // Handle the webhook
  const { id } = evt.data
  const eventType = evt.type

  console.log(`Webhook with an ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', body)

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data)
        break
      case 'user.updated':
        await handleUserUpdated(evt.data)
        break
      case 'user.deleted':
        await handleUserDeleted(evt.data)
        break
      default:
        console.log(`Unhandled webhook event type: ${eventType}`)
    }
  } catch (error) {
    console.error('Error handling webhook:', error)
    return new Response('Error occurred while processing webhook', {
      status: 500,
    })
  }

  return new Response('', { status: 200 })
}

async function handleUserCreated(data: any) {
  try {
    const { id, email_addresses, first_name, last_name, image_url } = data

    const primaryEmail = email_addresses?.find((email: any) => email.id === data.primary_email_address_id)

    await prisma.user.create({
      data: {
        clerkId: id,
        email: primaryEmail?.email_address || '',
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
        role: 'VIEWER', // Default role for new users
        lastSignIn: new Date()
      }
    })

    console.log(`User ${id} created in database`)
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

async function handleUserUpdated(data: any) {
  try {
    const { id, email_addresses, first_name, last_name, image_url } = data

    const primaryEmail = email_addresses?.find((email: any) => email.id === data.primary_email_address_id)

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: id }
    })

    if (existingUser) {
      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: primaryEmail?.email_address || existingUser.email,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
          lastSignIn: new Date()
        }
      })
      console.log(`User ${id} updated in database`)
    } else {
      // User doesn't exist, create them
      await handleUserCreated(data)
    }
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

async function handleUserDeleted(data: any) {
  try {
    const { id } = data

    // Instead of deleting, we'll deactivate the user to preserve data integrity
    await prisma.user.update({
      where: { clerkId: id },
      data: {
        isActive: false
      }
    })

    console.log(`User ${id} deactivated in database`)
  } catch (error) {
    console.error('Error deactivating user:', error)
    throw error
  }
}
