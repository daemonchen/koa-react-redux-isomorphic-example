'use strict'
import Koa from 'koa'
const app = Koa()

import compress from 'koa-compress'
import logger from 'koa-logger'
import serve from 'koa-static'
import path from 'path'

// Logger
app.use(logger())

// Serve static files
app.use(serve(path.join(__dirname, 'public')))

// Compress
app.use(compress())

if (!module.parent) {
  app.listen(3000)
  console.log('listening on port 3000')
}

export default app
