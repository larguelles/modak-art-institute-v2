import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator();

const App = (): React.JSX.Element => {
  const screenOptions = {headerShown: false};

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={() => null}
          options={screenOptions}
        />
        <Stack.Screen
          name="Details"
          component={() => null}
          options={screenOptions}
        />
        <Stack.Screen
          name="Favorites"
          component={() => null}
          options={screenOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
