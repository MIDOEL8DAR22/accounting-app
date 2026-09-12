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

const DAILY_GLOBAL_BUDGET = 100
const MAX_TRACKED_USERS = 200

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS, ...extraHeaders },
  })
}

async function readQuota(env, ip) {
  const today = new Date().toISOString().slice(0, 10)
  const usersKey = `users:${today}`
  const userKey = `user:${today}:${ip}`
  const [usersRaw, usedRaw] = await Promise.all([env.AI_LIMITS.get(usersKey), env.AI_LIMITS.get(userKey)])
  let users = []
  try {
    const parsed = usersRaw ? JSON.parse(usersRaw) : []
    if (Array.isArray(parsed)) users = parsed
  } catch {
    users = []
  }
  let used = 0
  if (usedRaw) {
    const n = parseInt(usedRaw, 10)
    if (!Number.isNaN(n)) used = n
  }
  const isNew = !users.includes(ip)
  const changed = isNew && users.length < MAX_TRACKED_USERS
  if (changed) {
    users.push(ip)
    await env.AI_LIMITS.put(usersKey, JSON.stringify(users))
  }
  const totalUsers = Math.max(1, users.length)
  const perUserLimit = Math.max(1, Math.floor(DAILY_GLOBAL_BUDGET / totalUsers))
  return { userKey, used, perUserLimit, totalUsers }
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

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
    const quotaHeaders = (used, limit, users) => ({
      'x-ai-day-used': String(used),
      'x-ai-day-limit': String(limit),
      'x-ai-users': String(users),
    })

    let quota
    try {
      quota = await readQuota(env, ip)
    } catch {
      quota = { userKey: null, used: 0, perUserLimit: Number.MAX_SAFE_INTEGER, totalUsers: 1 }
    }

    if (quota.used >= quota.perUserLimit) {
      return json(
        { error: 'daily-limit', used: quota.used, limit: quota.perUserLimit, users: quota.totalUsers },
        429,
        quotaHeaders(quota.used, quota.perUserLimit, quota.totalUsers)
      )
    }

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
      if (quota.userKey) {
        await env.AI_LIMITS.put(quota.userKey, String(quota.used + 1)).catch(() => {})
      }
      return json(
        { choices: [{ message: { role: 'assistant', content } }] },
        200,
        quotaHeaders(quota.used + 1, quota.perUserLimit, quota.totalUsers)
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (/free|quota|limit|exceeded|insufficient/i.test(msg)) {
        return json({ error: 'quota', detail: 'Workers AI quota exhausted' }, 429)
      }
      return json({ error: 'ai-error', detail: msg.slice(0, 300) }, 500)
    }
  },
}