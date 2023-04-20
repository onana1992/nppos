import React from 'react';
import type {PropsWithChildren} from 'react';
import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text, useColorScheme,View} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors, DebugInstructions, Header, LearnMoreLinks, ReloadInstructions } from 'react-native/Libraries/NewAppScreen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import Navigation from "./navigation";
import 'react-native-gesture-handler';
import './localization/i18n';



function App(): JSX.Element {

  const isDarkMode = useColorScheme() === 'dark';
  const colorScheme = useColorScheme();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaProvider>

      <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <StatusBar
              //barStyle={false ? 'light-content' : 'dark-content'}
              animated={true}
              backgroundColor="#009387"
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
