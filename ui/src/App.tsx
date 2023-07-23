import {FunctionComponent, useState} from "react";
import Wallet from "./wallet/Wallet";
import MyChatbot from "./chatbot/MyChatbot";

import {Box, Button, ChakraProvider, Stack, useDisclosure} from "@chakra-ui/react";
import {IBlockchain, IContext, IContract} from "./type/blockchain";
import Biconomy from "./biconomy/Biconomy";
import SafeWidget from "./safe/SafeWidget";
import {ChatIcon} from "@chakra-ui/icons"
import Metamask from "./metamask/Metamask";

// const nodeDefaults = {
//     // sourceposition: Position.Right,  
//     // targetPosition: Position.Left,
//         style: {
//           borderRadius: '100%',
//           backgroundColor: '#fff',
//           width: 50,
//           height: 50,
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//         },
//    };

// const nodes = [
//     {
//       id: '1',
//       data: { label: 'Hello' },
//       position: { x: 0, y: 0 },
//       ...nodeDefaults
//     },
//     {
//       id: '2',
//       type: "output",
//       data: { label: 'World', type:"chain" },
//       position: { x: 100, y: 100 },

//       ...nodeDefaults
//     },
//     {
//         id: '3',
//         data: { label: 'World' },
//         position: { x: 200, y: 200 },
//         ...nodeDefaults
//       },
//   ];

// const edges = [
//     {
//         id: '1-2',
//         source: '1',
//         target: '2',
//     },
// ]

const App: FunctionComponent = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [context, setContext0] = useState<IContext>(new IContext([
        new IBlockchain(1, "Ethereum"),
        new IBlockchain(5, "Goerli", true, [], [
            new IContract('0x813CE0d67d7a7534d26300E547C4B66a9B855A45', 'Gold')
        ]),
        new IBlockchain(11155111, "Sepolia", true, [], [
            new IContract('0x813CE0d67d7a7534d26300E547C4B66a9B855A45', 'Chainlink_to_mumbai'),
            new IContract('0x83F3596A3Fa94Cf2eEB90622d514d185383E8836', 'Gold'),
        ]),
        new IBlockchain(80001, "Mumbai", true, [], []),
        new IBlockchain(137, "Polygon"),
        new IBlockchain(100, "Gnosis"),
        new IBlockchain(1101, "Polygon zkEVM"),
        new IBlockchain(245022934, "Neon EVM"),
        new IBlockchain(5000, "Mantle"),
        new IBlockchain(42220, "Celo"),
        new IBlockchain(44787, "Alfajores Celo"),
    ]))

    const setContext = (context: IContext) => {
        const newContext = new IContext(context.blockchainList, context.otherWalletAddress);
        return setContext0(newContext);
    };

    return (
        <ChakraProvider>
            <Box display="flex" justifyContent="space-around" alignContent="center" pt="2px">
                <Biconomy context={context} chainId={5} setContext={setContext}></Biconomy>
                <SafeWidget context={context} chainId={5} setContext={setContext}/>
                <Metamask  context={context} chainId={5} setContext={setContext}/>
                <Button colorScheme='blue' width="fit-content" onClick={isOpen ? onClose : onOpen}
                        leftIcon={<ChatIcon/>}>{!isOpen ? "Close Chatbot" : "Open Chatbot"}</Button>

            </Box>
            <Stack pt="2rem">
                {/* <GraphFlow initialEdges={edges} initialNodes={nodes} /> */}
                <Stack spacing={4}>

                    <Wallet context={context}/>

                    <Box
                        position="fixed"
                        bottom="10px"
                        right="0"
                        width="fit-content"
                        paddingLeft="30px"
                    >
                        {!isOpen && <MyChatbot setContext={setContext} getContext={() => context}/>}
                    </Box>
                </Stack>

            </Stack>

        </ChakraProvider>
    );
}

export default App;
