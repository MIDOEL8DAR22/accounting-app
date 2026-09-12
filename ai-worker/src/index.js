const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
}

const DEFAULT_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast'
const MAX_TOTAL_CHARS = 8000
const MAX_MESSAGES = 12
const MAX_OUTPUT_TOKENS = 700

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  })
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }
    if (request.method !== 'POST') {
      return json({ error: 'method-not-allowed' }, 405)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json({ error: 'bad-json' }, 400)
    }

    const messages = Array.isArray(body?.messages) ? body.messages : null
    if (!messages || messages.length === 0) {
      return json({ error: 'messages-required' }, 400)
    }
    const totalChars = messages.reduce(
      (n, m) => n + (typeof m?.content === 'string' ? m.content.length : 0),
      0
    )
    if (totalChars > MAX_TOTAL_CHARS) {
      return json({ error: 'too-long' }, 413)
    }

    const model = typeof body?.model === 'string' && body.model ? body.model : DEFAULT_MODEL

    try {
      const out = await env.AI.run(model, {
        messages: messages.slice(0, MAX_MESSAGES),
        max_tokens: MAX_OUTPUT_TOKENS,
        stream: false,
      })
      const content = out?.response
      if (typeof content !== 'string' || content.trim() === '') {
        return json({ error: 'empty-response' }, 502)
      }
      return json({
        choices: [{ message: { role: 'assistant', content } }],
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (/free|quota|limit|exceeded|insufficient/i.test(msg)) {
        return json({ error: 'quota', detail: 'Workers AI quota exhausted' }, 429)
      }
      return json({ error: 'ai-error', detail: msg.slice(0, 300) }, 500)
    }
  },
}