import { MetaMaskSDK } from '@metamask/sdk';
import {Button} from "react-bootstrap"
import { IContext, IWallet } from "../type/blockchain";

interface Props {
    context: IContext
    chainId: number
    setContext: (context: IContext) => void
}


const startMetamask = async () => {

    const MMSDK = new MetaMaskSDK();

    const ethereum = MMSDK.getProvider();

    ethereum.request({ method: 'eth_requestAccounts', params: [] });
}


const Metamask: React.FC<Props> = ({context, chainId, setContext}) => {
    return (
        <div>
            <Button onClick={startMetamask}>Start Metamask</Button>
        </div>
    )
}

export default Metamask;

