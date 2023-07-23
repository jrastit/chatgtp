export class IBlockchain {
    constructor(
        chainId: number, 
        name: string, 
        testnet: boolean = false,
        walletList: IWallet[] = [], 
        contractList: IContract[] = [],
){
        this.chainId = chainId;
        this.name = name;
        this.testnet = testnet;
        this.walletList = walletList;
        this.contractList = contractList;    
    }
    chainId: number
    name: string
    walletList: IWallet[] = [];
    contractList: IContract[] = [];
    getWallet(address: string): IWallet {
        const wallet = this.walletList.find((wallet) => wallet.address === address);
        if (!wallet) {
            throw new Error(`Wallet with address ${address} not found`)
        }
        return wallet
    }
    getDefaultWallet(address: string | null): IWallet {
        if (this.walletList.length === 0) {
            throw new Error(`Default wallet not found`)
        }
        if (address) {
            return this.getWallet(address);
        }
        return this.walletList[0];
    }
    getWalletByType(type: string): IWallet {
        const wallet = this.walletList.find((wallet) => wallet.type === type);
        if (!wallet) {
            throw new Error(`Wallet with type ${type} not found`)
        }
        return wallet
    }
    getContract(type: string): IContract {
        const contract = this.contractList.find((contract) => contract.type === type);
        if (!contract) {
            throw new Error(`Contract with type ${type} not found`)
        }
        return contract
    }
    testnet: boolean = false;
}

export class IContract {
    constructor(address: string, type: string){
        this.address = address;
        this.type = type;
    }
    
    address: string = '';
    type: string = '';
}

export class IWallet {
    constructor(address: string, type: string, wallet: any = null){
        this.address = address;
        this.type = type;
        this.wallet = wallet;
    }
    address: string = '';
    type: string = '';
    wallet: any;
}

export class IContext {
    constructor(blockchainList: IBlockchain[], otherWalletAddress?: string | undefined){
        this.blockchainList = blockchainList;
        this.otherWalletAddress = otherWalletAddress
    }
    blockchainList : IBlockchain[] = [];
    otherWalletAddress: string | undefined;
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