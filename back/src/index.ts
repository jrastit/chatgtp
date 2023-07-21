import express from 'express';

const app = express();

app.get('/', (_, res) => {
    res.send('Hello');
});

app.get('/api/test', (_, res) => {
    res.json({result: 'ok'});
});

app.listen(8080);
