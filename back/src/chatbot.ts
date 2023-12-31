import {RequestHandler} from 'express-serve-static-core';
import {Configuration, OpenAIApi} from 'openai';
import * as fs from 'fs';

const model = 'gpt-3.5-turbo';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const chatbot: RequestHandler = async (req, res) => {
    const messages = req.body.messages;
    console.log('================ Processing chatbot request ================');
    console.log(JSON.stringify({messages}));

    const chatbotPrompt = fs.readFileSync(`prompt/prompt.txt`, 'utf-8');
    const chatbotFunctions = JSON.parse(fs.readFileSync(`prompt/functions.json`, 'utf-8'));

    try {
        const chatCompletion = await openai.createChatCompletion({
            model,
            messages: [
                {role: 'system', content: chatbotPrompt},
                ...messages,
            ],
            functions: chatbotFunctions,
            function_call: 'auto',
        });

        const data = chatCompletion.data;
        console.log('================ Chatbot response received ================');
        console.log(JSON.stringify(data));

        const answer = data.choices[0].message;
        res.json({answer});
    } catch (error: any) {
        console.log('================= Chatbot error ================');
        console.error(error);
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
        res.status(500);
    }
}