import {gql, useQuery} from '@apollo/client';
import {FunctionComponent, useState} from "react";
import GraphFlow from '../GraphFlow/GraphFlow';
import nodeDefaults from '../GraphFlow/NodeTypeDefault';
import { Box, Spinner, useToast } from '@chakra-ui/react';

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
    }[],
}



interface TokenListResultType {
    EthereumBalances: BlockchainResultType,
    PolygonBalances: BlockchainResultType,
}

const Wallet: FunctionComponent = () => {
    const toast = useToast()
    const [owner /*, setOwner*/] = useState('jrastit.eth')
    const {loading, error, data} = useQuery<TokenListResultType>(listTokensQuery, {
        variables: {
            owner,
        }
    });

    if (loading) {
        // return 'Loading...';
        return (
            <>
            <Box
            width="100%"
            height="300px" // Ensure the height value is specified in pixels, e.g., '300px'
            display="flex"
            alignItems="center"
            justifyContent="center"
            >
                <Spinner />
            </Box>
            </>
        )
    } else if (error) {
        // return `Error! ${error.message}`;
        toast({
            title: "Error when loading",
            description: `Error! ${error.message}`,
            status: "error",
            duration: 9000,
            isClosable: true,
        })
    } else if (data) {
        const nodes = [{
            id:'0',
            type:'input',
            data: {label:owner, type:"user"},
            position: { x: 0, y: 0 },
            ...nodeDefaults
        }];

        const edges = [];

        if (data.EthereumBalances) {
            const id_eth=nodes.length;
            nodes.push({
                id:`${id_eth}`,
                type: "",
                data:{label:"Ethereum", type:"blockchain"},
                position: {x:-50, y: 100},
                ...nodeDefaults
            })
            edges.push({
                id:`0-${id_eth}`, 
                source:'0',
                target:`${id_eth}`
            })
            var count=0
            for (let e of data.EthereumBalances.TokenBalance) {

                nodes.push({
                    id:`${nodes.length}`,
                    type: "output",
                    data:{label:e.token.name, type:"chain"},
                    position: {x:-10-60*(data.EthereumBalances.TokenBalance.length-count), y: 200},
                    ...nodeDefaults 
                });
                edges.push({
                    id:`${id_eth}-${nodes.length-1}`, 
                    source:`${id_eth}`,
                    target:`${nodes.length-1}`
                })
                count=count+1;
            }
        }
        if (data.PolygonBalances) {
            const id_poly=nodes.length;
            nodes.push({
                id:`${id_poly}`,
                type: "",
                data:{label:"Polygone", type:"blockchain"},
                position: {x:50, y: 100},
                ...nodeDefaults
            })
            edges.push({
                id:`0-${id_poly}`, 
                source:'0',
                target:`${id_poly}`
            })
            var count=0
            for (let e of data.EthereumBalances.TokenBalance) {

                nodes.push({
                    id:`${nodes.length}`,
                    type: "output",
                    data:{label:e.token.name, type:"chain"},
                    position: {x:10+60*(data.EthereumBalances.TokenBalance.length-count), y: 200},
                    ...nodeDefaults 
                });
                edges.push({
                    id:`${id_poly}-${nodes.length-1}`, 
                    source:`${id_poly}`,
                    target:`${nodes.length-1}`
                })
                count=count+1;
            }
        }

        
        return (
            
            <Box width="80%" style={{backgroundColor:"white"}} height="500px" marginInline="auto">
                <GraphFlow initialEdges={edges ? edges : []} initialNodes={nodes} />
                {/* <h1>Ethereum</h1>
                <table>
                    <tbody>
                    {data.EthereumBalances.TokenBalance.map((e) => (
                        <tr>
                            <td>{e.formattedAmount}</td>
                            <td>{e.token.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <h1>Polygon</h1>
                <table>
                    <tbody>
                    {data.PolygonBalances.TokenBalance.map((e) => (
                        <tr>
                            <td>{e.formattedAmount}</td>
                            <td>{e.token.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table> */}
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
    }
};

export default Wallet;