interface SendEmailParams {
  apiKey: string
  from: string
  to: string
  subject: string
  html: string
  attachment?: File | null
}

export async function sendEmail(params: SendEmailParams) {
  const { apiKey, from, to, subject, html, attachment } = params
  
  const emailData: any = {
    from,
    to: [to],
    subject,
    html
  }
  
  // 处理附件
  if (attachment) {
    const arrayBuffer = await attachment.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    emailData.attachments = [{
      filename: attachment.name,
      content: base64
    }]
  }
  
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  })
  
  const result = await response.json()
  
  if (response.ok) {
    return { success: true, data: result }
  } else {
    return { success: false, message: result.message || '发送失败' }
  }
}

export function generateRandomPrefix(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let prefix = ''
  for (let i = 0; i < 8; i++) {
    prefix += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return prefix
}
