type Context = string
type Data = Record<string, unknown>

function log(level: 'info' | 'warn' | 'error', ctx: Context, data?: Data) {
  const entry = { level, ctx, ts: new Date().toISOString(), ...(data || {}) }
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry))
}

export const logger = {
  info: (ctx: Context, data?: Data) => log('info', ctx, data),
  warn: (ctx: Context, data?: Data) => log('warn', ctx, data),
  error: (ctx: Context, data?: Data) => log('error', ctx, data)
}