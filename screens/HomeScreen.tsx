import { StyleSheet, Pressable, } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import SideMenuScreen from './SideMenuScreen';
import PaiementScreen from './PaiementScreen';
import { Colors } from '../Themes';



const Drawer = createDrawerNavigator();

export default function HomeScreen() {

    const navigation = useNavigation();

    return (
        <Drawer.Navigator
            initialRouteName="Launch"
            screenOptions={{
                drawerPosition:'left',
                headerShadowVisible:false,
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
                        backgroundColor: Colors.header, 
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
