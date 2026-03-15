import React, { useEffect, useRef } from "react";
import { View } from "react-native";

const IncidentLocationMap = ({ scanMode }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Send the updated scanMode to the iframe without reloading the map
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(
        { type: "CHANGE_MODE", mode: scanMode },
        "*"
      );
    }
  }, [scanMode]);

  // We only generate the HTML once to avoid flashing the map!
  const mapHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet" />
    <script src="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js"></script>
    <style>
        body { margin: 0; padding: 0; background-color: #0f172a; overflow: hidden; }
        #map { width: 100vw; height: 100vh; }
        .maplibregl-control-container { display: none !important; }
        
        #radar-sweep {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 300px;
            height: 300px;
            margin-top: -150px;
            margin-left: -150px;
            border-radius: 50%;
            background: conic-gradient(from 0deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.2) 80%, rgba(59, 130, 246, 0.6) 100%);
            animation: spin 1.5s linear infinite;
            border: 1px solid rgba(59, 130, 246, 0.4);
            pointer-events: none;
            z-index: 999;
            display: none;
        }

        .incident-marker {
            width: 24px;
            height: 24px;
            background: #ef4444;
            border-radius: 50%;
            border: 3px solid #7f1d1d;
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 1);
            animation: pulse 1.5s infinite;
        }

        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <div id="radar-sweep"></div>
    <script>
        // Use MapLibre with Carto Dark Matter Vector Style (Looks practically identical to Mapbox Dark)
        var map = new maplibregl.Map({
            container: 'map',
            style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
            center: [-46.633308, -23.55052], // [lng, lat]
            zoom: 15,
            pitch: 0,
            bearing: 0,
            interactive: true
        });

        // Add a pulsing point for the user location / danger zone indicator
        var incidentMarker = null;

        map.on('load', function() {
            // Draw a subtle blue zone
            map.addSource('zone', {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-46.633308, -23.55052]
                    }
                }
            });

            map.addLayer({
                'id': 'zone-layer',
                'type': 'circle',
                'source': 'zone',
                'paint': {
                    'circle-radius': {
                        stops: [[10, 20], [15, 80], [20, 400]]
                    },
                    'circle-color': 'rgba(59, 130, 246, 0.2)',
                    'circle-stroke-width': 1,
                    'circle-stroke-color': 'rgba(59, 130, 246, 0.5)'
                }
            });
        });

        // Listen for messages from React Native
        window.addEventListener("message", (event) => {
            const data = event.data;
            if (data && data.type === "CHANGE_MODE") {
                const mode = data.mode;
                const radar = document.getElementById('radar-sweep');
                
                if (mode === 'scanning') {
                    radar.style.display = 'block';
                    // 3D Voo / Scan Animation
                    map.easeTo({
                        pitch: 60,
                        bearing: 90,
                        duration: 3000
                    });
                    if (incidentMarker) incidentMarker.remove();
                } else if (mode === 'analyzed') {
                    radar.style.display = 'none';
                    // Focus on Incident
                    map.flyTo({
                        center: [-46.635, -23.5518],
                        zoom: 16,
                        pitch: 45,
                        bearing: -20,
                        duration: 1500
                    });
                    
                    if (!incidentMarker) {
                        var el = document.createElement('div');
                        el.className = 'incident-marker';
                        incidentMarker = new maplibregl.Marker(el)
                            .setLngLat([-46.635, -23.5518])
                            .addTo(map);
                    } else {
                        incidentMarker.addTo(map);
                    }
                } else {
                    // Idle
                    radar.style.display = 'none';
                    map.easeTo({
                        center: [-46.633308, -23.55052],
                        pitch: 0,
                        bearing: 0,
                        zoom: 15,
                        duration: 1000
                    });
                    if (incidentMarker) incidentMarker.remove();
                }
            }
        });
    </script>
</body>
</html>
  `;

  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: "#0f172a", overflow: "hidden" }}>
      <iframe
        ref={iframeRef}
        srcDoc={mapHtml}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Map Location Preview"
      />
    </View>
  );
};

export default IncidentLocationMap;
