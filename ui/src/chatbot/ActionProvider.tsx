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

interface HistoryItem {
    role: string,
    content: string | null,
    function_call?: {
        name: string,
        arguments: string,
    } | undefined,
}

const ActionProvider: FunctionComponent<ActionProviderProps> = ({createChatBotMessage, setState, children}) => {
    const history = useRef<HistoryItem[]>([]);

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
        const {answer} = (await botResponse.json()) as { answer: HistoryItem };
        history.current.push(answer);

        if (answer.function_call) {
            chatBotMessage.message = 'Function call';
        } else {
            chatBotMessage.message = answer.content;
        }
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
