// utils/websocket.ts
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const connectWebSocket = (
  onMessageReceived: (message: any) => void
): Client => {
  const socket = new SockJS('http://localhost:9090/websocket');
  const stompClient = new Client({
    webSocketFactory: () => socket,
    onConnect: () => {
      console.log('Connected to WebSocket');
      stompClient.subscribe('/topic/notifications', (message: IMessage) => {
        onMessageReceived(JSON.parse(message.body));
      });
    },
    onStompError: (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    },
  });

  stompClient.activate();

  return stompClient;
};

export default connectWebSocket;
