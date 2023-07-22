import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getGoldBalance } from "../../action/view";
import { biconomy_mint_gold } from "../../action/action";


interface Props {
  smartAccount: any
  provider: any
}

const TotalCountDisplay: React.FC<{ count: number }> = ({ count }) => {
  return <div>Your Gold balance is {count}</div>;
};


const Gold: React.FC<Props> = ({ smartAccount, provider }) => {
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    const interval = setInterval(() => getBalance(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const getBalance = async (isUpdating: boolean) => {
    const balance = await getGoldBalance(smartAccount.address, provider);
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

      const userOpResponse = await biconomy_mint_gold(1, provider, smartAccount);

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
      <button onClick={() => self_mint()}>Get token</button>
    </>
  );
};

export default Gold;
