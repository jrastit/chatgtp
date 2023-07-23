import {gql, useQuery} from '@apollo/client';
import GraphFlow from '../GraphFlow/GraphFlow';
import {Box, useToast} from '@chakra-ui/react';
import {IContext} from '../type/blockchain';
import {getGoldBalance} from "../action/view";
import {useEffect, useState} from "react";

const listTokensQuery = gql`
    query MyQuery($owner: Identity) {
      EthereumBalances: TokenBalances(
        input: {filter: {owner: {_eq: $owner}}, blockchain: ethereum, limit: 200}
      ) {
        TokenBalance {
          amount
          formattedAmount
          token {
            name
          }
          tokenNfts {
            contentValue {
              image {
                extraSmall
              }
            }
          }
        }
        
      }
      PolygonBalances: TokenBalances(
        input: {filter: {owner: {_eq: $owner}}, blockchain: polygon, limit: 200}
      ) {
        TokenBalance {
          amount
          formattedAmount
          token {
            name
          }
          tokenNfts {
            contentValue {
              image {
                extraSmall
              }
            }
          }
        }
      }
    }
`;

interface BlockchainResultType {
    TokenBalance: {
        amount: string,
        formattedAmount: number,
        token: {
            name: string,
        },
        tokenNfts: {
            contentValue: {
                image: {
                    extraSmall: any
                }
            }
        },
    }[],
}


interface TokenListResultType {
    EthereumBalances: BlockchainResultType,
    PolygonBalances: BlockchainResultType,
}

interface WalletProps {
    context: IContext,
}

