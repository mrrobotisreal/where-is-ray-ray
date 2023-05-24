import { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Pressable, Text, TextInput, Animated, Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Geojson, Polygon } from 'react-native-maps';
import Modal from 'react-native-modal';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as turf from '@turf/turf';
TaskManager.defineTask('locationTask', async ({ data, error }) => {
  if (error) {
    console.log('Background task error:', error);
    return;
  }

  if (data) {
    const { locations } = data;
    console.log('Background task location:', locations[0]);
    console.log(new Date().toDateString());
    console.log(new Date().toTimeString());
  }
})

const geoBoxcar = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              -122.33783036340004,
              47.619712478394405
            ],
            [
              -122.33783036340004,
              47.61938682685633
            ],
            [
              -122.3372291394287,
              47.61938682685633
            ],
            [
              -122.3372291394287,
              47.619712478394405
            ],
            [
              -122.33783036340004,
              47.619712478394405
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
}
const geoUser = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [-122.083922, 37.4217937],
        "type": "Point"
      }
    }
  ]
};
// "coordinates": [-122.3375502, 47.619481],

export default function Map({ showMap, setShowMap }) {
  const [region, setRegion] = useState({
    latitude: 39.093520,
    longitude: -108.457810,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [location, setLocation] = useState(region);
  const [userLocMarker, setUserLocMarker] = useState({
    latitude: 39.093520,
    longitude: -108.457810,
  });
  const [address, setAddress] = useState();
  const [buttonBorderColor, setButtonBorderColor] = useState('white');
  const [sendButtonBorderColor, setSendButtonBorderColor] = useState('white');
  const [closeButtonBorderColor, setCloseButtonBorderColor] = useState('white');
  const [buttonTextColor, setButtonTextColor] = useState('white');
  const [sendButtonTextColor, setSendButtonTextColor] = useState('white');
  const [closeButtonTextColor, setCloseButtonTextColor] = useState('white');
  const [buttonPadding, setButtonPadding] = useState('5%');
  const [sendButtonPadding, setSendButtonPadding] = useState('5%');
  const [closeButtonPadding, setCloseButtonPadding] = useState('5%');
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [draggableCoord, setDraggableCoord] = useState({
    latitude: 39.093520,
    longitude: -108.457810,
  })
  const onRegionChange = (region) => {
    // console.log('[REGION changed to] -> ', region);
    setLocation(region.coords);
  };
  const openSearchModal = () => setIsSearchModalVisible(true);
  const searchModalButtonHold = () => {
    setButtonBorderColor('red');
    setButtonTextColor('red');
    setButtonPadding('4%');
  };
  const searchModalButtonRelease = () => {
    setButtonBorderColor('white');
    setButtonTextColor('white');
    setButtonPadding('5%');
  };
  const searchModalSendButtonHold = () => {
    setSendButtonBorderColor('red');
    setSendButtonTextColor('red');
    setSendButtonPadding('4%');
  };
  const searchModalSendButtonRelease = () => {
    setSendButtonBorderColor('white');
    setSendButtonTextColor('white');
    setSendButtonPadding('5%');
  };
  const searchModalCloseButtonHold = () => {
    setCloseButtonBorderColor('red');
    setCloseButtonTextColor('red');
    setCloseButtonPadding('4%');
  };
  const searchModalCloseButtonRelease = () => {
    setCloseButtonBorderColor('white');
    setCloseButtonTextColor('white');
    setCloseButtonPadding('5%');
  };
  const geocodeLoc = async () => {
    const geocodedLoc = await Location.geocodeAsync(address);
    console.log('[ADDRESS] -> ', address);
    console.log('[GEOCODE] -> ', geocodedLoc);
    let newCoords = {
      latitude: geocodedLoc[0].latitude,
      latitudeDelta: region.latitudeDelta,
      longitude: geocodedLoc[0].longitude,
      longitudeDelta: region.longitudeDelta,
    };
    let newUserMarker = {
      latitude: geocodedLoc[0].latitude,
      longitude: geocodedLoc[0].longitude,
    }
    console.log('[newCoords] -> ', newCoords);
    setLocation(newCoords);
    setIsSearchModalVisible(false);
    setUserLocMarker(newUserMarker);
  };

  useEffect(() => {
    const getPerms = async () => {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Please grant location permissions');
        return;
      }
      status = await Location.requestForegroundPermissionsAsync();
      console.log('status', status)
      if (status !== 'granted') {
        console.log('Please grant permissions!');
        return;
      }

      let currLoc = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.High,
      });
      console.log('[LOCATION] -> ', currLoc);
      let newLoc = {
        latitude: currLoc.coords.latitude,
        latitudeDelta: region.latitudeDelta,
        longitude: currLoc.coords.longitude,
        longitudeDelta: region.longitudeDelta,
      }
      setLocation(newLoc);
      setUserLocMarker({
        latitude: currLoc.coords.latitude,
        longitude: currLoc.coords.longitude,
      })
    };
    getPerms();
  }, [])

  useEffect(() => {
    const isUserWithinPolygon = turf.booleanPointInPolygon(geoUser.features[0], geoBoxcar.features[0]);
    console.log('[is user in polygon?]\n', isUserWithinPolygon);
  }, [])

  useEffect(() => {
    const startLocationUpdates = async () => {
      console.log('FIRE!')
      await Location.startLocationUpdatesAsync('locationTask', {
        timeInterval: 300000,
        // timeInterval: 1000,
        accuracy: Location.Accuracy.High,
        deferredUpdatesInterval: 300000,
        // deferredUpdatesInterval: 1000,
        deferredUpdatesDistance: 0,
        showsBackgroundLocationIndicator: false,
      });
    };
    // startLocationUpdates();
  }, [])

  const startBackgroundTask = () => {};
  const stopBackgroundTask = () => {};

  return (
    <View
      style={styles.container}
    >
      {Platform.OS === 'android'
        ? (
          // <MapView
          //   style={styles.map}
          //   initialRegion={region}
          //   onRegionChange={onRegionChange}
          //   provider={PROVIDER_GOOGLE}
          // />
          <MapView
          style={styles.map}
          // initialRegion={location}
          region={location}
          onRegionChange={onRegionChange}
          provider={PROVIDER_GOOGLE}
        >
          <Marker
            coordinate={userLocMarker}
            title="You"
            description="Your current location"
            draggable
            pinColor="#3d03fc"
            onDrag={(e) => console.log('[DRAG]\n', e.nativeEvent)}
            // onDragEnd={(e) => setDraggableCoord({
            //   ...e.nativeEvent.coordinate,
            //   title: 'Mic',
            //   description: "Mic's house",
            // })}
            onDragEnd={(e) => console.log('[DRAG END]\n', e.nativeEvent)}
            zoomEnabled={true}
          />
            <Geojson
              geojson={geoBoxcar}
              fillColor="red"
            />
        </MapView>
        ) : (
          <MapView
            style={styles.map}
            // initialRegion={region}
            region={location}
            onRegionChange={onRegionChange}
            provider={PROVIDER_GOOGLE}
          >
            <Marker
              coordinate={userLocMarker}
              title="You"
              description="Your current location"
              draggable
              pinColor="#3d03fc"
              onDrag={(e) => console.log('[DRAG]\n', e.nativeEvent)}
              // onDragEnd={(e) => setDraggableCoord({
              //   ...e.nativeEvent.coordinate,
              //   title: 'Mic',
              //   description: "Mic's house",
              // })}
              onDragEnd={(e) => console.log('[DRAG END]\n', e.nativeEvent)}
              zoomEnabled={true}
            />
            <Geojson
              geojson={geoBoxcar}
              fillColor="red"
            />
          </MapView>
        )
      }
      <Pressable
        onPress={openSearchModal}
        onPressIn={searchModalButtonHold}
        onPressOut={searchModalButtonRelease}
      >
        <View
          style={[
            styles.button,
            {
              padding: buttonPadding,
              borderColor: buttonBorderColor,
            }
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: buttonTextColor
              }
            ]}
          >
            Open options
          </Text>
        </View>
      </Pressable>
      {/* <Button
        onPress={startBackgroundTask}
        title="Start"
      />
      <Button
        onPress={stopBackgroundTask}
        title="Stop"
      /> */}
      <Modal
        isVisible={isSearchModalVisible}
        onRequestClose={() => setIsSearchModalVisible(!isSearchModalVisible)}
        animationInTiming={1000}
        animationOutTiming={1000}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={1000}
      >
        <View
          style={{
            backgroundColor: 'black',
            padding: '5%',
            borderRadius: Platform.OS === 'ios' ? '12px' : 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 2,
            }}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: 'white',
                }
              ]}
            >
              Search Options
            </Text>
          </View>
          <View
            style={{
              width: '100%',
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 10,
                fontFamily: 'Varukers',
                padding: 2,
              }}
            >
              Address:
            </Text>
            <TextInput
              placeholder="Address" value={address} onChangeText={setAddress}
              style={{
                backgroundColor: 'white',
                color: 'black',
                // fontFamily: 'Varukers',
                padding: 2,
                width: '100%',
                marginBottom: 2,
                borderRadius: 6,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Pressable
              onPress={() => setIsSearchModalVisible(!isSearchModalVisible)}
              onPressIn={searchModalCloseButtonHold}
              onPressOut={searchModalCloseButtonRelease}
            >
              <View
                style={[
                  styles.button,
                  {
                    padding: closeButtonPadding,
                    borderColor: closeButtonBorderColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 4,
                  }
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: closeButtonTextColor
                    }
                  ]}
                >
                  Close
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={geocodeLoc}
              onPressIn={searchModalSendButtonHold}
              onPressOut={searchModalSendButtonRelease}
            >
              <View
                style={[
                  styles.button,
                  {
                    padding: sendButtonPadding,
                    borderColor: sendButtonBorderColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginHorizontal: 4,
                  }
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    {
                      color: sendButtonTextColor,
                    }
                  ]}
                >
                  Send
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '80%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'black',
  },
  button: {
    borderWidth: Platform.OS === 'ios' ? '4px' : 4,
    borderRadius: Platform.OS === 'ios' ? '12px' : 12,
    marginTop: '5%',
    // marginBottom: '2%',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Varukers',
  }
});