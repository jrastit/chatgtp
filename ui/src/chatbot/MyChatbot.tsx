import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import Chatbot, {createChatBotMessage} from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css'
import ActionWidget from "./ActionWidget";
import IConfig from "react-chatbot-kit/src/interfaces/IConfig";

const config: IConfig = {
    botName: 'BlockGTP',
    initialMessages: [createChatBotMessage(`Hi! I'm BlockGPT, your wallet assistant, how can I help you ?`, {})],
    widgets: [
        {
            widgetName: 'actionWidget',
            widgetFunc: (props: any) => <ActionWidget {...props} />,
            mapStateToProps: ['functionCall', 'test'],
            props: undefined,
        },
    ],
};

const MyChatbot = () => {

    return (
        <>
            <Chatbot
                    config={config}
                    messageParser={MessageParser}
                    actionProvider={ActionProvider}
                    />


        </>

    );
};

export default MyChatbot;