function Wallet({context}: WalletProps) {
    const toast = useToast()
    const [walletBalances, setWalletBalances] = useState<{ [address: string]: string }>({});
    const [rnd, setRnd] = useState(0);
    const allWallets = context.blockchainList.flatMap((b) => b.walletList);
    const allAddresses = allWallets.map((w) => w.address);

    useEffect(() => {
        (async () => {
            const result = await Promise.all(
                context.blockchainList
                    .flatMap((b) => b.contractList.map((c) => ({b, c})))
                    .filter(({c}) => c.type === 'Gold')
                    .flatMap(({b, c}) => b.walletList.map((w) => ({b, c, w})))
                    .map(async ({b, w}) => {
                        const bal = (await getGoldBalance(w.address, context, b.chainId)).toString();
                        return [w.address, [bal, b.name]];
                    }));
            console.log('setWalletBalances................... ', result);
            setWalletBalances(Object.fromEntries(result));
            setRnd(Math.random());
        })();
    }, [context.rnd]);


    const {loading, error, data} = useQuery<TokenListResultType>(listTokensQuery, {
        skip: context.otherWalletAddress === undefined,
        variables: {
            owner: context.otherWalletAddress,
        }
    });


    const nodes = []
    if (context.otherWalletAddress) {
        nodes.push({
            id: '0',
            type: 'nodeUser',
            data: {label: context.otherWalletAddress, type: "user", img: ''},
            position: {x: 0, y: 0},
        }
       )
    }

    const edges = [];
    const circleRadius = 250;
    const e = Math.floor(Math.max(data?.EthereumBalances?.TokenBalance?.length ?? 0, data?.PolygonBalances?.TokenBalance?.length ?? 0) / Math.floor((2 * Math.PI * circleRadius) / (150 + 10)));
    let id_eth=0
    let id_poly=0
    if (data?.EthereumBalances) {
        id_eth = nodes.length;
        const blockchainNodeX = -(150 + e * 150);
        const blockchainNodeY = (150 + e * 150);
        nodes.push({
            id: `${id_eth}`,
            type: "nodeBlockChain",
            data: {label: "Ethereum", type: "blockchain", img: ''},
            position: {x: blockchainNodeX, y: blockchainNodeY},
        })
        edges.push({
            id: `0-${id_eth}`,
            source: '0',
            target: `${id_eth}`,
            type: 'straight',
            style: {stroke: 'blue', strokeWidth: 2}
        })

        const numNodes = Math.floor((2 * Math.PI * circleRadius) / (200 + 20));
        const angleBetweenWalletNodes = (Math.PI) / numNodes;
        let count = 0;
        let angle = 0;
        for (let e of data.EthereumBalances.TokenBalance) {
            const walletNodeX = blockchainNodeX + (circleRadius + 110 * Math.floor(angle / (2 * Math.PI))) * Math.cos(angle);
            const walletNodeY = blockchainNodeY + (circleRadius + 110 * Math.floor(angle / (2 * Math.PI))) * Math.sin(angle);

            nodes.push({
                id: `${nodes.length}`,
                type: "nodeNft",
                data: {
                    label: `${e.formattedAmount} ${e.token.name}`,
                    type: "wallet",
                    img: e?.tokenNfts?.contentValue?.image?.extraSmall
                },
                position: {x: walletNodeX, y: walletNodeY},
            });
            edges.push({
                id: `${id_eth}-${nodes.length - 1}`,
                source: `${id_eth}`,
                target: `${nodes.length - 1}`,
                type: 'straight'
            })
            count = count + 1;
            angle += angleBetweenWalletNodes;
        }
    }
    if (data?.PolygonBalances) {
        id_poly = nodes.length;
        const blockchainNodeX = 150 + e * 100;
        const blockchainNodeY = 150 + e * 100;
        nodes.push({
            id: `${id_poly}`,
            type: "nodeBlockChain",
            data: {label: "Polygon", type: "blockchain", img: ''},
            position: {x: blockchainNodeX, y: blockchainNodeY},
        })
        edges.push({
            id: `0-${id_poly}`,
            source: '0',
            target: `${id_poly}`,
            type: 'straight',
            style: {stroke: 'blue', strokeWidth: 2}
        })

        const numNodes = Math.floor((2 * Math.PI * circleRadius) / (200 + 20));

        const angleBetweenWalletNodes = (Math.PI) / numNodes;

        let count = 0;
        let angle = 0;
        for (let e of data?.PolygonBalances?.TokenBalance) {
            const walletNodeX = blockchainNodeX + (circleRadius + 150 * Math.floor(angle / (2 * Math.PI))) * Math.cos(angle);
            const walletNodeY = blockchainNodeY + (circleRadius + 150 * Math.floor(angle / (2 * Math.PI))) * Math.sin(angle);
            nodes.push({
                id: `${nodes.length}`,
                type: "nodeNft",
                data: {
                    label: `${e.formattedAmount} ${e.token.name}`,
                    type: "wallet",
                    img: e?.tokenNfts?.contentValue?.image?.extraSmall
                },
                position: {x: walletNodeX, y: walletNodeY}
            });
            edges.push({
                id: `${id_poly}-${nodes.length - 1}`,
                source: `${id_poly}`,
                target: `${nodes.length - 1}`,
                type: 'straight'
            })
            count = count + 1;
            angle += angleBetweenWalletNodes;
        }
    }

    for (let a of allAddresses) {
        const bal = walletBalances[a][0];
        const id_blockchain:any = (walletBalances[a][1]==="Ethereum" && id_eth!==0) ? id_eth : (walletBalances[a][1]==="Polygon" && id_poly!==0) ?  id_poly : nodes.length;
        
        if (id_blockchain !==id_eth && id_blockchain !==id_poly) {
            const blockchainNodeX:any = 150 + e * (100+nodes.length);
            const blockchainNodeY:any = 150 + e * (100+nodes.length);
            nodes.push({
                id: `${id_blockchain}`,
                type: "nodeBlockChain",
                data: {label: "Polygon", type: "blockchain", img: ''},
                position: {x: blockchainNodeX, y: blockchainNodeY},
            })
            edges.push({
                id: `0-${id_blockchain}`,
                source: '0',
                target: `${id_blockchain}`,
                type: 'straight',
                style: {stroke: 'blue', strokeWidth: 2}
            })
        }
        
        nodes.push({
            id: `${nodes.length}`,
            type: 'nodeNft',
            data: {label: `${bal} GOLD`, type: "wallet", img: ''},
            position: {x: nodes.length, y: nodes.length},
        });
        edges.push({
            id: `${id_blockchain}-${nodes.length - 1}`,
            source: `${id_blockchain}`,
            target: `${nodes.length - 1}`,
            type: 'straight'
        })

    }

    return (
        <Box width="80%" style={{backgroundColor: "white"}} height="500px" marginInline="auto">
            <GraphFlow key={`${context.rnd}_${rnd}_${loading}`} initialEdges={edges ? edges : []} initialNodes={nodes}/>
        </Box>
    )
};

export default Wallet;