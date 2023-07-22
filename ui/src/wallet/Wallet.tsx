import {gql, useQuery} from '@apollo/client';
import {FunctionComponent, useState} from "react";
import GraphFlow from '../GraphFlow/GraphFlow';
import nodeDefaults from '../GraphFlow/NodeTypeDefault';




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
    const [owner /*, setOwner*/] = useState('jrastit.eth')
    const {loading, error, data} = useQuery<TokenListResultType>(listTokensQuery, {
        variables: {
            owner,
        }
    });

    if (loading) {
        return 'Loading...';
    } else if (error) {
        return `Error! ${error.message}`;
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
            <>
                <GraphFlow initialEdges={edges ? edges : []} initialNodes={nodes} />
            </>
            
        )
        //var count=1;
        // if (data.EthereumBalances) {
        //     nodes.push({
        //         id: count.toString(),
        //         data: { label: "Ethereum", type:"blockchain" },
        //         position: { x: , y: 0 },
        //         ...nodeDefaults
        //     })
        // }

        // for (let e of data.EthereumBalances.TokenBalance) {
        //     nodes.push({

        //     })
        // }


        // return (
        //     <>
        //         <h1>Ethereum</h1>
        //         <table>
        //             <tbody>
        //             {data.EthereumBalances.TokenBalance.map((e) => (
        //                 <tr>
        //                     <td>{e.formattedAmount}</td>
        //                     <td>{e.token.name}</td>
        //                 </tr>
        //             ))}
        //             </tbody>
        //         </table>
        //         <h1>Polygon</h1>
        //         <table>
        //             <tbody>
        //             {data.PolygonBalances.TokenBalance.map((e) => (
        //                 <tr>
        //                     <td>{e.formattedAmount}</td>
        //                     <td>{e.token.name}</td>
        //                 </tr>
        //             ))}
        //             </tbody>
        //         </table>
        //     </>
        // );
    } else {
        return "No data!";
    }
};

export default Wallet;