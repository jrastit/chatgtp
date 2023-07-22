import {RequestHandler} from "express-serve-static-core";
import {Configuration, OpenAIApi} from 'openai';
import * as fs from 'fs';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const walletAssistantPrompt = fs.readFileSync('prompt/wallet-assistant.txt', 'utf-8');

export const chatbot: RequestHandler = async (req, res) => {
    const messages = req.body.messages;

    try {
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: walletAssistantPrompt},
                ...messages,
            ],
        });

        const answer = chatCompletion.data.choices[0].message?.content;

        res.json({answer});
    } catch (error: any) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
        res.status(500);
    }
}