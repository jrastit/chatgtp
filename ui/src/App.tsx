import {FunctionComponent} from "react";
import Wallet from "./wallet/Wallet";
import MyChatbot from "./chatbot/MyChatbot";
import SafeWidget from './safe/SafeWidget';

import {  Box, ChakraProvider } from "@chakra-ui/react";
import GraphFlow from "./GraphFlow/GraphFlow";

const nodeDefaults = {
    // sourceposition: Position.Right,  
    // targetPosition: Position.Left,
        style: {
          borderRadius: '100%',
          backgroundColor: '#fff',
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
   };

const nodes = [
    {
      id: '1',
      data: { label: 'Hello' },
      position: { x: 0, y: 0 },
      ...nodeDefaults
    },
    {
      id: '2',
      data: { label: 'World' },
      position: { x: 100, y: 100 },
      ...nodeDefaults
    },
    {
        id: '3',
        data: { label: 'World' },
        position: { x: 200, y: 200 },
        ...nodeDefaults
      },
  ];

const edges = [
    {
        id: 'e1-2',
        source: '1',
        target: '2',
    },
]

const App: FunctionComponent = () => {
    return (
        <>
        <ChakraProvider>
            <Box display="flex">
                <MyChatbot/>
                <p/>
                <Wallet/>
                <p/>
                <SafeWidget/>
                <GraphFlow initialEdges={edges} initialNodes={nodes} />
            </Box>
        </ChakraProvider>
        </>
    );
}

export default App;
