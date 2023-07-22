import React, {cloneElement, FunctionComponent, ReactElement} from 'react';
import {IMessageOptions} from "react-chatbot-kit/src/interfaces/IMessages";

interface StateItem {
    [key: string]: any,
}

interface BotState {
    messages: StateItem[]
}

interface ActionProviderProps {
    createChatBotMessage: (message: string, options: IMessageOptions) => any,
    setState: (fun: (prev: BotState) => BotState) => void,
    children: ReactElement,
}

export interface Actions {
    handleUserMessage: (message: string) => Promise<void>;
}

const ActionProvider: FunctionComponent<ActionProviderProps> = ({createChatBotMessage, setState, children}) => {
    const handleUserMessage: Actions['handleUserMessage'] = async (message: string) => {
        const chatBotMessage = createChatBotMessage('', {loading: true});
        setState((prev) => ({
            ...prev,
            messages: [...prev.messages, chatBotMessage],
        }));

        const botResponse = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    {role: 'user', content: message},
                ],
            }),
        });
        const {answer} = (await botResponse.json()) as { answer: string };
        console.log(answer);
        chatBotMessage.message = answer;
        setState((prev) => ({...prev}));
    };

    return (
        <div>
            {React.Children.map(children, (child) => {
                return cloneElement(child, {
                    actions: {
                        handleUserMessage,
                    },
                });
            })}
        </div>
    );
};

export default ActionProvider;
