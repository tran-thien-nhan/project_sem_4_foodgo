import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const MapComponent = ({ address1, address2 }) => {
    const [positions, setPositions] = useState({
        position1: null,
        position2: null
    });
    const mapRef = useRef(null);
    const routingControlRef = useRef(null);

    useEffect(() => {
        const fetchCoordinates = async (address, positionKey) => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
                const data = await response.json();
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    setPositions(prevState => ({
                        ...prevState,
                        [positionKey]: { lat: parseFloat(lat), lng: parseFloat(lon) }
                    }));
                } else {
                    console.error(`Geocode error: Address not found for ${address}`);
                }
            } catch (error) {
                console.error(`Error fetching coordinates for ${address}:`, error);
            }
        };

        fetchCoordinates(address1, 'position1');
        fetchCoordinates(address2, 'position2');
    }, [address1, address2]);

    useEffect(() => {
        if (positions.position1 && positions.position2 && !mapRef.current) {
            mapRef.current = L.map('map').setView([10.8231, 106.6297], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);

            // Log the coordinates
            console.log('Position 1:', positions.position1);
            console.log('Position 2:', positions.position2);

            // Tạo các biểu tượng tùy chỉnh
            const icon1 = L.icon({
                iconUrl: 'https://png.pngtree.com/png-clipart/20230328/ourmid/pngtree-location-icon-png-image_6672610.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
                shadowAnchor: [41, 41]
            });

            const icon2 = L.icon({
                iconUrl: 'https://png.pngtree.com/png-clipart/20230328/ourmid/pngtree-location-icon-png-image_6672610.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
                shadowAnchor: [41, 41]
            });

            L.marker([positions.position1.lat, positions.position1.lng], { icon: icon1 }).addTo(mapRef.current);
            L.marker([positions.position2.lat, positions.position2.lng], { icon: icon2 }).addTo(mapRef.current);

            routingControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(positions.position1.lat, positions.position1.lng),
                    L.latLng(positions.position2.lat, positions.position2.lng)
                ],
                routeWhileDragging: true
            }).addTo(mapRef.current);

            const plan = routingControlRef.current.getPlan();
            plan.on('waypointschanged', function() {
                document.getElementById('routing-container').innerHTML = '';
                const container = document.getElementById('routing-container');
                const instructions = routingControlRef.current._container.querySelector('.leaflet-routing-container');
                if (instructions) {
                    container.appendChild(instructions.cloneNode(true));
                }
            });

            plan.fire('waypointschanged');
        }
    }, [positions]);

    return (
        <div style={{ width: '100%' }}>
            <div id="map" style={{ height: '400px', width: '100%' }}></div>
            <div id="routing-container" style={{ marginTop: '20px', maxHeight: '200px', overflowY: 'auto' }}></div>
        </div>
    );
};

export default MapComponent;
