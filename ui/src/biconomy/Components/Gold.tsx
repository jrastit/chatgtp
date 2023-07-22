import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getGoldBalance } from "../../action/view";
import { mint_gold, transfer_gold } from "../../action/action";
import { IContext } from "../../type/blockchain";
import { Button } from "react-bootstrap";


interface Props {
  walletAddress: string
  context: IContext
  chainId: number
}

const TotalCountDisplay: React.FC<{ count: number }> = ({ count }) => {
  return <div>Your Gold balance is {count}</div>;
};


const Gold: React.FC<Props> = ({ walletAddress, context, chainId }) => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const interval = setInterval(() => getBalance(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const getBalance = async (isUpdating: boolean) => {
    const wallet = context.getBlockchain(chainId).getWallet(walletAddress).wallet;
    const balance = await getGoldBalance(walletAddress, wallet.provider, context, chainId);
    setCount(balance.toNumber());
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
    setIsLoading(false);
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

      const userOpResponse = await mint_gold(1, walletAddress, context, chainId);

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

      getBalance(true);

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

  const transfer_to = async (amount : number, to : string) => {
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

      const userOpResponse = await transfer_gold(amount, to, walletAddress, context, chainId);

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

      getBalance(true);

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
      {isLoading && <div>Loading...</div>}
      {!isLoading && <div><TotalCountDisplay count={count} /></div>}
      
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
      <Button onClick={() => self_mint()}>Get token</Button>
      <Button onClick={() => transfer_to(1, '0x47b020688c6d184c2a5D9A30AcBBc2AcEb57d15c')}>Send token to me</Button>
    </>
  );
};

export default Gold;
