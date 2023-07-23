import {Button} from "react-bootstrap"
import {useState} from "react";
import {ethers} from 'ethers'
import {EthersAdapter, SafeAccountConfig, SafeFactory} from '@safe-global/protocol-kit'
import AccountAbstraction from '@safe-global/account-abstraction-kit-poc'
import {GelatoRelayPack} from '@safe-global/relay-kit'
import { IContext, IWallet } from "../type/blockchain";
import { Web3AuthModalPack, Web3AuthConfig } from '@safe-global/auth-kit'
import { Web3AuthOptions } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'


// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#arguments
const options: Web3AuthOptions = {
  clientId: 'BEHwq7QPAl0ioHNRW0J3GcVC4y9XRsgdVCjGbris2CQkRjzTEXGjSZaTav4h1zLN-8_mt47Lzxl6aZ8oVr_JOSY', // https://dashboard.web3auth.io/
  web3AuthNetwork: 'testnet',
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x5',
    // https://chainlist.org/
    rpcTarget: 'https://rpc.ankr.com/eth_goerli'
  },
  uiConfig: {
    theme: 'dark',
    loginMethodsOrder: ['google', 'facebook']
  }
}

// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters
const modalConfig = {
  [WALLET_ADAPTERS.TORUS_EVM]: {
    label: 'torus',
    showOnModal: false
  },
  [WALLET_ADAPTERS.METAMASK]: {
    label: 'metamask',
    showOnDesktop: true,
    showOnMobile: false
  }
}

// https://web3auth.io/docs/sdk/pnp/web/modal/whitelabel#whitelabeling-while-modal-initialization
const openloginAdapter : any = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: 'mandatory'
  },
  adapterSettings: {
    uxMode: 'popup',
    whiteLabel: {
      name: 'Safe'
    }
  }
})

const web3AuthConfig: Web3AuthConfig = {
  txServiceUrl: 'https://safe-transaction-goerli.safe.global'
}



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

        // Instantiate and initialize the pack
        const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig)
        await web3AuthModalPack.init({ options, adapters: [openloginAdapter], modalConfig })

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
        //await web3AuthModalPack.signOut()
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