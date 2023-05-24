import { useState } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import MapView from 'react-native-maps';
import Marker from 'react-native-maps';

export default function MapComponent({ showMap, setShowMap }) {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker
        coordinate={{
          latitude: 37.78825,
          longitude: -122.4324,
        }}
        title="ME! Hehe"
      />
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width / 2,
    height: Dimensions.get('window').height / 2,
  }
});