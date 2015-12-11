interface ITeam {
    Name: string,
    Code: string
}
interface ICode {
    Value: string,
    IsTaken: boolean,
    NameOfTeamTook: string
}

import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import storage = require('node-persist');

let app = express();
let t = path.join(__dirname, '../swarm_client');
let jsonParser = bodyParser.json({
    strict: true
});

let adminPass = "dzrKOPAIrulez";
let prequelCode = "КодОтПриквела";

app.disable('etag');//disable cache
app.use('/wwwroot', express.static(t));
storage.initSync();

let server = app.listen(1986, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});

let state: {
    Teams: ITeam[],
    Codes: ICode[]
};

state = storage.getItemSync('state');

if (!state) {
    state = {
        Teams: [],
        Codes: []
    };
}

let persistState = () => {
    storage.setItemSync('state', state);
}


app.get('/data', function(req, res) {
    if (req.query.pass === adminPass) {
        res.send(state);
    } else {
        res.status(401);
        res.send('Unauthorized');
    }
});

let testIfHasTookCode = (team: ITeam): boolean => {
    for (let i = 0; i < state.Codes.length; i++) {
        let code = state.Codes[i];

        if (code.IsTaken && code.NameOfTeamTook === team.Name) {
            return true;
        }
    }
    return false;
}

let getTeamByPin = (teams: ITeam[], pin: string): ITeam => {
    for (let i = 0; i < teams.length; i++) {
        let team = teams[i];
        if (team.Code === pin) {
            return team;
        }
    }

    return null;
}

app.get('/checkCode', function(req, res) {
    let result = false;
    let tookTeam = "";
    let alreadyTookByYou = false;
    if (!!req.query.code && !!req.query.pin) {
        let team = getTeamByPin(state.Teams, req.query.pin);

        if (!testIfHasTookCode(team)) {
            let teamName = getTeamByPin(state.Teams, req.query.pin).Name;

            for (let i = 0; i < state.Codes.length; i++) {
                let code = state.Codes[i];

                if (code.Value === req.query.code) {
                    if (!code.IsTaken) {
                        code.IsTaken = true;
                        code.NameOfTeamTook = teamName;
                        result = true;
                    } else {
                        result = false;
                        let tookByThisTeam = code.NameOfTeamTook === teamName;
                        if (!tookByThisTeam) {
                            tookTeam = code.NameOfTeamTook;
                        } else {
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

app.get('/checkPin', function(req, res) {
    var team = getTeamByPin(state.Teams, req.query.pin);


    if (!team) {
        res.status(401);
        res.send('Unauthorized');
    } else {
        res.send({ name: team.Name, hasTookCode: testIfHasTookCode(team), prequelCOde: prequelCode });
    }
})

app.get('/reset', function(req, res) {
    if (req.query.pass === adminPass) {
        res.status(401);
        res.send('Unauthorized');
    }

    state.Codes.forEach((code) => {
        code.IsTaken = false;
        code.NameOfTeamTook = "";
    });

    persistState();
    res.send(true);
});


app.post('/saveData', jsonParser, function(req, res) {
    if (req.query.pass === adminPass) {
        state = req.body;
        persistState();
        res.send(true);
    } else {
        res.status(401);
        res.send('Unauthorized');
    }

});
