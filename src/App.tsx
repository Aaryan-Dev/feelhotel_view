import React, {Suspense} from 'react';
import {Text} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {allRoutes} from './routes.js';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      {allRoutes?.map(component => {
        return (
          <Stack.Screen
            {...component}
            key={component?.key}
            // warning : if key not passed [and] used explicitly without spreading
          />
        );
      })}
    </Stack.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Suspense fallback={<Text>Loading...</Text>}>
        <RootStack />
      </Suspense>
    </NavigationContainer>
  );
}

export default App;
