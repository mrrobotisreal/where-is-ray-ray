import { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import MapComponent from './components/MapComponent';
import Map from './screens/Map';
import Loading from './screens/Loading';
import HomeScreen from './components/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const loaded = true;
const screenOptions = {
  headerStyle: {
    backgroundColor: '#000000',
  },
  headerTintColor: '#ffffff',
  headerTitleStyle: {
    fontFamily: 'Varukers',
    textAlign: 'center'
  },
  headerTitleAlign: 'center',
}

export default function App() {
  const [showMap, setShowMap] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  // const [loaded] = useFonts({
  //   Branda: require('./assets/fonts/Branda-yolq.ttf'),
  //   Parchment: require('./assets/fonts/ParchmentMf-Vqge.ttf'),
  //   Global: require('./assets/fonts/Global-mL1qm.ttf'),
  //   Progress: require('./assets/fonts/ProgressPersonalUse-EaJdz.ttf'),
  //   Witches: require('./assets/fonts/TheWitches-mLo59.ttf'),
  //   Varukers: require('./assets/fonts/VarukersPersonalUse-K70Be.ttf'),
  // })
  // console.log(loaded);
  console.log('[APP IS READY? ] -> ', appIsReady);
  console.log('[OS is] -> ', Platform.OS)

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        Branda: require('./assets/fonts/Branda-yolq.ttf'),
        Parchment: require('./assets/fonts/ParchmentMf-Vqge.ttf'),
        Global: require('./assets/fonts/Global-mL1qm.ttf'),
        Progress: require('./assets/fonts/ProgressPersonalUse-EaJdz.ttf'),
        Witches: require('./assets/fonts/TheWitches-mLo59.ttf'),
        Varukers: require('./assets/fonts/VarukersPersonalUse-K70Be.ttf'),
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      console.error(err, err.stack);
    } finally {
      setAppIsReady(true);
    }
  };

  const loadHomeScreen = async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    loadFonts();
  }, []);

  useEffect(() => {
    loadHomeScreen();
  }, [appIsReady])

  // const onLayoutRootView = useCallback(async () => {
  //   if (appIsReady) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!loaded
          ? <Stack.Screen name="loading..." component={Loading} />
          : (
            <>
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  ...screenOptions,
                  title: 'Geo Rekcart',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Map"
                component={Map}
                options={{
                  ...screenOptions,
                  title: 'Map'
                }}
              />
            </>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  }
});
