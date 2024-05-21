import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  useToast,
} from '@chakra-ui/react';
import connectWebSocket from '../utils/websocket';
import { Client } from '@stomp/stompjs';

const Home: React.FC = () => {
  const [moderationType, setModerationType] = useState<string>('full');
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const toast = useToast();

  useEffect(() => {
    const client = connectWebSocket((message: any) => {
      toast({
        title: 'Moderation Alert',
        description: message.alert,
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    });

    setStompClient(client);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [toast]);

  const startStream = async () => {
    try {
      const response = await fetch('http://localhost:9090/stream/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ moderationType }),
      });

      if (response.ok) {
        toast({
          title: 'Stream started',
          description: `Stream started with ${moderationType} moderation.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to start stream');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const stopStream = async () => {
    try {
      const response = await fetch('http://localhost:9090/stream/stop', {
        method: 'POST',
      });

      if (response.ok) {
        toast({
          title: 'Stream stopped',
          description: `The live stream has been stopped.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to stop stream');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <RadioGroup onChange={setModerationType} value={moderationType}>
        <Stack direction="row">
          <Radio value="full">Full Moderation</Radio>
          <Radio value="snapshot">Snapshot Moderation</Radio>
        </Stack>
      </RadioGroup>

      <Button mt={4} colorScheme="teal" onClick={startStream}>
        Start Live Stream
      </Button>

      <Button mt={4} colorScheme="red" onClick={stopStream}>
        Stop Live Stream
      </Button>

      {/* Live stream box (Placeholder) */}
      <Box mt={8} p={4} border="1px" borderColor="gray.200" borderRadius="md">
        <p>Live Stream will appear here...</p>
      </Box>
    </Box>
  );
};

export default Home;
