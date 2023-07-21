import {FunctionComponent} from "react";
<<<<<<< HEAD
import Wallet from "./wallet/Wallet";
import MyChatbot from "./chatbot/MyChatbot";
=======
import MyChatbot from './chatbot/MyChatbot';
import SafeWidget from './safe/SafeWidget';
>>>>>>> bf80e59 (add safe)

const App: FunctionComponent = () => {
    return (
        <>
<<<<<<< HEAD
            <MyChatbot/>
            <p/>
            <Wallet/>
=======
        <SafeWidget/>
        <MyChatbot/>
>>>>>>> bf80e59 (add safe)
        </>
    );
}

export default App;
