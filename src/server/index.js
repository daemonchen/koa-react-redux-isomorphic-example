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

import { Router, RouterContext, match } from 'react-router'
import routes from '../shared/routes';

import { applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux';

import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import combinedReducers from '../shared/reducers'

import fetchComponentData from '../shared/utils/fetchComponentData'
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
  let finalPage = yield routerMatch(routes, this.url, store)

  this.body = finalPage

})

// ToDo: submodule of this
function routerMatch(routes, location, store) {
  return new Promise((resolve, reject) => {
    match( {routes, location: location}, ( error, redirectLocation, renderProps ) => {

      if ( error ){
        error.status
        reject(error)
      }

      if ( redirectLocation ){
        let responseValue = {type: 'redirection', url: redirectLocation.pathname + redirectLocation.search}
        resolve(responseValue)
      }

      if ( renderProps == null ){
        let error = {message: 'Not Found', status: 404}
        reject(error)
      }

      fetchComponentData( store.dispatch, renderProps.components, renderProps.params)

      const initView = renderToString((
	  <Provider store={store}>
	  <RouterContext {...renderProps} />
	  </Provider>
      ))

      let state = JSON.stringify( store.getState() );

      let page = renderFullPage( initView, state )

      resolve(page);

    })
  })
}

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

// Compress
app.use(compress())

if (!module.parent) {
  app.listen(3000)
  console.log('listening on port 3000')
}

export default app
