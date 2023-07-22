import { Box, useDisclosure } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
    addEdge,
    useNodesState,
    useEdgesState,
    useStoreApi,
    Controls,
    ReactFlowProvider,
} from 'reactflow';

import 'reactflow/dist/style.css';

import "./style.css";
import NodeLoad from './NodeLoad';
import Pop from './Pop';
import NodeNft from './NodeNft';
import NodeBlockChain from './NodeTypeBlockChain';
import NodeUser from './NodeUser';

interface Edges {
    id: string
    target: string
    source: string
    className: string
}

interface Node {
    id:string
    type:string
    data: Map<string,any>

}

interface GraphProps {
    initialNodes: any
    initialEdges: Edges[]
}

const reactFlowStyle = {
    background: 'white',
    width: '100%',
    height: 300,
  };

const nodeTypes = { nodeLoader: NodeLoad, nodeNft: NodeNft, nodeBlockChain: NodeBlockChain, nodeUser: NodeUser };

const MIN_DISTANCE = 200;


function Graph({initialNodes, initialEdges}: GraphProps) {
    
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges ? initialEdges : []);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [nodeSelect, setNodeSelect] = useState<Node>();
    const store = useStoreApi();

    const onConnect = useCallback((params:any) => setEdges((eds) => addEdge({...params, smooth:'straight'}, eds, )), [setEdges]);

    const getClosestEdge = useCallback((node:any) => {
        const {nodeInternals}  = store.getState();
        const storeNodes = Array.from(nodeInternals.values());

        const closestNode:any = storeNodes.reduce(
        (res:any, n:any) => {
            if (n?.id !== node?.id && n.data.type==="blockchain" && node.data.type=="wallet") {
            const dx = n.positionAbsolute.x - node.positionAbsolute.x;
            const dy = n.positionAbsolute.y - node.positionAbsolute.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            if (d < res?.distance && d < MIN_DISTANCE) {
                res.distance = d;
                res.node = n;
            }
            }

            return res;
        },
        {
            distance: Number.MAX_VALUE,
            node: null,
        }
        );

        if (!closestNode.node) {
        return null;
        }

        //const closeNodeIsSource = closestNode?.node?.positionAbsolute?.x < node?.positionAbsolute?.x;

        return {
        id: `${closestNode.node.id}-${node.id}`,
        // source: closeNodeIsSource ? closestNode.node.id : node.id,
        // target: closeNodeIsSource ? node.id : closestNode.node.id,
        source: `${closestNode.node.id}`,
        target: `${node.id}`,
        className:"",
        type:'straight'
        };
    }, []);


    const onNodeDrag = useCallback(
    (_:any, node:any) => {
        const closeEdge:any = getClosestEdge(node);

        
        setEdges((es) => {
            const nextEdges = es.filter((e) => e.className !== 'temp');
            

            if (
            closeEdge &&
            !nextEdges.find((ne) => ne.source === closeEdge.source && ne.target === closeEdge.target)
            ) {
    
                
                closeEdge.className = 'temp';
                closeEdge.animated=true;
                nextEdges.push(closeEdge);
            }

            return nextEdges;
        });


    },
    [getClosestEdge, setEdges]
  );

  const onNodeDragStop = useCallback(
    (_:any, node:any) => {
      
        setNodeSelect(node);
        console.log(nodeSelect)
        console.log("edges",edges)
        if (edges.find(e=> e.className==="temp")) {
            onOpen();
        }
        
      
      
    },
    [getClosestEdge, edges]
  );

  useEffect(()=> {
    // const radius=150;

    setNodes((nds) =>
        
        nds.map((node) => {
            
            if (edges.find((e)=> e.target===node.id && e.className=="new")) {
                node.type="nodeLoader"
                
            }
            
            return node;
        })
        );
    
  }, [edges]);

    useEffect(()=>{
        const blockchainEdgesCount: { [key: string]: number } = {};
        edges.forEach((edge) => {
            const { source, target } = edge;
            if (blockchainEdgesCount[source]) {
                blockchainEdgesCount[source]++;
            } else {
                blockchainEdgesCount[source] = 1;
            }
        });
        let maxEdgesCount = 0;
        Object.entries(blockchainEdgesCount).forEach(([blockchain, count]) => {
        if (count > maxEdgesCount) {
            maxEdgesCount = count;
        }
        });


        
        const angleBetweenBlockChainNodes = 360 / (nodes.filter((n) => n.data.type === 'blockchain').length);
        let angleBlockChain = 0;
        const Radius=150;
        const circleRadius=200;
        const e= Math.floor(maxEdgesCount/Math.floor((2*Math.PI * circleRadius)/ (150+10)));
        const blockchainRadius = Radius+e*110;

        

        const blockchainPosition: { [key: string]: number[] } = {};
        const blockchainAngle: { [key: string]: number } = {};
        const blockchainCount: { [key: string]: number } = {};
        nodes.forEach((node) => {
            if (node.data.type==='blockchain') {
                blockchainCount[node.id]=0;
                blockchainAngle[node.id]=0;
                const blockchainNodeX = blockchainRadius * Math.cos(angleBlockChain*(Math.PI/180));
                const blockchainNodeY = blockchainRadius * Math.sin(angleBlockChain*(Math.PI/180));
                blockchainPosition[node.id]=[blockchainNodeX,blockchainNodeY]
                angleBlockChain+=angleBetweenBlockChainNodes;
            }
        });

        const numNodes = Math.floor((2*Math.PI * circleRadius)/ (150+10));
            
        const angleBetweenWalletNodes = (Math.PI) / numNodes;

        setNodes((nds) =>
        
        nds.map((node) => {
            
            if (edges.find((e)=> e.target===node.id && e.className=="new")) {
                node.type="nodeLoader"
                
            }
            if (node.data.type==='user'){
                node.position.x=0;
                node.position.y=0;
            } else if (node.data.type=='blockchain') {
                
                
                node.position.x = blockchainPosition[node.id][0];
                node.position.y = blockchainPosition[node.id][1];
                angleBlockChain += angleBetweenBlockChainNodes;
                
             }
            else{
                const blockchainId=edges.find(e=>e.target===node.id)?.source
                if (blockchainId) {
                    const angle = blockchainAngle[blockchainId]
                    const walletNodeX = blockchainPosition[blockchainId][0] + (circleRadius+100*Math.floor(angle/(2*Math.PI))) * Math.cos(angle );
                    const walletNodeY = blockchainPosition[blockchainId][1]  + (circleRadius+100*Math.floor(angle/(2*Math.PI))) * Math.sin(angle);
                    node.position.x=walletNodeX;
                    node.position.y=walletNodeY;
                    
                    blockchainCount[blockchainId]++;
                    
                    blockchainAngle[blockchainId] += angleBetweenWalletNodes;
                }
                

            } 
            
            return node;
        })
        );
    
  }, []);

    const updateNode = () =>  {
        const node = nodeSelect;
        const closeEdge = getClosestEdge(node);
        setEdges((es) => {
            console.log(es)
            var nextEdges = es.filter((e) => e.className !== 'temp');

            nextEdges.map((e)=> {
                if (e.className==='new')
                {
                    e.className='';
                }
                return e
            })

            if (closeEdge) {
            
                const dropNode:any = nodes.find(node => closeEdge ? node.id === closeEdge.target: null)
    
                if (dropNode && (dropNode.data.type ==="wallet") && nextEdges.find((ne)=>  ne.target===dropNode.id)) {

                    nextEdges = nextEdges.filter((ne)=>  ne.target!==dropNode.id )

                    
                }

                closeEdge.className = 'new';
                
                nextEdges.push(closeEdge);
                
            }

        return nextEdges;
      });
      const blockchainEdgesCount: { [key: string]: number } = {};
        edges.forEach((edge) => {
            const { source, target } = edge;
            if (blockchainEdgesCount[source]) {
                blockchainEdgesCount[source]++;
            } else {
                blockchainEdgesCount[source] = 1;
            }
        });
        let maxEdgesCount = 0;
        Object.entries(blockchainEdgesCount).forEach(([blockchain, count]) => {
        if (count > maxEdgesCount) {
            maxEdgesCount = count;
        }
        });


        
        const angleBetweenBlockChainNodes = 360 / (nodes.filter((n) => n.data.type === 'blockchain').length);
        let angleBlockChain = 0;
        const Radius=150;
        const circleRadius=200;
        const e= Math.floor(maxEdgesCount/Math.floor((2*Math.PI * circleRadius)/ (150+10)));
        const blockchainRadius = Radius+e*110;

        

        const blockchainPosition: { [key: string]: number[] } = {};
        const blockchainAngle: { [key: string]: number } = {};
        const blockchainCount: { [key: string]: number } = {};
        nodes.forEach((node) => {
            if (node.data.type==='blockchain') {
                blockchainCount[node.id]=0;
                blockchainAngle[node.id]=0;
                const blockchainNodeX = blockchainRadius * Math.cos(angleBlockChain*(Math.PI/180));
                const blockchainNodeY = blockchainRadius * Math.sin(angleBlockChain*(Math.PI/180));
                blockchainPosition[node.id]=[blockchainNodeX,blockchainNodeY]
                angleBlockChain+=angleBetweenBlockChainNodes;
            }
        });

        const numNodes = Math.floor((2*Math.PI * circleRadius)/ (150+10));
            
        const angleBetweenWalletNodes = (Math.PI) / numNodes;

        setNodes((nds) =>
        
        nds.map((node) => {
            
            if (edges.find((e)=> e.target===node.id && e.className=="new")) {
                node.type="nodeLoader"
                
            }
            if (node.data.type==='user'){
                node.position.x=0;
                node.position.y=0;
            } else if (node.data.type=='blockchain') {
                
                
                node.position.x = blockchainPosition[node.id][0];
                node.position.y = blockchainPosition[node.id][1];
                angleBlockChain += angleBetweenBlockChainNodes;
                
             }
            else{
                
                const blockchainId=(closeEdge && closeEdge.target===node.id) ? closeEdge.source : edges.find(e=>e.target===node.id)?.source;
                
                
                if (blockchainId) {
                    const angle = blockchainAngle[blockchainId]
                    const walletNodeX = blockchainPosition[blockchainId][0] + (circleRadius+100*Math.floor(angle/(2*Math.PI))) * Math.cos(angle );
                    const walletNodeY = blockchainPosition[blockchainId][1]  + (circleRadius+100*Math.floor(angle/(2*Math.PI))) * Math.sin(angle);
                    node.position.x=walletNodeX;
                    node.position.y=walletNodeY;
                    
                    blockchainCount[blockchainId]++;
                    
                    blockchainAngle[blockchainId] += angleBetweenWalletNodes;
                }
                

            } 
            
            return node;
        })
        );

    }
    
   
    return (
        <Box width="100%" height="100%">

            <ReactFlow style={reactFlowStyle} 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
        
            fitView
            >
            <Controls />
            </ReactFlow>
            <Pop validateLabel="Confirmer" closeLabel="Annuler" close={onClose} validate={() => { updateNode(); onClose() }} isVisible={isOpen} title="Transaction">
                <Box>
                    Etes vous sur de vouloir transférer cet item ?
                </Box>

            </Pop>
        </Box>
        );
    }

    function GraphFlow(props:any) {
        return (
          <ReactFlowProvider>
            <Graph {...props} />
          </ReactFlowProvider>
        );
      }

    export default GraphFlow;
    