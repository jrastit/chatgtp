import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';
import Chatbot, {createChatBotMessage} from "react-chatbot-kit";
import 'react-chatbot-kit/build/main.css'

const config = {
    botName: 'BlockGTP',
    initialMessages: [createChatBotMessage(`Hi! I'm BlockGPT, your wallet assistant, how can I help you ?`, {})],
};

const MyChatbot= () => {
    return (
        <div>
            <Chatbot
                config={config}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
            />
        </div>
    );
};

export default MyChatbot;
