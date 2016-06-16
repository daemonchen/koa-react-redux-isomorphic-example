'use strict'

import Koa from 'koa'
const app = Koa()

import compress from 'koa-compress'
import logger from 'koa-logger'
import serve from 'koa-static'
import path from 'path'

// React-redux dependencies
import React from 'react'
import { renderToString } from 'react-dom/server'

import { Router, RouterContext } from 'react-router'
import routes from '../shared/routes';

import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux';

import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import combinedReducers from '../shared/reducers'

import { coRouterMatch } from './utils'

const finalCreateStore = applyMiddleware(promiseMiddleware, thunkMiddleware)( createStore )

// Logger
app.use(logger())

// Serve static files
app.use(serve(path.join(__dirname, 'public')))

// ToDo: Submodule render like
// delegate routes to react-router
app.use( function* () {

  const store = finalCreateStore(combinedReducers)

  // react-router
  let finalPage = yield coRouterMatch(routes, this.url, store)

  this.body = finalPage

})

// Compress
app.use(compress())

if (!module.parent) {
  app.listen(3000)
  console.log('listening on port 3000')
}

export default app
