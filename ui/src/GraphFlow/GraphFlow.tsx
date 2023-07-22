import { Box } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
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

import "./style.css";
import NodeLoad from './NodeLoad';
import { Spinner } from 'react-bootstrap';

interface Edges {
    id: string
    target: string
    source: string
    className: string
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

const nodeTypes = { nodeLoader: NodeLoad };


const MIN_DISTANCE = 200;


function Graph({initialNodes, initialEdges}: GraphProps) {
    
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges ? initialEdges : []);
    const store = useStoreApi();

    const onConnect = useCallback((params:any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const getClosestEdge = useCallback((node:any) => {
        const {nodeInternals}  = store.getState();
        const storeNodes = Array.from(nodeInternals.values());

        const closestNode:any = storeNodes.reduce(
        (res:any, n:any) => {
            if (n?.id !== node?.id && n.data.type==="blockchain") {
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
        className:""
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
    
                if (dropNode && (dropNode.data.type ==="chain" || dropNode.data.type==="nodeLoader") && nextEdges.find((ne)=>  ne.target===dropNode.id)) {

                    nextEdges = nextEdges.filter((ne)=>  ne.target!==dropNode.id )

                    
                }

                closeEdge.className = 'new';
                
                nextEdges.push(closeEdge);
                
            }

        return nextEdges;
      });
      
      
    },
    [getClosestEdge]
  );

  useEffect(()=> {
    setNodes((nds) =>
      nds.map((node) => {
        if (edges.find((e)=> e.target===node.id && e.className=="new")) {
            node.type="nodeLoader"
            console.log(node)
        }

        return node;
      })
    );
    
  }, [edges]);
    
   
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
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
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
    