import {FunctionComponent, useState} from "react";
import Wallet from "./wallet/Wallet";
import MyChatbot from "./chatbot/MyChatbot";

import {Box, ChakraProvider, Stack} from "@chakra-ui/react";
import {IBlockchain, IContext, IContract} from "./type/blockchain";

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
    const [context, setContext] = useState<IContext>(new IContext([
        new IBlockchain(1, "Ethereum"),
        new IBlockchain(5, "Goerli", true, [], [
            new IContract('0x813CE0d67d7a7534d26300E547C4B66a9B855A45', 'Gold')
        ]),
        new IBlockchain(137, "Polygon"),
    ]))

    return (
        <ChakraProvider>
            <Stack>
                {/* <GraphFlow initialEdges={edges} initialNodes={nodes} /> */}
                <Stack spacing={4}>

                    <Wallet/>

                    <Box
                        position="fixed"
                        bottom="10px"
                        right="0"
                        width="fit-content"
                        paddingLeft="30px"
                    >
                        <MyChatbot setContext={setContext} getContext={() => context}/>
                    </Box>
                </Stack>

            </Stack>

        </ChakraProvider>
    );
}

export default App;
