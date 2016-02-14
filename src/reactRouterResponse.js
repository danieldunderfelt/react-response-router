import { match } from 'react-router'

export default (routes, matcher) => (renderResponse, renderFunction) => (req, res) => {
    // Enable mocking
    const matcherFunc = typeof matcher !== "undefined" ? matcher : match

    matcherFunc({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if(redirectLocation) {
            res.status(301).redirect(redirectLocation.pathname + redirectLocation.search)
        } else if(error) {
            res.status(500).send(error.message)
        } else if(renderProps === null) {
            res.status(404).send('Not found')
        } else {
            renderResponse(renderFunction(renderProps, req, res), res)
        }
    })
}