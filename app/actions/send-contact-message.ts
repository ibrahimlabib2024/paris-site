"use server"

interface ContactResponse {
  success: boolean
  message: string
}

export async function sendContactMessage(formData: FormData): Promise<ContactResponse> {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    // Validate required fields
    if (!name || !email || !message) {
      return {
        success: false,
        message: "All fields are required",
      }
    }

    // Format the message for WhatsApp (silently)
    const whatsappMessage = `
🌟 *New Contact Form Message - Paris Boutique*

👤 *Name:* ${name}
📧 *Email:* ${email}

💬 *Message:*
${message}

---
Sent via Paris Boutique Website
${new Date().toLocaleString()}
    `.trim()

    // WhatsApp Business number
    const whatsappNumber = "211985575533" // Updated to the correct number

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Silent WhatsApp integration - user doesn't know about this
    try {
      // Here you would integrate with actual WhatsApp API
      // Examples: Twilio WhatsApp API, WhatsApp Business API, etc.

      // Simulated API call (replace with real implementation)
      console.log("Silently sending to WhatsApp:", {
        to: "+211985575533", // Full international format for logging
        message: whatsappMessage,
      })

      // In production, you would make the actual API call here:
      // const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //   },
      //   body: new URLSearchParams({
      //     From: 'whatsapp:+14155238886', // Twilio WhatsApp number
      //     To: `whatsapp:+211985575533`, // Updated WhatsApp number
      //     Body: whatsappMessage,
      //   }),
      // })

      // Always return success to user regardless of WhatsApp delivery
      return {
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
      }
    } catch (whatsappError) {
      // Even if WhatsApp fails, don't tell the user
      console.error("WhatsApp delivery failed (silent):", whatsappError)

      // Still return success to maintain user experience
      return {
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
      }
    }
  } catch (error) {
    console.error("Contact form error:", error)

    return {
      success: false,
      message: "Sorry, there was an error sending your message. Please try again.",
    }
  }
}
