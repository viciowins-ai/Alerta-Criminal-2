import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { GoogleMap, useJsApiLoader, Circle } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -23.55052,
  lng: -46.633308,
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
];

const IncidentLocationMap = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-800">
        <Text className="text-red-500 text-xs text-center px-2">Erro Mapa</Text>
      </View>
    );
  }

  if (!isLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-800">
        <ActivityIndicator size="small" color="#3b82f6" />
      </View>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      options={{
        styles: darkMapStyle,
        disableDefaultUI: true,
        zoomControl: false,
      }}
    >
      <Circle
        center={center}
        radius={100}
        options={{
          fillColor: "rgba(59, 130, 246, 0.2)",
          strokeColor: "rgba(59, 130, 246, 0.5)",
          strokeWeight: 1,
        }}
      />
    </GoogleMap>
  );
};

export default IncidentLocationMap;
