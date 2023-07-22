export class IBlockchain {
    constructor(chainId: number, name: string, walletList: IWallet[], testnet: boolean = false){
        this.chainId = chainId;
        this.name = name;
    }
    chainId: number
    name: string
    walletList: IWallet[] = [];
    getWallet(address: string): IWallet {
        const wallet = this.walletList.find((wallet) => wallet.address === address);
        if (!wallet) {
            throw new Error(`Wallet with address ${address} not found`)
        }
        return wallet
    }
    testnet: boolean = false;
}

export class IWallet {
    contructor(address: string, type: string){
        this.address = address;
        this.type = type;
    }
    address: string = '';
    type: string = '';
    wallet: any;
}

export class IContext {
    constructor(blockchainList: IBlockchain[]){
        this.blockchainList = blockchainList;
    }
    blockchainList : IBlockchain[] = [];
    getBlockchain(chainId: number): IBlockchain {
        const blockchain = this.blockchainList.find((blockchain) => blockchain.chainId === chainId);
        if (!blockchain) {
            throw new Error(`Blockchain with chainId ${chainId} not found`)
        }
        return blockchain
    }
}

export class IBiconomy {
    provider: any;
    smartAccount: any;
}