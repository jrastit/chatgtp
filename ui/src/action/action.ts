
import {  IHybridPaymaster,SponsorUserOperationDto, PaymasterMode,} from '@biconomy/paymaster'
import abi from "../utils/erc20Abi.json";
import { ethers } from "ethers";
import 'react-toastify/dist/ReactToastify.css';
import { IContext, IBiconomy, IWallet } from '../type/blockchain';
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import { MetaTransactionData, MetaTransactionOptions } from '@safe-global/safe-core-sdk-types'


let paymasterServiceData: SponsorUserOperationDto = {
    mode: PaymasterMode.SPONSORED,
    // optional params...
  };

export const mint_gold = async (amount: number, walletAddress: string | null, context: IContext, chainId: number) => {
    const wallet = context.getBlockchain(chainId).getDefaultWallet(walletAddress);
    const goldAddress = context.getBlockchain(chainId).getContract('Gold').address;
    const provider = wallet.wallet.provider;
    const contract = new ethers.Contract(goldAddress, abi.output.abi, provider);
    if (wallet.type === 'Biconomy') {
        return biconomy_mint_gold(amount, contract, goldAddress, wallet);
    } else if (wallet.type === 'Safe') {
        return safe_mint_gold(amount, contract, goldAddress, wallet);
    } else {
        throw new Error(`Wallet type ${wallet.type} not supported`)
    }
}

export const transfer_gold = async (amount: number, to: string, walletAddress: string | null, context: IContext, chainId: number) => {
    const wallet = context.getBlockchain(chainId).getDefaultWallet(walletAddress);
    const goldAddress = context.getBlockchain(chainId).getContract('Gold').address;
    const provider = wallet.wallet.provider;
    const contract = new ethers.Contract(goldAddress, abi.output.abi, provider);
    if (wallet.type === 'Biconomy') {
        return biconomy_transfer_gold(amount, to, contract, goldAddress, wallet);
    } else {
        throw new Error(`Wallet type ${wallet.type} not supported`)
    }
}

export const biconomy_transfer_gold = async (amount: number, to: string, contract:any, goldAddress: string, wallet:IWallet) => {
  console.log("Biconomy transfer gold", to, amount);
  const data = contract.interface.encodeFunctionData("transfer", [to, amount]);

  const tx1 = {
    to: goldAddress,
    data: data,
  };

  const bic = wallet.wallet

  let partialUserOp = await bic.smartAccount.buildUserOp([tx1]);


  try {
    console.log("Partial User Op:", partialUserOp);

    const biconomyPaymaster = bic.smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
    const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(partialUserOp, paymasterServiceData);
    partialUserOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
    console.log("Paymaster and data:", paymasterAndDataResponse.paymasterAndData);
    const userOpResponse = await bic.smartAccount.sendUserOp(partialUserOp);
    const transactionDetails = await userOpResponse.wait();

    console.log("Transaction Details:", transactionDetails);
    console.log("Transaction Hash:", userOpResponse.userOpHash);

    return userOpResponse;
  } catch (e) {
    console.error("Error executing transaction:", e);
    // ... handle the error if needed ...
  }
}

export const biconomy_mint_gold = async (amount: number, contract:any, goldAddress: string, wallet:IWallet) => {
  const data = contract.interface.encodeFunctionData("self_mint", [amount]);

  const tx1 = {
    to: goldAddress,
    data: data,
  };

  const bic = wallet.wallet

  let partialUserOp = await bic.smartAccount.buildUserOp([tx1]);


  try {
    console.log("Partial User Op:", partialUserOp);

    const biconomyPaymaster = bic.smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
    const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(partialUserOp, paymasterServiceData);
    partialUserOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
    console.log("Paymaster and data:", paymasterAndDataResponse.paymasterAndData);
    const userOpResponse = await bic.smartAccount.sendUserOp(partialUserOp);
    const transactionDetails = await userOpResponse.wait();

    console.log("Transaction Details:", transactionDetails);
    console.log("Transaction Hash:", userOpResponse.userOpHash);

    return userOpResponse;
  } catch (e) {
    console.error("Error executing transaction:", e);
    // ... handle the error if needed ...
  }
}


export const safe_mint_gold = async (amount: number, contract:any, goldAddress: string, wallet:IWallet) => {
      const data = contract.interface.encodeFunctionData("self_mint", [amount]);

      const tx1 = {
        to: goldAddress,
        data: data,
      };

      const safe_info = wallet.wallet

      const ethAdapter = new EthersAdapter({
        ethers,
        signerOrProvider: safe_info.signer || safe_info.provider
      })

      const safeSDK = await Safe.create({
        ethAdapter,
        safeAddress: safe_info.safeAddress
      })

      // Create a Safe transaction with the provided parameters
      const safeTransactionData: MetaTransactionData = {
        to: goldAddress,
        data: data,
        value: '0',
      }

      const safeTransaction = await safeSDK.createTransaction({ safeTransactionData })

      const isTxExecutable = await safeSDK.isValidTransaction(safeTransaction)

      if (isTxExecutable) {
        // Execute the transaction
        const txResponse = await safeSDK.executeTransaction(safeTransaction)
        const contractReceipt = await txResponse.transactionResponse?.wait()

        console.log('Transaction executed.')
        console.log('- Transaction hash:', contractReceipt?.transactionHash)
      } else {
        console.log('Transaction invalid. Transaction was not executed.')
      }
    }
  
