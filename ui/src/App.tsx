import {FunctionComponent} from "react";
import Wallet from "./wallet/Wallet";
import MyChatbot from "./chatbot/MyChatbot";

const App: FunctionComponent = () => {
    return (
        <>
            <MyChatbot/>
            <p/>
            <Wallet/>
        </>
    );
}

export default App;
