import { Box } from '@chakra-ui/react';
import { useCallback } from 'react';
import ReactFlow, {
    addEdge,
    useNodesState,
    useEdgesState,
    Background,
    useStoreApi,
    Controls,
    ReactFlowProvider,
    BackgroundVariant,
} from 'reactflow';

import 'reactflow/dist/style.css';

import "./style.css"


interface GraphProps {
    initialNodes: any
    initialEdges: any
}

const reactFlowStyle = {
    background: 'white',
    width: '100%',
    height: 300,
  };



const MIN_DISTANCE = 150;


function Graph({initialNodes, initialEdges}: GraphProps) {
    
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const store = useStoreApi();
    console.log(store.getState())
    const onConnect = useCallback((params:any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const getClosestEdge = useCallback((node:any) => {
        const {nodeInternals}  = store.getState();
        const storeNodes = Array.from(nodeInternals.values());

        const closestNode:any = storeNodes.reduce(
        (res:any, n:any) => {
            if (n?.id !== node?.id) {
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
        id: `${node.id}-${closestNode.node.id}`,
        // source: closeNodeIsSource ? closestNode.node.id : node.id,
        // target: closeNodeIsSource ? node.id : closestNode.node.id,
        source: closestNode.node.id,
        target: node.id,
        };
    }, []);

    const onNodeDrag = useCallback(
    (_:any, node:any) => {
        const closeEdge:any = getClosestEdge(node);

        const dropNode:any = nodes.find(node => closeEdge ? node.id === closeEdge.id.split('-')[0]: null)
        setEdges((es) => {
            const nextEdges = es.filter((e) => e.className !== 'temp');
            

            if (
            closeEdge &&
            !nextEdges.find((ne) => ne.source === closeEdge.source && ne.target === closeEdge.target)
            ) {
                if (dropNode && dropNode.data.type =="chain") {
                    console.log(dropNode)
                    if (nextEdges.find((ne)=>  ne.target!==dropNode.id)){
                        nextEdges.filter((ne)=>  ne.target!==dropNode.id )
                    } else {
                        while(nextEdges.length > 0) {
                            nextEdges.pop();
                        }
                    }
                    
                    console.log(nextEdges.find((ne)=>  ne.target===dropNode.id))
                }
        
            closeEdge.className = 'temp';
            nextEdges.push(closeEdge);
            }

            

            return nextEdges;
        });
    },
    [getClosestEdge, setEdges]
  );

  const onNodeDragStop = useCallback(
    (_:any, node:any) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');

        if (closeEdge) {
          nextEdges.push(closeEdge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge]
  );
    return (
        <Box width="100%">

            <ReactFlow style={reactFlowStyle} 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            onConnect={onConnect}
            >
            <Background variant={BackgroundVariant.Dots} gap={50}/>
            <Controls />
            </ReactFlow>
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
    