import {FunctionComponent} from "react";
import Wallet from "./wallet/Wallet";
import MyChatbot from "./chatbot/MyChatbot";
import SafeWidget from './safe/SafeWidget';

const App: FunctionComponent = () => {
    return (
        <>
            <MyChatbot/>
            <p/>
            <Wallet/>
            <p/>
            <SafeWidget/>

        </>
    );
}

export default App;
