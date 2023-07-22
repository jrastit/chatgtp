import { Box, Spinner } from '@chakra-ui/react';
import { useCallback } from 'react';

import { Handle, Position } from 'reactflow';

// const handleStyle = { left: 10 };

interface NodeLoaderProps {
    data:any
    isConnectable:any
}

function NodeLoad({ data, isConnectable} : NodeLoaderProps) {
  const onChange = useCallback((evt:any) => {
    console.log(evt.target.value);
  }, []);
  const nodeSize=75;
  return (
    <Box style={{
        borderRadius: '100%',
        backgroundColor: 'white',
        width: nodeSize,
        height: nodeSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }} border="2px" borderColor="black">
      {/* <Handle type="target" position={Position.Top} isConnectable={isConnectable} /> */}
      {/* <Handle
        id={`handle-${nodeId}`}
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
      /> */}
      <Spinner color='black' />
      
      <Handle
        id={`handle-target`} // Set a unique ID for the target handle if needed
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)',  visibility: 'hidden'}}
      />
      
    </Box>
  );
}

export default NodeLoad;
