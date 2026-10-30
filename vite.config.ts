import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

/* Serves /api/portfolio-chat during `npm run dev` by loading the same
   chat core the Vercel function uses. In production, api/portfolio-chat.ts
   handles it as a serverless function. */
function portfolioChatDev(): Plugin {
  return {
    name: 'portfolio-chat-dev',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(
        '/api/portfolio-chat',
        async (req: IncomingMessage, res: ServerResponse) => {
          const send = (status: number, body: unknown) => {
            res.statusCode = status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(body))
          }
          if (req.method !== 'POST') {
            send(405, { error: 'Method not allowed' })
            return
          }
          try {
            const chunks: Buffer[] = []
            for await (const chunk of req) chunks.push(chunk as Buffer)
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
            const mod = await server.ssrLoadModule('/src/lib/chatCore.ts')
            const result = await mod.handleChatRequest(body, req.socket.remoteAddress ?? 'dev')
            send(result.status, result.body)
          } catch (error) {
            console.error('portfolio-chat dev middleware error:', error)
            send(500, { error: 'The portfolio assistant is temporarily unavailable.' })
          }
        },
      )
    },
  }
}

/* Serves /api/visitor-count during `npm run dev` with an in-memory count, so
   browsing localhost never touches the real visitor counter. */
function visitorCountDev(): Plugin {
  let localCount = 0
  return {
    name: 'visitor-count-dev',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/api/visitor-count', (req: IncomingMessage, res: ServerResponse) => {
        res.setHeader('Content-Type', 'application/json')
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }
        res.end(JSON.stringify({ count: ++localCount }))
      })
    },
  }
}

/* Serves /api/track and /api/stats during `npm run dev` using the same funnel
   core as the Vercel functions. Dev data is stored under a separate
   "funnel-dev" prefix, and the stats key for local dev is "local". */
function funnelDev(): Plugin {
  return {
    name: 'funnel-dev',
    configureServer(server: ViteDevServer) {
      const route = (path: string, method: string, run: (mod: any, req: IncomingMessage, body: unknown) => Promise<{ status: number; body: unknown }>) =>
        server.middlewares.use(path, async (req: IncomingMessage, res: ServerResponse) => {
          const send = (status: number, body: unknown) => {
            res.statusCode = status
            if (body === null) return void res.end()
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(body))
          }
          if (req.method !== method) return send(405, { error: 'Method not allowed' })
          try {
            const chunks: Buffer[] = []
            for await (const chunk of req) chunks.push(chunk as Buffer)
            const text = Buffer.concat(chunks).toString('utf8')
            const mod = await server.ssrLoadModule('/src/lib/funnelCore.ts')
            const result = await run(mod, req, text ? JSON.parse(text) : {})
            send(result.status, result.body)
          } catch (error) {
            console.error(path + ' dev middleware error:', error)
            send(500, { error: 'Unavailable.' })
          }
        })
      route('/api/track', 'POST', (mod, req, body) => mod.handleTrack(body, req.headers, req.socket.remoteAddress ?? 'dev'))
      route('/api/stats', 'GET', (mod, req) => mod.handleStats(req.headers))
    },
  }
}

export default defineConfig(({ mode }) => {
  // Make GROQ_API_KEY / GROQ_MODEL from .env.local visible to the dev middleware.
  const env = loadEnv(mode, process.cwd(), '')
  // "undefined" guards against a stringified undefined left over from an
  // in-process config reload — process.env coerces every assignment to string.
  const stale = (v?: string) => !v || v === 'undefined'
  if (stale(process.env.GROQ_API_KEY)) process.env.GROQ_API_KEY = env.GROQ_API_KEY ?? ''
  if (stale(process.env.GROQ_MODEL)) process.env.GROQ_MODEL = env.GROQ_MODEL ?? ''
  if (stale(process.env.KV_REST_API_URL)) process.env.KV_REST_API_URL = env.KV_REST_API_URL ?? ''
  if (stale(process.env.KV_REST_API_TOKEN)) process.env.KV_REST_API_TOKEN = env.KV_REST_API_TOKEN ?? ''

  return {
    base: '/',
    build: { outDir: 'dist' },
    plugins: [portfolioChatDev(), visitorCountDev(), funnelDev()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: { port: 5173, strictPort: true },
  }
})
