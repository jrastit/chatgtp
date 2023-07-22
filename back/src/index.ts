import express from 'express';
import {chatbot} from "./chatbot";
import bodyParser from "body-parser";

const port = 8080;
const app = express();


app.use('/api', bodyParser.json());
app.post('/api/chatbot', chatbot);

app.get('*', express.static('../ui/build/', { cacheControl: true, maxAge: 7 * 24 * 3600 * 1000 }));

app.listen(port, () => console.log(`Ready to process request on port ${port}`));
