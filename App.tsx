import React from 'react';
import type {PropsWithChildren} from 'react';
import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text, useColorScheme,View} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import Navigation from "./navigation";
import {  Colors } from './Themes';

import 'react-native-gesture-handler';
import './localization/i18n';



function App(): JSX.Element {

  //const isDarkMode = useColorScheme() === 'dark';
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>

      <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <StatusBar
               animated={true}
               backgroundColor={Colors.header }
            />
            <Navigation colorScheme={colorScheme} />
          </PersistGate>
      </Provider>
      
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
 
});

export default App;
