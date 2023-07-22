import abi from "../utils/erc20Abi.json"
import { ethers } from "ethers";
import 'react-toastify/dist/ReactToastify.css';

const goldAddress = '0x813CE0d67d7a7534d26300E547C4B66a9B855A45';

export const getGoldBalance = async (address: string, provider: any) => {
    const contract = new ethers.Contract(goldAddress, abi.output.abi, provider);
    const balance = await contract.balanceOf(address);
    return balance
}