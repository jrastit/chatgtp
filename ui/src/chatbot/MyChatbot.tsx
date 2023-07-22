import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import Chatbot, {createChatBotMessage} from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css'
import ActionWidget from "./ActionWidget";
import IConfig from "react-chatbot-kit/src/interfaces/IConfig";
import {IContext} from "../type/blockchain";
import {FunctionComponent} from "react";

interface MyChatbotProps {
    setContext: (context: IContext) => void,
    getContext: () => IContext,
}

const MyChatbot: FunctionComponent<MyChatbotProps> = ({setContext, getContext}) => {
    const config: IConfig = {
        botName: 'BlockGTP',
        initialMessages: [
            createChatBotMessage(`Hi! I'm BlockGPT, your wallet assistant`, {}),
            createChatBotMessage(`First you need to connect to your wallet`, {
                widget: 'actionWidget',
                payload: {
                    name: 'connectWallet',
                    arguments: '{}',
                },
            }),
        ],
        widgets: [
            {
                widgetName: 'actionWidget',
                widgetFunc: (props: any) => <ActionWidget {...props} />,
                mapStateToProps: ['functionCall'],
                props: {setContext, getContext},
            },
        ],
        state: {
            setContext,
            getContext,
        },
    };

    return (
        <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={(props: any) => <ActionProvider {...props} setContext={setContext}
                                                            getContext={getContext}/>}
        />
    );
};

export default MyChatbot;
