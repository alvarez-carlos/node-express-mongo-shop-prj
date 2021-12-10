const http = require('http')
const app = require('./app')


// we can get the port thorugh an env variable or just hard coded it.
//On the server we are are going to deployy the apu, we can inject the env variable with the port. 
// however if it is not configured the defalt port will be 3000
const port = process.env.PORT || 3000;



// create the server 
// to create a server we need to pass a listener
// the listener is a function which is executed whenever we received a request abd return a response to the client.
const server = http.createServer(app);

// start the server. this server is going to listen in the port 3000 since we have not configured an env var and the default por tis 3000
server.listen(port)