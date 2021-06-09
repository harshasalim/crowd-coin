const { createServer } = require('http');
const next = require('next');

const app = next({
    //Configuration object
    //to specify whether running in production/development mode
    dev: process.env.NODE_ENV !== 'production'
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

//Set up app and tell it to listen to a specific port
app.prepare().then(() => {
    createServer(handler).listen(3000, (err) => {
        if (err) throw err;
        console.log('Ready on localhost:3000');
    });
});