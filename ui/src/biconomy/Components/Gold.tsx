import React, { useState, useEffect } from "react";
import { BiconomySmartAccount} from "@biconomy/account"
import {  IHybridPaymaster,SponsorUserOperationDto, PaymasterMode,} from '@biconomy/paymaster'
import abi from "../utils/erc20Abi.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IPaymaster, BiconomyPaymaster,} from '@biconomy/paymaster'


interface Props {
  smartAccount: any
  provider: any
}

const TotalCountDisplay: React.FC<{ count: number }> = ({ count }) => {
  return <div>Total count is {count}</div>;
};


  let paymasterServiceData: SponsorUserOperationDto = {
    mode: PaymasterMode.SPONSORED,
    // optional params...
  };


const Gold: React.FC<Props> = ({ smartAccount, provider }) => {
  const [count, setCount] = useState<number>(0);
  const [goldContract, setGoldContract] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const goldAddress = '0x813CE0d67d7a7534d26300E547C4B66a9B855A45';

  useEffect(() => {
    setIsLoading(true);
    const interval = setInterval(() => getCount(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const getCount = async (isUpdating: boolean) => {
    const contract = new ethers.Contract(goldAddress, abi.output.abi, provider);
    setGoldContract(contract);
    const currentCount = await contract.balanceOf(smartAccount.address);
    setCount(currentCount.toNumber());
    if (isUpdating) {
      toast.success('Count has been updated!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const self_mint = async () => {
    try {
      toast.info('Processing mint on the blockchain!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      const contract = new ethers.Contract(goldAddress, abi.output.abi, provider);
      const data = contract.interface.encodeFunctionData("self_mint", [1]);

      const tx1 = {
        to: goldAddress,
        data: data,
      };

      let partialUserOp = await smartAccount.buildUserOp([tx1]);


      try {
        console.log("Partial User Op:", partialUserOp);

         const biconomyPaymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
        const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(partialUserOp, paymasterServiceData);
        partialUserOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
        console.log("Paymaster and data:", paymasterAndDataResponse.paymasterAndData);
        const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
        const transactionDetails = await userOpResponse.wait();

        console.log("Transaction Details:", transactionDetails);
        console.log("Transaction Hash:", userOpResponse.userOpHash);

        toast.success(`Transaction Hash: ${userOpResponse.userOpHash}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        getCount(true);
      } catch (e) {
        console.error("Error executing transaction:", e);
        // ... handle the error if needed ...
      }
    } catch (error) {
      console.error("Error executing transaction:", error);
      toast.error('Error occurred, check the console', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  return (
    <>
      <TotalCountDisplay count={count} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <br></br>
      <button onClick={() => self_mint()}>Get token</button>
    </>
  );
};

export default Gold;
