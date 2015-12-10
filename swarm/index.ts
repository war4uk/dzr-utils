import express = require('express');

let app = express();
app.disable('etag');//disable cache
console.log(__dirname);
app.use('/swarm', express.static(__dirname + '/wwwroot'));

var server = app.listen(1986, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});


app.get('/', function (req, res) {
  res.send('Hello World!');
});
