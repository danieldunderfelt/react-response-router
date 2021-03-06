import { match } from 'react-router'

export default (routes, matcher) => (renderTemplate, renderApp) => (req, res) => {
    // Enable mocking
    const matcherFunc = typeof matcher !== "undefined" ? matcher : match

    matcherFunc({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if(error) {
            res.status(500).send(error.message)
        } else if(redirectLocation) {
            res.status(301).redirect(redirectLocation.pathname + redirectLocation.search)
        } else if(renderProps) {
            renderTemplate(renderApp(renderProps, req, res), res)
        } else {
            res.status(404).send('Not found')
        }
    })
}