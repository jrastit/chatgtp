import { MetaMaskSDK } from '@metamask/sdk';
import {Button} from "react-bootstrap"
import {web3AuthModalPack} from "./safe"
import {useState} from "react";
import {ethers} from 'ethers'
import {EthersAdapter, SafeAccountConfig, SafeFactory} from '@safe-global/protocol-kit'
import AccountAbstraction from '@safe-global/account-abstraction-kit-poc'
import {GelatoRelayPack} from '@safe-global/relay-kit'
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

