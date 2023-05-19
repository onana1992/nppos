import React from 'react';
import type {PropsWithChildren} from 'react';
import {SafeAreaView,ScrollView,StatusBar,StyleSheet,Text, useColorScheme,View} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import Navigation from "./navigation";
import {Colors} from './Themes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast, { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import 'react-native-gesture-handler';
import './localization/i18n';


function App(): JSX.Element {

  //const isDarkMode = useColorScheme() === 'dark';
    const colorScheme = useColorScheme();
    const { t } = useTranslation();
    const toastConfig = {



        info: ({ message, props, ...rest }: any) => (
            <View style={styles.message}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                    <Ionicons color="orange" size={25} name="ios-warning" />
                </View>

                <View style={{ flex: 8, paddingLeft: 10 }}>
                    <Text style={styles.textTitle}>{t('info').toUpperCase()}</Text>
                    <Text style={styles.textMessage}>{props.message}</Text>
                </View>
            </View>
        ),

        success: ({ message, props, ...rest }: any) => (
            <View style={styles.success}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                    <Ionicons color="green" size={25} name="checkmark-circle" />
                </View>

                <View style={{ flex: 8, paddingLeft: 10 }}>
                    <Text style={styles.textTitle}>{t('success').toUpperCase()}</Text>
                    <Text style={styles.textMessage}>{props.message}</Text>
                </View>

            </View>
        ),

        failure: ({ message, props, ...rest }: any) => (
            <View style={styles.failure}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
                    <Ionicons color="red" size={25} name="ios-close-circle" />
                </View>

                <View style={{ flex: 8, paddingLeft: 10 }}>
                    <Text style={styles.textTitle}>{t('failure').toUpperCase()}</Text>
                    <Text style={styles.textMessage}>{props.message}</Text>
                </View>

            </View>
        )


    };

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
      <Toast config={toastConfig}  />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({

    success: {
        minHeight: 70, width: '96%', padding: 10,
        borderLeftWidth: 10,
        borderLeftColor: 'green',
        backgroundColor: "#323232",
        borderRadius: 5,
        flexDirection: 'row'
    },

    failure: {
        minHeight: 70, width: '96%', padding: 10,
        borderLeftWidth: 10,
        borderLeftColor: 'red',
        backgroundColor: "#323232",
        borderRadius: 5,
        flexDirection: 'row'
    },

    message: {
        minHeight: 70, width: '96%', padding: 10,
        borderLeftWidth: 10,
        borderLeftColor: 'orange',
        backgroundColor: "#323232",
        borderRadius: 5,
        flexDirection: 'row'
    },

    textTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white'
    },

    textMessage: {
        fontSize: 14,
        color: 'white'
    }

})


export default App;
