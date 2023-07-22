import express from 'express';
import {chatbot} from "./chatbot";
import bodyParser from "body-parser";

const port = 8080;
const app = express();

app.get('/', (_, res) => {
    res.send('Hello');
});

app.use('/api', bodyParser.json());
app.post('/api/chatbot', chatbot);

app.listen(port, () => console.log(`Ready to process request on port ${port}`));
