import { Box, LinkBox, Spinner } from '@chakra-ui/react';
import { useCallback } from 'react';

import { Handle, Position } from 'reactflow';

// const handleStyle = { left: 10 };

interface NodeLoaderProps {
    isConnectable:any
}

function NodeLoad({ isConnectable} : NodeLoaderProps) {
  const onChange = useCallback((evt:any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <Box style={{
        borderRadius: '100%',
        backgroundColor: '#fff',
        width: 50,
        height: 50,
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
      <Spinner />
      <Handle
        id={`handle-target`} // Set a unique ID for the target handle if needed
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      
    </Box>
  );
}

export default NodeLoad;
