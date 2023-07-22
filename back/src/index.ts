import express from 'express';
import {chatbot} from "./chatbot";
import bodyParser from "body-parser";

const app = express();

app.get('/', (_, res) => {
    res.send('Hello');
});

app.use('/api', bodyParser.json());
app.post('/api/chatbot', chatbot);

app.listen(8080);
