import express = require('express');
import path = require('path');

let app = express();
app.disable('etag');//disable cache
console.log(__dirname);
let t = path.join(__dirname, '../swarm_client');
app.use('/wwwroot', express.static(t));

let server = app.listen(1986, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

let state = {
    Teams: [{
        Name: "Headset",
        Code: "4576"
    }],
    Codes: [{
        Value: "heyhey",
        IsTaken: false,
        NameOfTeamTook: ""
    }]
};

app.get('/data', function(req, res) {
    if (req.query.pass === "test") {
        res.send(state);
    } else {
        res.status(401);
        res.send('Unauthorized');
    }
});

app.get('/checkCode', function(req, res) {
    let result = false;
    state.Codes.forEach((code) => {
        if (code.Value === req.query.code && !code.IsTaken) {
            code.IsTaken = true;
            result = true;
        }
    });

    res.send({result: result});
});

app.get('/reset', function(req, res) {
    state.Codes.forEach((code) => {
        code.IsTaken = false;
    });

    res.send(true);
});
