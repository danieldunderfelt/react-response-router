import test from 'tape'
import sinon from 'sinon'
import routerResponse from '../src/reactRouterResponse'

test('Factory returns a function which returns an Express middleware', t => {
    const rrResponse = routerResponse({}, sinon.stub())

    t.equal(typeof rrResponse, "function", 'The factory returns a function...')
    t.equal(rrResponse.length, 2, '... Which takes two arguments...')

    const routeHandler = rrResponse(sinon.stub(), sinon.stub())

    t.equal(typeof routeHandler, "function", '... and returns a route handler...')
    t.equal(routeHandler.length, 2, '... which also takes two arguments.')

    t.end()
})

test('The request handler runs the renderFunction and the renderResponse', t => {
    const renderFunction = sinon.stub()
    renderFunction.returns("derp") // because of course it should return "derp".

    const renderResponse = sinon.stub()

    const req = { url: 'http://example.com' }
    const res = "res"

    const matcher = sinon.spy((matchConfig, cb) => cb(false, false, "renderProps"))
    const routes = "routes"

    const rrResponse = routerResponse(routes, matcher)
    const routeHandler = rrResponse(renderResponse, renderFunction)

    routeHandler(req, res)

    t.ok(matcher.calledWith({ routes, location: 'http://example.com' }, sinon.match.func), 'Matcher was called with the correct arguments.')
    t.ok(renderFunction.calledBefore(renderResponse), 'renderFunction was called before renderResponse')
    t.ok(renderFunction.calledWithExactly("renderProps", req, res), 'renderFunction called with the correct arguments')
    t.ok(renderResponse.calledWithExactly("derp", res), 'renderResponse called with renderFunction result and response object')

    t.end()
})

test('Response returns 301 on a redirect and does not run the rest', t => {
    const renderFunction = sinon.stub()
    const renderResponse = sinon.stub()

    const matcher = sinon.spy((matchConfig, cb) => cb(false, {
        pathname: 'derp',
        search: 'herp'
    }, "renderProps"))

    const routes = "routes"

    const res = { status() {}, send() {}, redirect() {} }
    const resStatusSpy = sinon.stub(res, 'status')
    resStatusSpy.returns(res)

    const resSendSpy = sinon.stub(res, 'send')
    const resRedirSpy = sinon.stub(res, 'redirect')

    const req = "req"

    const rrResponse = routerResponse(routes, matcher)
    const routeHandler = rrResponse(renderResponse, renderFunction)

    routeHandler(req, res)

    t.ok(resStatusSpy.calledWithExactly(301), 'The response status was set to 301')
    t.ok(resRedirSpy.calledWithExactly("derpherp"), 'The response was redirected to the specified location.')
    t.equals(resSendSpy.callCount, 0, 'The response was never sent')
    t.equals(renderFunction.callCount, 0, 'The renderFunction was never called')
    t.equals(renderResponse.callCount, 0, 'renderResponse was never called')

    t.end()
})

test('Response returns 500 on error and does not run the rest', t => {
    const renderFunction = sinon.stub()
    const renderResponse = sinon.stub()

    const matcher = sinon.spy((matchConfig, cb) => cb({
        message: "u don derped"
    }, false, "renderProps"))

    const routes = "routes"

    const res = { status() {}, send() {}}
    const resStatusSpy = sinon.stub(res, 'status')
    resStatusSpy.returns(res)

    const resSendSpy = sinon.stub(res, 'send')

    const req = "req"

    const rrResponse = routerResponse(routes, matcher)
    const routeHandler = rrResponse(renderResponse, renderFunction)

    routeHandler(req, res)

    t.ok(resStatusSpy.calledWithExactly(500), 'The response status was set to 500')
    t.ok(resSendSpy.calledWithExactly("u don derped"), 'The error was sent as the response')
    t.equals(renderFunction.callCount, 0, 'The renderFunction was never called')
    t.equals(renderResponse.callCount, 0, 'renderResponse was never called')

    t.end()
})

test('Response returns 404 on null response from router and does not run the rest', t => {
    const renderFunction = sinon.stub()
    const renderResponse = sinon.stub()

    const matcher = sinon.spy((matchConfig, cb) => cb(false, false, null))
    const routes = "routes"

    const res = { status() {}, send() {} }
    const resStatusSpy = sinon.stub(res, 'status')
    resStatusSpy.returns(res)

    const resSendSpy = sinon.stub(res, 'send')

    const req = "req"

    const rrResponse = routerResponse(routes, matcher)
    const routeHandler = rrResponse(renderResponse, renderFunction)

    routeHandler(req, res)

    t.ok(resStatusSpy.calledWithExactly(404), 'The response status was set to 404')
    t.ok(resSendSpy.calledWithExactly('Not found'), 'Not found message was sent as the response')
    t.equals(renderFunction.callCount, 0, 'The renderFunction was never called')
    t.equals(renderResponse.callCount, 0, 'renderResponse was never called')

    t.end()
})