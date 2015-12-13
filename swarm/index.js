var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var storage = require('node-persist');
var app = express();
var t = path.join(__dirname, '../swarm_client');
var jsonParser = bodyParser.json({
    strict: true
});
var adminPass = "dzrKOPAIrulez";
app.disable('etag'); //disable cache
app.use('/wwwroot', express.static(t));
storage.initSync();
var server = app.listen(1986, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
var state;
state = storage.getItemSync('state');
if (!state) {
    state = {
        Teams: [],
        Codes: [],
        dzrCode: "код-заглушка " + new Date().getTime()
    };
}
var persistState = function () {
    storage.setItemSync('state', state);
};
app.get('/data', function (req, res) {
    if (req.query.pass === adminPass) {
        res.send(state);
    }
    else {
        res.status(401);
        res.send('Unauthorized');
    }
});
var testIfHasTookCode = function (team) {
    for (var i = 0; i < state.Codes.length; i++) {
        var code = state.Codes[i];
        if (code.IsTaken && code.NameOfTeamTook === team.Name) {
            return true;
        }
    }
    return false;
};
var getTeamByPin = function (teams, pin) {
    for (var i = 0; i < teams.length; i++) {
        var team = teams[i];
        if (team.Code === pin) {
            return team;
        }
    }
    return null;
};
app.get('/checkCode', function (req, res) {
    var result = false;
    var tookTeam = "";
    var alreadyTookByYou = false;
    if (!!req.query.code && !!req.query.pin) {
        var team = getTeamByPin(state.Teams, req.query.pin);
        if (!testIfHasTookCode(team)) {
            var teamName = getTeamByPin(state.Teams, req.query.pin).Name;
            for (var i = 0; i < state.Codes.length; i++) {
                var code = state.Codes[i];
                if (code.Value === req.query.code) {
                    if (!code.IsTaken) {
                        code.IsTaken = true;
                        code.NameOfTeamTook = teamName;
                        result = true;
                    }
                    else {
                        result = false;
                        var tookByThisTeam = code.NameOfTeamTook === teamName;
                        if (!tookByThisTeam) {
                            tookTeam = code.NameOfTeamTook;
                        }
                        else {
                            alreadyTookByYou = true;
                        }
                    }
                    break;
                }
            }
        }
        persistState();
    }
    res.send({ result: result, tookTeam: tookTeam, alreadyTookByYou: alreadyTookByYou });
});
app.get('/checkPin', function (req, res) {
    var team = getTeamByPin(state.Teams, req.query.pin);
    var hasTookCode = testIfHasTookCode(team);
    if (!team) {
        res.status(401);
        res.send('Unauthorized');
    }
    else {
        res.send({ name: team.Name, hasTookCode: hasTookCode, prequelCOde: hasTookCode ? state.dzrCode : "<error>" });
    }
});
app.get('/reset', function (req, res) {
    if (req.query.pass === adminPass) {
        res.status(401);
        res.send('Unauthorized');
    }
    state.Codes.forEach(function (code) {
        code.IsTaken = false;
        code.NameOfTeamTook = "";
    });
    persistState();
    res.send(true);
});
app.post('/saveData', jsonParser, function (req, res) {
    if (req.query.pass === adminPass) {
        state = req.body;
        persistState();
        res.send(true);
    }
    else {
        res.status(401);
        res.send('Unauthorized');
    }
});

//# sourceMappingURL=index.js.map
