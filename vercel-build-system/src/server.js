import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { logger } from './utils/logger.js'
import { errorHandler } from './middleware/errorHandler.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import healthRoutes from './routes/health.js'
import apiRoutes from './routes/api.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const server = createServer(app)

// Trust proxy for accurate IP detection behind load balancers
app.set('trust proxy', 1)

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.']
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })
)

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
)

// Compression middleware
app.use(
  compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false
      }
      return compression.filter(req, res)
    }
  })
)

// Rate limiting
app.use('/api', rateLimiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static file serving
app.use(
  express.static(join(__dirname, '../public'), {
    maxAge: '1y',
    etag: true,
    lastModified: true
  })
)

app.use(
  '/assets',
  express.static(join(__dirname, '../public/assets'), {
    maxAge: '1y',
    immutable: true
  })
)

app.use(
  '/static',
  express.static(join(__dirname, '../public/static'), {
    maxAge: '1h'
  })
)

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  })

  res.on('finish', () => {
    const duration = Date.now() - start
    logger.info(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`)
  })

  next()
})

// Health check endpoint (no auth required)
app.use('/api/health', healthRoutes)

// API routes
app.use('/api', apiRoutes)

// SPA fallback - serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'))
})

// Error handling middleware (must be last)
app.use(errorHandler)

// Graceful shutdown handling
const gracefulShutdown = signal => {
  logger.info(`Received ${signal}, shutting down gracefully...`)

  server.close(err => {
    if (err) {
      logger.error('Error during server shutdown:', err)
      process.exit(1)
    }

    logger.info('Server closed successfully')
    process.exit(0)
  })

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`)
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  logger.info(`🔗 Health check: http://localhost:${PORT}/api/health`)
})

export default app
