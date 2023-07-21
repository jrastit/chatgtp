import {gql, useQuery} from '@apollo/client';
import {FunctionComponent, useState} from "react";

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
    const [owner /*, setOwner*/] = useState('vitalik.eth')
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
        return (
            <>
                <h1>Ethereum</h1>
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
                </table>
            </>
        );
    } else {
        return "No data!";
    }
};

export default Wallet;