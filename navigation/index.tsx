import React from 'react';
import { ColorSchemeName } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import { useTranslation } from 'react-i18next';
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import SignInScreen from "../screens/SignInScreen";
import HistoryScreen from "../screens/HistoryScreen"
import PaiementValidationScreen from "../screens/PaiementValidationScreen";
import { useSelector, useDispatch } from 'react-redux';
import { Colors } from '../Themes';


type propType ={
 colorScheme: ColorSchemeName
}



export default function Navigation({colorScheme}: propType) {

  return (
    <NavigationContainer
      theme={colorScheme == "light" ? DefaultTheme : DarkTheme}>
          <RootNavigator />
    </NavigationContainer>
  )

}


const Stack = createNativeStackNavigator();

function RootNavigator() {

    const { t } = useTranslation();
    const { user, signin } = useSelector<any, any>(state => state.userReducer);
 
   // console.log(signin);
   // console.log(user);
    //hide Splash screen on app load.
    React.useEffect(() => {
        SplashScreen.hide();
    });




  return (
      <Stack.Navigator>

          {
              !signin ?
              <>
                      <Stack.Screen
                          name="SignInScreen"
                          component={SignInScreen}
                          options={{
                              title: "",
                              headerTintColor: '#fff',
                              headerTitleAlign: 'center',
                              headerStyle: {
                                  backgroundColor: Colors.header
                              },
                              headerShown: false,
                          }}
                      />
              
              </>
               :
              <>
                      <Stack.Screen
                          name="HomeScreen"
                          component={HomeScreen}
                          options={{
                              title: "",
                              headerTintColor: '#fff',
                              headerTitleAlign: 'center',
                              headerStyle: {
                                  backgroundColor: Colors.header
                              },
                              headerShown: false,
                          }}
                      />

                      <Stack.Screen
                          name="SettingScreen"
                          component={SettingScreen}
                          options={{
                              title: t('settings') || "dd",
                              headerTintColor: '#fff',
                              headerStyle: {
                                  backgroundColor: Colors.header
                              }
                          }}
                      />

                      <Stack.Screen
                          name="PaiementValidationScreen"
                          component={PaiementValidationScreen}
                          options={{
                              title: t('payment') || "",
                              headerTintColor: '#fff',
                              headerStyle: {
                                  backgroundColor: Colors.header
                              }
                          }}
                      />

                      
                      <Stack.Screen
                          name="HistoryScreen"
                          component={HistoryScreen}
                          options={{
                              title: t('TransactionHistory') || "",
                              headerTintColor: '#fff',
                              headerStyle: {
                                  backgroundColor: Colors.header,
                              }
                          }}
                      />

                      

              </>
                  

          }
          

      </Stack.Navigator>
  )
}



