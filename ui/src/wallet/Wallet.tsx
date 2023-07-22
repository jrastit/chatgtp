import {gql, useQuery} from '@apollo/client';
import {FunctionComponent, useEffect, useState} from "react";
import GraphFlow from '../GraphFlow/GraphFlow';
import nodeDefaults from '../GraphFlow/NodeTypeDefault';
import nodeNft from '../GraphFlow/NodeNft';
import {Box, Spinner, useToast} from '@chakra-ui/react';
import { IBlockchain, IContext } from '../type/blockchain';

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
        tokenNfts:{
            contentValue: {
              image: {
                extraSmall:any
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
    context: IContext
}

function Wallet ({context}: WalletProps) {
    const toast = useToast()
    // const [context, setContext] = useState<IContext>(IContext);
    
    const [owner /*, setOwner*/] = useState('jrastit.eth')
    const {loading, error, data} = useQuery<TokenListResultType>(listTokensQuery, {
        variables: {
            owner,
        }
    });

    // const [dataContext, setDataContext] = useState<BlockchainResultType[]>([])

    // useEffect(()=> {
    //     context.blockchainList.map((b)=> {
    //         let data=[];
    //         if (b.name ==="Ethereum" || b.name==="Polygone") {
    //             for (let owner of b.walletList) {
                
    //             const {loading, error, data} = useQuery<TokenListResultType>(listTokensQuery, {
    //                 variables: {
    //                     owner,
    //                 }
    //             });
    //         }
    //     }
        

    //     )
        
    // }, [context])

    if (loading) {
        return (
            <>
                <Box
                    width="100%"
                    height="300px" // Ensure the height value is specified in pixels, e.g., '300px'
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Spinner/>
                </Box>
            </>
        )
    } else if (error) {
        toast({
            title: "Error when loading",
            description: `Error! ${error.message}`,
            status: "error",
            duration: 9000,
            isClosable: true,
        })
        return (
            <>
            </>
        );
    } else if (data) {
        
        const nodes = [{
            id:'0',
            type:'nodeUser',
            data: {label:owner, type:"user", img:''},
            position: { x: 0, y: 0 },
        }];

        const edges = [];
        const circleRadius = 200;
        const e= Math.floor(Math.max(data.EthereumBalances.TokenBalance.length, data.PolygonBalances.TokenBalance.length)/Math.floor((2*Math.PI * circleRadius)/ (150+10)));
        
        if (data.EthereumBalances) {
            const id_eth=nodes.length;
            const blockchainNodeX = -(150+e*100);
            const blockchainNodeY = (150+e*100);
            nodes.push({
                id:`${id_eth}`,
                type: "nodeBlockChain",
                data:{label:"Ethereum", type:"blockchain", img:''},
                position: {x:blockchainNodeX, y: blockchainNodeY},
            })
            edges.push({
                id:`0-${id_eth}`, 
                source:'0',
                target:`${id_eth}`,
                type:'straight',
                style:{ stroke: 'blue', strokeWidth: 2 }
            })
            
            const numNodes = Math.floor((2*Math.PI * circleRadius)/ (150+10));
            const angleBetweenWalletNodes = (Math.PI) / numNodes;
            let count=0;
            let angle = 0;
            for (let e of data.EthereumBalances.TokenBalance) {
                const walletNodeX = blockchainNodeX + (circleRadius+75*Math.floor(angle/(2*Math.PI))) * Math.cos(angle );
                const walletNodeY = blockchainNodeY + (circleRadius+75*Math.floor(angle/(2*Math.PI))) * Math.sin(angle);

                nodes.push({
                    id:`${nodes.length}`,
                    type: "nodeNft",
                    data:{label:e.token.name, type:"wallet", img:e?.tokenNfts?.contentValue?.image?.extraSmall },
                    position: {x: walletNodeX, y: walletNodeY},
                });
                edges.push({
                    id:`${id_eth}-${nodes.length-1}`, 
                    source:`${id_eth}`,
                    target:`${nodes.length-1}`,
                    type:'straight'
                })
                count=count+1;
                angle += angleBetweenWalletNodes;
            }
        }
        if (data.PolygonBalances) {
            const id_poly=nodes.length;
            const blockchainNodeX = 150+e*100;
            const blockchainNodeY = 150+e*100;
            nodes.push({
                id:`${id_poly}`,
                type: "nodeBlockChain",
                data:{label:"Polygone", type:"blockchain", img:''},
                position: {x:blockchainNodeX, y: blockchainNodeY},
            })
            edges.push({
                id:`0-${id_poly}`, 
                source:'0',
                target:`${id_poly}`,
                type:'straight',
                style:{ stroke: 'blue', strokeWidth: 2 }
            })

            const numNodes = Math.floor((2*Math.PI * circleRadius)/ (150+10));
            
            const angleBetweenWalletNodes = (Math.PI) / numNodes;
            
            let count=0;
            let angle =0;
            for (let e of data?.PolygonBalances?.TokenBalance) {
                const walletNodeX = blockchainNodeX + (circleRadius+100*Math.floor(angle/(2*Math.PI))) * Math.cos(angle ) ;
                const walletNodeY = blockchainNodeY + (circleRadius+100*Math.floor(angle/(2*Math.PI))) * Math.sin(angle );
                nodes.push({
                    id:`${nodes.length}`,
                    type: "nodeNft",
                    data:{label:e.token.name, type:"wallet", img:e?.tokenNfts?.contentValue?.image?.extraSmall},
                    position: {x:walletNodeX, y: walletNodeY}
                });
                edges.push({
                    id:`${id_poly}-${nodes.length-1}`, 
                    source:`${id_poly}`,
                    target:`${nodes.length-1}`,
                    type:'straight'
                })
                count=count+1;
                angle += angleBetweenWalletNodes;
            }
        }

        return (
            <Box width="80%" style={{backgroundColor: "white"}} height="500px" marginInline="auto">
                <GraphFlow initialEdges={edges ? edges : []} initialNodes={nodes}/>
            </Box>
        )
    } else {
        toast({
            title: "Error: No data",
            description: `Error! no data`,
            status: "error",
            duration: 9000,
            isClosable: true,
        })

        return (
            <>
            </>
        );
    }
};

export default Wallet;