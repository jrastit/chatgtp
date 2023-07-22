import abi from "../utils/erc20Abi.json"
import {ethers} from "ethers";
import 'react-toastify/dist/ReactToastify.css';
import {IContext} from "../type/blockchain";

export const getGoldBalance = async (address: string, context: IContext, chainId: number) => {
    const wallet = context.getBlockchain(chainId).getWallet(address).wallet;
    const goldAddress = context.getBlockchain(chainId).getContract('Gold').address;
    const contract = new ethers.Contract(goldAddress, abi.output.abi, wallet.provider);
    const balance = await contract.balanceOf(address);
    return balance
}