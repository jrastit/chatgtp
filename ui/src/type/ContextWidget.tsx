import { IContext } from "./blockchain"

interface Props {
    context: IContext
    chainId: number
    setContext: (context: IContext) => void
}

const ContextWidget: React.FC<Props> = ({context, chainId, setContext}) => {
    return (
        <div>
            <div>ContextWidget</div>
            {context.blockchainList.map((blockchain) => {
                return (
                    <div>
                        <div>{blockchain.name}</div>
                        {blockchain.walletList.map((wallet) => {
                            return (
                                <div>
                                    <div>{wallet.type}</div>
                                    <div>{wallet.address}</div>
                                </div>
                            )
                        })}
                    </div>
                )
            }
            )}
        </div>
    )
}

export default ContextWidget;
