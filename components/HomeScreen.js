import { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Button, Pressable } from 'react-native';
import MapComponent from './MapComponent';
import { Image } from 'expo-image';
import RayRay from '../assets/Ray_Ray.png';
// "https://picsum.photos/seed/696/3000/2000"

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function HomeScreen({ navigation }) {
  const [showMap, setShowMap] = useState(false);
  const [buttonBorderColor, setButtonBorderColor] = useState('white');
  const [buttonTextColor, setButtonTextColor] = useState('white');
  const [buttonPadding, setButtonPadding] = useState('5%');

  const goToMap = () => {
    navigation.push('Map');
  }

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: 'white',
          fontFamily: 'Varukers',
          fontSize: 10,
          padding: '10%',
          marginTop: '5%',
        }}
      >
        Welcome to...
      </Text>
      <Text
        style={{
          color: 'red',
          fontFamily: 'Varukers',
          fontSize: 20,
          paddingBottom: '10%',
        }}
      >
        Where in the world is Ray Ray?
      </Text>
      <Image
        style={[
          styles.image,
        ]}
        source={RayRay}
        placeholder={Platform.OS === 'ios' ? blurhash : null}
        contentFit="cover"
        transition={3000}
      />
      <Pressable
        onPress={goToMap}
        onPressIn={() => {
          setButtonBorderColor('red');
          setButtonTextColor('red');
          setButtonPadding('4%');
        }}
        onPressOut={() => {
          setButtonBorderColor('white');
          setButtonTextColor('white');
          setButtonPadding('5%');
        }}
      >
        <View
          style={{
            padding: buttonPadding,
            borderColor: buttonBorderColor,
            borderWidth: Platform.OS === 'ios' ? '4px' : 4,
            borderRadius: Platform.OS === 'ios' ? '12px' : 12,
            marginTop: '5%',
            marginBottom: '5%',
          }}
        >
          <Text
            style={{
              color: buttonTextColor,
              fontFamily: 'Varukers',
              fontSize: 20,
              // padding: '5%',
              // borderColor: 'white',
              // borderWidth: '4px'
            }}
          >
            Show Map
          </Text>
          {/* <Button
            onPress={goToMap}
            title="Show Map"
          /> */}
        </View>
      </Pressable>
      {/* {showMap
        ? (
          <MapComponent
            showMap={showMap}
            setShowMap={setShowMap}
          />
        )
        : null
      } */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0553',
  },
});