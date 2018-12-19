const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('express-ws')(app);

const Provider = require('./provider');
const provider = new Provider();

const node = require('./client.js');
node.start();
node.connectTo({address: '127.0.0.1', udpPort: 30303, tcpPort: 30303});

const Manager = require('./manager');
const _manager = new Manager(node, provider);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.ws('/', function(ws, _req) {
  ws.on('message', function(msg) {
    console.dir(msg);
    provider.sendAsync(JSON.parse(msg), (err, jsonResponse) => {
      if (err) {
        console.dir(err);
        ws.send({error: err});
      }
      console.dir(jsonResponse);
      ws.send(JSON.stringify(jsonResponse));
    });
  });
  provider.on('data', (result) => {
    // TODO: actually should only do this for subscribers.....
    console.dir("======================");
    console.dir("======================");
    console.dir("======================");
    console.dir("sending....");
    console.log(JSON.stringify(result));
    console.dir(result);
    ws.send(JSON.stringify(result));
    console.dir("======================");
    console.dir("======================");
    console.dir("======================");
  });
});

app.listen(8546, () => console.log('Murmur listening on port 8546!'));
