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

import { Router, RouterContext, match } from 'react-router';
import routes from '../common/routes/routing';

import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';

import promiseMiddleware from '../common/middlewares/PromiseMiddleware';
import combinedReducers from '../common/reducers';

const finalCreateStore = applyMiddleware(promiseMiddleware)( createStore );)

// Logger
app.use(logger())

// ToDo: Submodule render like
// delegate routes to react-router
app.use( function* () {
  
  const store = finalCreateStore(combinedReducers);

  // react-router
  let finalPage = yield match( {routes, location: this.url}, ( error, redirectLocation, renderProps ) => {

    if ( error )
      this.throw(500, error.message)

    if ( redirectLocation )
      this.redirect(redirectLocation.pathname + redirectLocation.search)
    
    if ( renderProps == null ) 
      this.throw(404, 'Not Found')


    const initView = renderToString((
	<Provider store={store}>
	<RouterContext {...renderProps} />
	</Provider>
    ))
    
      let state = JSON.stringify( store.getState() );

      let page = renderFullPage( initView, state )

      return page;

  })

  this.body = finalPage

  })
})


function renderFullPage(html, initialState) {
  return `
	<!doctype html>
	<html lang="utf-8">
	  <head>
		<title>Universal Redux Example</title>
		<link rel="shortcut icon" type="image/png" href="assets/images/react.png">
	  </head>
	  <body>
	  <div class="container">${html}</div>
		<script>window.$REDUX_STATE = ${initialState}</script>
		<script src="/js/bundle.js"></script>
	  </body>
	</html>
	`
}

// Serve static files
app.use(serve(path.join(__dirname, 'public')))

// Compress
app.use(compress())

if (!module.parent) {
  app.listen(3000)
  console.log('listening on port 3000')
}

export default app
