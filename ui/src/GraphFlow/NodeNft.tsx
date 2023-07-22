import { Box, Text} from '@chakra-ui/react';
import { useCallback } from 'react';

import { Handle, Position } from 'reactflow';

// const handleStyle = { left: 10 };

interface NodeNftProps {
    data:any
    isConnectable:any
}

function NodeNft({ data, isConnectable} : NodeNftProps) {
  const onChange = useCallback((evt:any) => {
    console.log(evt.target.value);
  }, []);
  const nodeSize=75;
  return (
    <Box style={{
         borderRadius: '50%',
        backgroundColor: 'white',
        width: nodeSize,
        height: nodeSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }} border="2px" borderColor="black">
      {/* <Handle type="target" position={Position.Top} isConnectable={isConnectable} /> */}
      {/* <Handle
        id={`handle-${nodeId}`}
        type="source"
        position={Position.Top}
        isConnectable={isConnectable}
      /> */}
      {/* <Spinner color='black' /> */}
      <Box>
      {data?.img 
      ? <img style={{borderRadius:'50%', width:'100%', height:'100%'}} src={data?.img} alt={data?.label}/>
      : <Text margin="auto"
      display="flex"
      textAlign="center"
      justifyContent="center"
      alignContent="center"
      color="black"
      fontSize="xs">{data.label}</Text>}

      </Box>
            <Handle
        id={`handle-target`} // Set a unique ID for the target handle if needed
        type="target"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', visibility: 'hidden'}}
      />
      
    </Box>
  );
}

export default NodeNft;
