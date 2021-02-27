const express = require('express');
const app = express();
const DataStore = require('nedb');
const fetch = require('node-fetch');
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

app.listen(3000, () => {
    console.log('Listening at port 3000...');
});


const dataBase = new DataStore('database.db');
dataBase.loadDatabase();

app.post('/api', (req, res) => {
    const timestamp = Date.now();
    req.body.timestamp = timestamp;

    dataBase.insert(req.body);

    res.json(req.body);
});

app.get('/api', (req, res) => {
    dataBase.find({}, (err, data) => {
        if (err) {
            res.end();
            return;
        }
        res.send(data);
    });
});

app.get('/dbSearch', (req, res) => {
    const searchItem = req.query.SI;
    const searchType = req.query.ST;
    dataBase.find({$or: [{lat: `${searchItem}`}, {lon: `${searchItem}`}, {nameVal: `${searchItem}`}, {timestamp: `${searchItem}`}, {_id: `${searchItem}`}]}, (err, data) => {
        if (err) {
            res.end();
            return;
        }
        res.send(data);
    });
});

// In case api requires cors, make a new get method to the new endpoint (remember to install the node-fetch package)
// app.get('/weather', async (req, res) => {
// 
// const api_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=1bd8ce8dfcac55f8e10a4cf4d4f0243f`;
// const weather_url_response = await fetch(api_url);
// const jsonWeatherResponse = await weather_url_response.json();
// res.json(jsonWeatherResponse);
// });
