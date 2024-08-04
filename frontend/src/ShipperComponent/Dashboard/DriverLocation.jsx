// import React, { useEffect, useState } from 'react';
// import webSocketService from '../../AdminComponent/util/WebSocketService'; // Đảm bảo đường dẫn chính xác

// const DriverLocation = () => {
//     const [location, setLocation] = useState({ latitude: 0, longitude: 0 });

//     useEffect(() => {
//         const updateLocation = (newLocation) => {
//             setLocation(newLocation);
//         };

//         webSocketService.subscribeToLocation(updateLocation);

//         const fetchLocation = () => {
//             if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(
//                     (position) => {
//                         const newLocation = {
//                             latitude: position.coords.latitude,
//                             longitude: position.coords.longitude,
//                         };
//                         setLocation(newLocation);
//                         webSocketService.sendLocation(newLocation); // Gửi tọa độ tới WebSocket server
//                     },
//                     (error) => {
//                         console.error('Error fetching location:', error);
//                     }
//                 );
//             } else {
//                 console.error('Geolocation is not supported by this browser.');
//             }
//         };

//         fetchLocation(); // Lấy tọa độ ngay khi component mount

//         return () => {
//             // Unsubscribe from the WebSocket when component unmounts
//             webSocketService.client.deactivate();
//         };
//     }, []);

//     return (
//         <div>
//             <h1>Driver Location</h1>
//             <p>Latitude: {location.latitude}</p>
//             <p>Longitude: {location.longitude}</p>
//             <button onClick={() => webSocketService.sendLocation(location)}>Update Location</button>
//         </div>
//     );
// };

// export default DriverLocation;
