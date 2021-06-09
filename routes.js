//require returns a function, and invoke this automatically upon requiring/importing
const routes = require('next-routes')();

//dynamic routing
//: denotes wildcard - whatever comes after will be a variable 
routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:address', '/campaigns/show')
    .add('/campaigns/:address/requests', '/campaigns/requests/index')
    .add('/campaigns/:address/requests/new', '/campaigns/requests/new');

module.exports = routes;
//routes object allow to automatically navigate users around the app, and generate linked tags to display inside of React components as well