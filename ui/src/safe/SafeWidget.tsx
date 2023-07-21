import { Button } from "react-bootstrap"
import { web3AuthModalPack } from "./safe"

const SafeWidget= () => {

    const openSafe = () => {
        web3AuthModalPack.signIn()
    }

    return (
        <div>
            <Button onClick={() => openSafe()}>Login</Button>
        </div>
    );
};

export default SafeWidget;