import {FunctionComponent} from "react";
import Wallet from "./wallet/Wallet";
import MyChatbot from "./chatbot/MyChatbot";
import SafeWidget from './safe/SafeWidget';

const App: FunctionComponent = () => {
    return (
        <>
            <SafeWidget/>
            <p/>
            <MyChatbot/>
            <p/>
            <Wallet/>
            <p/>
            

        </>
    );
}

export default App;
