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

/* Serves /api/visitor-count during `npm run dev`. Uses the real Redis
   counter when KV_REST_API_URL / KV_REST_API_TOKEN are in .env.local,
   otherwise an in-memory count so the footer still renders locally. */
function visitorCountDev(): Plugin {
  let localCount = 0
  return {
    name: 'visitor-count-dev',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(
        '/api/visitor-count',
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
          const mod = await server.ssrLoadModule('/src/lib/visitorCore.ts')
          if (!mod.isCounterConfigured()) {
            send(200, { count: ++localCount })
            return
          }
          const result = await mod.incrementVisitorCount()
          send(result.status, result.body)
        },
      )
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
    plugins: [portfolioChatDev(), visitorCountDev()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: { port: 5173, strictPort: true },
  }
})
