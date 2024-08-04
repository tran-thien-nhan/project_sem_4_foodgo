// import { Client } from '@stomp/stompjs';

// class WebSocketService {
//     client;
//     isConnected = false;
//     pendingSubscriptions = [];

//     constructor() {
//         this.client = new Client({
//             brokerURL: 'ws://localhost:8080/ws', // Địa chỉ WebSocket server
//             reconnectDelay: 5000,
//             heartbeatIncoming: 4000,
//             heartbeatOutgoing: 4000,
//         });

//         this.client.onConnect = (frame) => {
//             this.isConnected = true;
//             this.pendingSubscriptions.forEach((subscription) => {
//                 this.client.subscribe(subscription.destination, subscription.callback);
//             });
//             this.pendingSubscriptions = [];
//         };

//         this.client.onStompError = (frame) => {
//             console.error('Broker reported error: ' + frame.headers['message']);
//             console.error('Additional details: ' + frame.body);
//         };

//         this.client.activate();
//     }

//     subscribeToLocation(callback) {
//         const destination = '/topic/location';
//         if (this.isConnected) {
//             this.client.subscribe(destination, (message) => {
//                 const location = JSON.parse(message.body);
//                 callback(location);
//             });
//         } else {
//             this.pendingSubscriptions.push({ destination, callback });
//         }
//     }

//     sendLocation(location) {
//         if (this.isConnected) {
//             this.client.publish({
//                 destination: '/app/location',
//                 body: JSON.stringify(location),
//             });
//         } else {
//             console.error('Cannot send message, WebSocket is not connected.');
//         }
//     }
// }

// const webSocketService = new WebSocketService();
// export default webSocketService;
