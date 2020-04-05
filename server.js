var express = require('express');
var app = express();
var db = require('./baseControll');

app.use(express.static('public'));
app.use(express.json());

app.get('/api/direct/:type', (req, res) => {
    console.log('got a direct');
    console.log(req.path);
    console.log(req.params);
    console.log(req.query);
    db.handleG(req.params.type, req.query, function (err, ret) {
        if(err) res.status(304).send(err);
        else    res.status(200).json(ret);
    });
});

app.get('/api/:sourceType', (req, res) => {
    console.log('got a get');
    console.log(req.path);
    console.log(req.params);
    db.getAllData(req.params.sourceType, function (err, ret) {
        if(err) res.status(304).send(err);
        else    res.status(200).json(ret);
    });
});

app.post('/api/direct', (req, res) => {
    console.log('got a direct');
    console.log(req.path);
    console.log(req.params);
    console.log(req.body);
    db.handleP(req.body, function (err) {
        if(err) {
            console.log(err);
            res.status(404).send();
        }
        else res.status(201).send();
    })
});

app.post('/api/del/:sourceType', (req, res) => {
    console.log('got a post to del');
    console.log(req.path);
    console.log(req.params);
    console.log(req.body);
    db.delRecord(req.params.sourceType, req.body, function (err) {
        if(err) res.status(404).send();
        else res.status(201).send();
    })
});

app.post('/api/:sourceType', (req, res) => {
    console.log('got a post');
    console.log(req.path);
    console.log(req.params);
    console.log(req.body);
    db.addRecord(req.params.sourceType, req.body, function (err) {
        if(err) res.status(404).send();
        else res.status(201).send();
    })
});

app.listen(8080, function() {
    console.log('server is running');
});

