import React from 'react';
import { View } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import { DARK_MAP_STYLE } from '../SafetyMapScreen';

const IncidentLocationMap = () => {
    return (
        <MapView
            style={{ width: '100%', height: '100%' }}
            initialRegion={{
                latitude: -23.55052,
                longitude: -46.633308,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
            customMapStyle={DARK_MAP_STYLE}
        // provider={Platform.OS === 'android' ? 'google' : undefined}
        >
            <Circle
                center={{ latitude: -23.55052, longitude: -46.633308 }}
                radius={100}
                fillColor="rgba(59, 130, 246, 0.2)"
                strokeColor="rgba(59, 130, 246, 0.5)"
            />
        </MapView>
    );
};

export default IncidentLocationMap;
