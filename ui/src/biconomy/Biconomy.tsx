import '@biconomy/web3-auth/dist/src/style.css'
import { useState, useEffect, useRef } from 'react'
import SocialLogin from "@biconomy/web3-auth"
import { ethers } from 'ethers'
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccount,BiconomySmartAccountConfig, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { IPaymaster, BiconomyPaymaster,} from '@biconomy/paymaster'
import Gold from './Components/Gold';
import { IBiconomy, IContext, IWallet } from '../type/blockchain';
import { Button } from 'react-bootstrap';

interface Props {
  context: IContext
  chainId: number
  setContext: (context: IContext) => void
}

const Biconomy: React.FC<Props> = (
  {context, chainId, setContext}) => {
  const [interval, enableInterval] = useState(false)
  const sdkRef = useRef<SocialLogin | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const bundler: IBundler = new Bundler({
    bundlerUrl: 'https://bundler.biconomy.io/api/v2/'+chainId+'/abc', // you can get this value from biconomy dashboard.     
    chainId: chainId,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })
  
  const paymaster: IPaymaster = new BiconomyPaymaster({
    paymasterUrl: 'https://paymaster.biconomy.io/api/v1/'+chainId+'/vVbbCsVEp.14ff71ef-c84f-4684-ae2e-2d5a8adf5877' 
  })

  useEffect(() => {
    let configureLogin:any
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current?.provider) {
          setupSmartAccount()
          clearInterval(configureLogin)
        }
      }, 1000)
    }
  }, [interval])

  async function login() {
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin()
      const signature1 = await socialLoginSDK.whitelistUrl("http://127.0.0.1:5173/")
      await socialLoginSDK.init({
        chainId: ethers.utils.hexValue(chainId).toString(),
        network: "testnet",
        whitelistUrls: {
          "http://127.0.0.1:5173/": signature1,
        }
      })
      sdkRef.current = socialLoginSDK
    }
    if (!sdkRef.current.provider) {
      sdkRef.current.showWallet()
      enableInterval(true)
    } else {
      setupSmartAccount()
    }
  }

  async function setupSmartAccount() {
    if (!sdkRef?.current?.provider) return
    sdkRef.current.hideWallet()
    setLoading(true)
    const web3Provider = new ethers.providers.Web3Provider(
      sdkRef.current.provider
    )
    
    try {
      const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
        signer: web3Provider.getSigner(),
        chainId: chainId,
        bundler: bundler,
        paymaster: paymaster
      }
      let biconomySmartAccount : any = new BiconomySmartAccount(biconomySmartAccountConfig)
      biconomySmartAccount =  await biconomySmartAccount.init()
      console.log("owner: ", biconomySmartAccount.owner)
      console.log("address: ", await biconomySmartAccount.getSmartAccountAddress())
      console.log("deployed: ", await biconomySmartAccount.isAccountDeployed( await biconomySmartAccount.getSmartAccountAddress()))

      context.getBlockchain(chainId).walletList.push(new IWallet(biconomySmartAccount.address, "Biconomy", {
        smartAccount: biconomySmartAccount,
        provider: web3Provider,
      }))
      setContext(context)
      setLoading(false)
    } catch (err) {
      console.log('error setting up smart account... ', err)
    }
  }

  const logout = async () => {
    if (!sdkRef.current) {
      console.error('Web3Modal not initialized.')
      return
    }
    await sdkRef.current.logout()
    sdkRef.current.hideWallet()
    const wallet = context.getBlockchain(chainId).getWalletByType("Biconomy")
    context.getBlockchain(chainId).walletList = context.getBlockchain(chainId).walletList.filter((w) => w.address !== wallet?.address)
    setContext(context)
    enableInterval(false)
  }
  
  let biconomyWallet = null
  let walletAddress = null
  try {
    biconomyWallet = context.getBlockchain(chainId).getWalletByType("Biconomy")
    walletAddress = biconomyWallet.address
  } catch (error) {

  }
  

  return (
    <div>
      <h3>Biconomy Smart Accounts</h3>
      {
        !biconomyWallet && !loading && <Button onClick={login}>Login</Button>
      }
      {
        loading && <p>Loading account details...</p>
      }
      {
        !!walletAddress && (
          <div className="buttonWrapper">
            <p>{walletAddress}</p>
            <p><Gold walletAddress={walletAddress} context={context} chainId={chainId}/></p>
            <p><Button onClick={logout}>Logout</Button></p>
          </div>
        )
      }
    </div>
  )
}

export default Biconomy;


