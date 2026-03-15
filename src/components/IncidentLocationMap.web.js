import React, { useEffect, useRef } from "react";
import { View } from "react-native";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN || "";

const IncidentLocationMap = ({ scanMode }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        { type: "CHANGE_MODE", mode: scanMode },
        "*"
      );
    }
  }, [scanMode]);

  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: "#0f172a", overflow: "hidden", borderRadius: 16 }}>
      <iframe
        ref={iframeRef}
        src={`/mapbox.html?token=${MAPBOX_TOKEN}`}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        allow="geolocation"
        title="Map Location Preview"
      />
    </View>
  );
};

export default IncidentLocationMap;
