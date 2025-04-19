import { createUser, deleteUser } from '@/data/firestore';
import { verifyWebhook, UserWebhookEvent,  } from '@clerk/nextjs/webhooks'

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    // const { id } = evt.data
    const eventType = evt.type
    // console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    // console.log('Webhook payload:', evt.data)

    if (eventType?.startsWith('user.')) {
        const userEvent = evt as UserWebhookEvent;
        

        switch(userEvent.type) {
            case 'user.created':
                await createUser(userEvent.data)
                console.log('User Created')
                break;
            case 'user.updated':
                console.log('User Updated')
                break;
            case 'user.deleted':
                await deleteUser(userEvent.data)
                console.log('User Deleted')
                break;
        }


        console.log('User Webhook Event Received:', userEvent.data)
    } else {
        console.log('Unexpected Webhook Event Received:', eventType, evt.data)
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}