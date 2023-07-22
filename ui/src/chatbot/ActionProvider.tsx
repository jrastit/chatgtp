import React, {cloneElement, FunctionComponent, ReactElement, useRef} from 'react';
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
    const history = useRef<{ role: string, content: string }[]>([]);

    const handleUserMessage: Actions['handleUserMessage'] = async (message: string) => {
        history.current.push({role: 'user', content: message});
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
                messages: history.current,
            }),
        });
        const {answer} = (await botResponse.json()) as { answer: string };
        history.current.push({role: 'assistant', content: answer});
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
