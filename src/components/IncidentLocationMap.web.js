import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MaterialIcons } from '@expo/vector-icons';

// ⚠️ USER API KEY
const GOOGLE_MAPS_API_KEY = "AIzaSyCco2RJC3lfAkjYb6RYjPZHLMOhm5M2d7g";

const containerStyle = {
    width: '100%',
    height: '100%'
};

const center = {
    lat: -23.550520,
    lng: -46.633308
};

const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
];

const IncidentLocationMap = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script-incident', // Unique ID to avoid conflicts if needed, though they share the loader usually
        googleMapsApiKey: GOOGLE_MAPS_API_KEY
    });

    const [map, setMap] = useState(null);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    if (!isLoaded) {
        return (
            <View className="flex-1 bg-slate-800 items-center justify-center">
                <ActivityIndicator size="small" color="#3b82f6" />
                <Text className="text-slate-500 text-xs mt-2">Carregando Mapa...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-slate-800 relative rounded-xl overflow-hidden">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    styles: darkMapStyle,
                    disableDefaultUI: true,
                    zoomControl: true, // Allow zoom in report to pin point
                }}
            >
                {/* Marker at center indicating selected location */}
                <Marker position={center} />
            </GoogleMap>

            {/* Overlay Hint */}
            <View className="absolute top-2 left-2 bg-slate-900/80 px-2 py-1 rounded border border-slate-700 pointer-events-none">
                <Text className="text-white text-[10px] font-bold">Localização Atual</Text>
            </View>
        </View>
    );
};

export default IncidentLocationMap;
