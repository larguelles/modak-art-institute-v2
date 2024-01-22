import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Home from './src/screens/home';
import Details from './src/screens/details';
import Favorites from './src/screens/favorites';
import SubmitArtwork from './src/screens/submit-artwork';
import {Artwork} from './src/api/store';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  Details: {data: Artwork; uri: string};
  Favorites: undefined;
};

const App = (): React.JSX.Element => {
  const screenOptions = {headerShown: false};

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={screenOptions} />
        <Stack.Screen
          name="Details"
          component={Details}
          options={screenOptions}
        />
        <Stack.Screen
          name="Favorites"
          component={Favorites}
          options={screenOptions}
        />
        <Stack.Screen
          name="SubmitArtwork"
          component={SubmitArtwork}
          options={screenOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
