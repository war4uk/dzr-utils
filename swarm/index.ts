import express = require('express');
import path = require('path');

let app = express();
app.disable('etag');//disable cache
console.log(__dirname);
let t = path.join(__dirname, '../swarm_client');
app.use('/wwwroot', express.static(t));

var server = app.listen(1986, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


app.get('/', function (req, res) {
  res.send('Hello World!');
});
