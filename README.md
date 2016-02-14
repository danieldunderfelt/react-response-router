React-response
===

React-router response handler
---

This package provides a React-router-integrated response handler for [React-response](https://github.com/danieldunderfelt/react-response). It is built to integrate with React-response, but there's actually nothing here that stops it from being used in vanilla servers. The only (peer)dependency is React-router.

This readme assumes that you are somewhat familiar with React-response.

### How to use it

When you have a React-response server build set up, simply import `createReactRouterResponse` from this package and call it with your React-router route config. Then give the returned function to the `<Response />` component of React-response as the `handler` prop. Like this:

```javascript
// In your React-response server setup:
<Response template={ Html } handler={ createReactRouterResponse(routes) }>
    {(renderProps, req, res) => {
        return { component: ReactDOM.renderToString(
            <RouterContext { ...renderProps } />
        ) }
    }}
</Response>

```

Make sure to render `<RouterContext />` from React-router with the `renderProps`. Consult [the documentation](https://github.com/reactjs/react-router/blob/latest/docs/guides/ServerRendering.md) of React-router for more information.

The above can also be accomplished like this:

```javascript

<Response template={ Html } handler={ createReactRouterResponse(routes) }>
    <RouterContext />
</Response>

```

Note that `<RouterContext />` will dislike being called without its renderProps. This is a one-time warning when you start the server and will not impede the functionality of your app.

# Test and build

This project uses Tape and Sinon for testing and Gulp as its build system. Run the test suite with `gulp test`. Build the package with `gulp build`

# Collaboration

PR's welcome! Please add tests for all changes and follow the general coding style. Semicolons are banned ;)

Please send all issues to [React-response's issue tracker](https://github.com/danieldunderfelt/react-response/issues).