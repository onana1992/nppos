import { ColorSchemeName } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import HomeScreen from "../screens/HomeScreen";
import SettingScreen from "../screens/SettingScreen";
import SignInScreen from "../screens/SignInScreen";
import PaiementValidationScreen from "../screens/PaiementValidationScreen";
import { useSelector, useDispatch } from 'react-redux';

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
                                  backgroundColor: '#009387',
                                  //backgroundColor: '#009387',
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
                                  backgroundColor: '#009387',
                                  //backgroundColor: '#009387',
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
                                  backgroundColor: '#009387',
                              }
                          }}
                      />

                      <Stack.Screen
                          name="PaiementValidationScreen"
                          component={PaiementValidationScreen}
                          options={{
                              title: t('payment') || "dd",
                              headerTintColor: '#fff',
                              headerStyle: {
                                  backgroundColor: '#009387',
                              }
                          }}
                      />

                      

              </>
                  

          }
          

      </Stack.Navigator>
  )
}



