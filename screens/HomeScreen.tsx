
import { View, Text, StyleSheet, FlatList, Pressable, } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import SideMenuScreen from './SideMenuScreen';
import PaiementScreen from './PaiementScreen'


const Drawer = createDrawerNavigator();

export default function HomeScreen() {

    const navigation = useNavigation();

    return (
        <Drawer.Navigator
            initialRouteName="Launch"
            screenOptions={{
                drawerPosition:'left',
                headerShadowVisible:false,
                //drawerIcon: () =>{return < Ionicons color='red' size={25} name='menu-outline' />} 
            }}
            drawerContent={(props) => <SideMenuScreen/>}
        >

            <Drawer.Screen 
                name="launch" 
                component={PaiementScreen} 
                options={{
                title:"NP POS",
                headerTitleAlign:'center',
                headerTintColor: '#fff',
                headerStyle: {
                    backgroundColor:"#009387", 
                },
                headerTitleStyle: {
                    fontSize:19,
                    color:"#fff"
                },
                 
                }}
            />

        </Drawer.Navigator>
    
    )

}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
})
