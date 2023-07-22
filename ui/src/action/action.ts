
import {  IHybridPaymaster,SponsorUserOperationDto, PaymasterMode,} from '@biconomy/paymaster'
import abi from "../utils/erc20Abi.json";
import { ethers } from "ethers";
import 'react-toastify/dist/ReactToastify.css';
import { IContext, IBiconomy } from '../type/blockchain';

const goldAddress = '0x813CE0d67d7a7534d26300E547C4B66a9B855A45';

let paymasterServiceData: SponsorUserOperationDto = {
    mode: PaymasterMode.SPONSORED,
    // optional params...
  };

export const biconomy_mint_gold = async (amount: number, bic : IBiconomy, context: IContext, chainId: number) => {
    const goldAddress = context.getBlockchain(chainId).getContract('Gold').address;
    const contract = new ethers.Contract(goldAddress, abi.output.abi, bic.provider);
      const data = contract.interface.encodeFunctionData("self_mint", [1]);

      const tx1 = {
        to: goldAddress,
        data: data,
      };

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

