import {
    match
} from 'react-router'
import fetchComponentData from '../../shared/utils/fetchComponentData'

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

export function coRouterMatch(routes, location, view, store) {
    if (arguments.length < 2 && arguments[0]) {
        let {
            routes,
            location,
            view,
            store
        } = this.arguments
    }

    return new Promise((resolve, reject) => {
        match({
            routes,
            location
        }, (error, redirectLocation, renderProps) => {

            if (error) {
                error.status
                reject(error)
            }

            if (redirectLocation) {
                let responseValue = {
                    type: 'redirection',
                    url: redirectLocation.pathname + redirectLocation.search
                }
                resolve(responseValue)
            }

            if (renderProps == null) {
                let error = {
                    message: 'Not Found',
                    status: 404
                }
                reject(error)
            }

            fetchComponentData(store.dispatch, renderProps.components, renderProps.params).then(() => {
                const initView = renderToString((
                    <Provider store={store}>
                        <RouterContext {...renderProps} />
                    </Provider>
                ))

                let state = JSON.stringify(store.getState())

                let page = renderFullPage(initView, state)

                let responseValue = {
                    type: 'html',
                    page
                }

                resolve(responseValue)
            })

        })
    })
}