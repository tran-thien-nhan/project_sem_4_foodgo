import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';

const MapComponent = ({ address1, address2 }) => {
    const [positions, setPositions] = useState({});
    const [mapTheme, setMapTheme] = useState('default');
    const mapRef = useRef(null);
    const routingControlRef = useRef(null);
    const [routeInstructions, setRouteInstructions] = useState([]);
    const [selectedStep, setSelectedStep] = useState(null);
    const [stepMarker, setStepMarker] = useState(null);

    const tileLayers = {
        default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        satellite: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
    };

    const createMarkerIcon = (url, size = 30) => L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-image: url(${url}); width: ${size}px; height: ${size}px; background-size: cover;"></div>`
    });

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

            const currentTileLayer = tileLayers[mapTheme];
            L.tileLayer(currentTileLayer).addTo(mapRef.current);

            const startIcon = createMarkerIcon('https://w7.pngwing.com/pngs/731/25/png-transparent-location-icon-computer-icons-google-map-maker-marker-pen-cartodb-map-marker-heart-logo-color-thumbnail.png');
            const endIcon = createMarkerIcon('https://cdn.pixabay.com/photo/2013/07/12/17/00/location-151669_1280.png');

            L.marker([positions.position2.lat, positions.position2.lng], { icon: startIcon }).addTo(mapRef.current);
            L.marker([positions.position1.lat, positions.position1.lng], { icon: endIcon }).addTo(mapRef.current);

            routingControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(positions.position2.lat, positions.position2.lng),
                    L.latLng(positions.position1.lat, positions.position1.lng)
                ],
                routeWhileDragging: false,
                show: false,
                createMarker: () => null // Disable default markers
            }).addTo(mapRef.current);

            routingControlRef.current.on('routesfound', (e) => {
                const routes = e.routes;
                const instructions = routes[0].instructions.map((instruction, index) => ({
                    text: instruction.text,
                    position: routes[0].coordinates[instruction.index]
                }));
                setRouteInstructions(instructions);
            });

            const plan = routingControlRef.current.getPlan();
            plan.on('waypointschanged', () => {
                const container = document.getElementById('routing-container');
                container.innerHTML = '';
                const instructions = routingControlRef.current._container.querySelector('.leaflet-routing-container');
                if (instructions) {
                    container.appendChild(instructions.cloneNode(true));
                }
            });

            plan.fire('waypointschanged');
        }
    }, [positions, mapTheme]);

    useEffect(() => {
        if (selectedStep !== null && routingControlRef.current) {
            const stepPosition = routeInstructions[selectedStep].position;
            if (stepPosition) {
                mapRef.current.setView(stepPosition, 15);

                // Remove the existing step marker if it exists
                if (stepMarker) {
                    mapRef.current.removeLayer(stepMarker);
                }

                // Add a new, larger marker for the selected step
                const newStepMarker = L.marker(stepPosition, {
                    icon: createMarkerIcon('https://png.pngtree.com/png-clipart/20220404/original/pngtree-motorcycle-cartoon-vector-colorful-illustrations-png-image_7513088.png', 50)
                }).addTo(mapRef.current);

                setStepMarker(newStepMarker);
            }
        }
    }, [selectedStep]);

    const handleSelectedStep = (index) => {
        setSelectedStep(index);
        const instructions = document.querySelectorAll('.leaflet-routing-alt .leaflet-routing-instruction');
        if (instructions && instructions.length > index) {
            instructions[index].click();
        }
    };

    const toggleMapTheme = () => {
        setMapTheme(prevTheme => (prevTheme === 'default' ? 'satellite' : 'default'));
    };

    return (
        <div style={{ width: '100%' }}>
            <div id="map" style={{ height: '400px', width: '100%' }}></div>
            <div id="routing-container" style={{ marginTop: '20px', maxHeight: '200px', overflowY: 'auto' }}>
                {routeInstructions.map((instruction, index) => (
                    <div 
                        key={index}
                        onClick={() => handleSelectedStep(index)}
                        style={{ cursor: 'pointer', padding: '5px', backgroundColor: selectedStep === index ? 'grey' : 'black' }}
                    >
                        {instruction.text}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MapComponent;
