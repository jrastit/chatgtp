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

const SafeWidget: React.FC<Props> = (
    {context, chainId, setContext}) => {
    chainId = 5 // goerli override
    const [authKitSignData, setAuthKitSignData] = useState<any>(null)
    const [signer, setSigner] = useState<any>(null)
    const [safeSelected, setSafeSelected] = useState<string | null>(null)

    const openSafe = async () => {
        const authKitSignData = await web3AuthModalPack.signIn()
        
        if (authKitSignData.safes && authKitSignData.safes.length === 0) {
            const safes = authKitSignData.safes

            const provider = web3AuthModalPack.getProvider()

            if (provider) {
                const web3Provider = new ethers.providers.Web3Provider(provider)

                const signer = web3Provider.getSigner()

                const relayPack = new GelatoRelayPack()
                const safeAccountAbstraction = new AccountAbstraction(signer)

                await safeAccountAbstraction.init({relayPack})

                const hasSafes = safes.length > 0

                const safeSelected = hasSafes ? safes[0] : await safeAccountAbstraction.getSafeAddress()

                setAuthKitSignData(authKitSignData)
                setSafeSelected(safeSelected)
                setSigner(signer)

                context.getBlockchain(chainId).walletList.push(new IWallet(await signer.getAddress(), "Safe", {
                    provider: web3Provider,
                    signer: signer,

                }))
                setContext(context)

            } else {
                console.log('no provider')
            }

        } else {
            console.log('no safes')
        }
    }

    const createSafe = async () => {
        if (signer && safeSelected) {
            const ethAdapter = new EthersAdapter({
                ethers,
                signerOrProvider: signer,
            })
            /*
            const safe = await Safe.create({
                ethAdapter,
                safeAddress: safeSelected,
            })
            */

            const safeFactory = await SafeFactory.create({ethAdapter})


            const safeAccountConfig: SafeAccountConfig = {
                owners: [
                    await signer.getAddress(),
                ],
                threshold: 1,
                // ... (Optional params)
            }

            /* This Safe is tied to owner 1 because the factory was initialized with
            an adapter that had owner 1 as the signer. */
            const safeSdkOwner1 = await safeFactory.deploySafe({safeAccountConfig})

            const safeAddress = await safeSdkOwner1.getAddress()

            console.log('Your Safe has been deployed:')
            console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
            console.log(`https://app.safe.global/gor:${safeAddress}`)
        }

    }

    const closeSafe = async () => {
        await web3AuthModalPack.signOut()
        setAuthKitSignData(null)
        setSafeSelected(null)
        const wallet = context.getBlockchain(chainId).getWalletByType("Safe")
        context.getBlockchain(chainId).walletList = context.getBlockchain(chainId).walletList.filter((w) => w.address !== wallet?.address)
    }

    return (
        <div>
            {!authKitSignData &&
                <div><Button onClick={() => openSafe()}>Login with Safe</Button></div>
            }
            {authKitSignData &&
                <div><Button onClick={() => createSafe()}>createSafe</Button></div>
            }
            {authKitSignData &&
                <div><Button onClick={() => closeSafe()}>closeSafe</Button></div>
            }
        </div>
    );
};

export default SafeWidget;