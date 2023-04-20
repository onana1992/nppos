import React, { useState } from 'react';
import { View, Text, Image, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ListItem } from '@rneui/themed';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { images } from '../assets';


export default function SideMenuScreen() {

    const [modalProfilVisible, setModalProfilVisible] = useState(false);
    const { user, signin, profil_url } = useSelector<any, any>(state => state.userReducer);
    const [userVal, setUserVal] = useState(user.user);
    const [profil_urlVal, setprofil_urlVal] = useState(profil_url);
    const [filePath, setFilePath] = useState("");
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigation = useNavigation();

    var val = useSelector<any, any>(state => state.userReducer);
    console.log(val)

   // console.log("userrr", user)

    const signoutAlert= ()=>{

        Alert.alert(
            t('logout') || "",
            t('signoutConfirmMessage') || "",
          [{
              text: t('no') || "",
              onPress : () => {return null},
              style : 'cancel'
            },
            {
                text: t('yes') || "",
              onPress : () => {signout()} 
            }]
        );  
    }

   
    const signout= ()=>{
        const action1 = { type: "SIGN_OUT", };
        dispatch(action1)

    }
 
    const viewProfil= ()=> {
        setModalProfilVisible(true);
    }
 
    React.useEffect(() => {
        setFilePath(profil_url);
    },[profil_url]);

    


    return (

        <View style={{ flex: 1, }} >
            <DrawerContentScrollView /*{...props}*/>

                <View style={styles.drawerContent}>

                    <View style={{height:200, marginTop: -10,flex:1,  justifyContent:'center', alignItems:'center', padding:0, backgroundColor:"#009387"}}>
                      <View style={styles.avatar} onPress={()=>{viewProfil()}}>
                        <Image
                            style={styles.avatarImage}
                            source={filePath ? {uri:filePath} : images.avatar}
                        />
                      </View>

                      <View style={{ justifyContent:'center', alignItems:'center',}}>
                            <Text style={{ color: '#fff', paddingTop: 10, fontSize: 16, fontWeight: 'bold' }}>{userVal?.prenom} {userVal?.nom } </Text>
                            <Text style={{ color: '#fff', paddingTop: 0 }}> +237 {userVal?.telephone}</Text>
                      </View >
                    </View>

                    <View style={{ marginTop: 10, padding: 8 }}>



                        <ListItem bottomDivider  onPress={() => navigation.navigate('launch')}>
                            <Ionicons name="home" size={22} color="black" />
                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize: 14, marginLeft: 10 }}>{t('home')}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>

                        {/*<ListItem bottomDivider style={styles.list}  onPress={() => navigation.navigate('MyAccountsScreen')}>
			        		<MaterialCommunityIcons name="account-cash" size={22} color="black"/>
					        <ListItem.Content>
					          <ListItem.Title style={{fontSize:14, marginLeft:10 }}>{I18n.t('myaccounts')}</ListItem.Title>
					        </ListItem.Content>
			        		<ListItem.Chevron />
		      			</ListItem>


                        <ListItem bottomDivider style={styles.list}  onPress={() => navigation.navigate('MyContactsScreen')}>
                          <MaterialIcons name="perm-contact-cal" size={22} color="black"/>
                          <ListItem.Content>
                            <ListItem.Title style={{fontSize:14,marginLeft:10 }}>{I18n.t('mycontacts')}</ListItem.Title>
                          </ListItem.Content>
                          <ListItem.Chevron />
                        </ListItem>

                        <ListItem bottomDivider style={styles.list}  onPress={() => navigation.navigate('MessageScreen')}>
                          <Ionicons name="ios-chatbubble-ellipses-sharp" size={22} color="black"/>
                          <ListItem.Content>
                            <ListItem.Title style={{fontSize:14,marginLeft:10 }}>{I18n.t('mymessages')}</ListItem.Title>
                          </ListItem.Content>
                          <ListItem.Chevron />
                        </ListItem>
                     

                        <ListItem bottomDivider style={styles.list}  onPress={() => navigation.navigate('SettingScreen')}>
                          <Ionicons name="settings" size={22} color="black"/>
                          <ListItem.Content>
                            <ListItem.Title style={{fontSize:14,marginLeft:10 }}>{I18n.t('settings')}</ListItem.Title>
                          </ListItem.Content>
                          <ListItem.Chevron />
                        </ListItem>

                        <ListItem bottomDivider style={styles.list}  onPress={() => navigation.navigate('HelpScreen')}>
                          <Ionicons name="md-information-circle" size={22} color="black"/>
                          <ListItem.Content>
                            <ListItem.Title style={{fontSize:16,marginLeft:10 }}>{I18n.t('help')}</ListItem.Title>
                          </ListItem.Content>
                          <ListItem.Chevron />
                        </ListItem>*/}

                        <ListItem bottomDivider  onPress={() => navigation.navigate('SettingScreen')}>
                            <Ionicons name="settings" size={22} color="black" />
                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize: 14, marginLeft: 10 }}>{t('settings')}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>


                    </View>

                </View>


                {/*<ProfilImgModal modalProfilVisible={modalProfilVisible} setModalProfilVisible={setModalProfilVisible}/> */}


            </DrawerContentScrollView>

            <View style={styles.bottomDrawerSection}>

                <TouchableOpacity onPress={() => signoutAlert()} style={{justifyContent:'center', alignItems:'center', paddingTop:15}}>
                    <Text style={{color:'#009387',fontSize:16, fontWeight:'bold'}}>{t('logout').toUpperCase()}</Text>
                </TouchableOpacity>
                

                <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                    <Text style={{ color: 'gray', fontSize: 12 }}> Version 1.0.0 </Text>
                    <Text style={{ color: 'gray', fontSize: 12 }}> Powered by NanoTech Sarl</Text>
                </View>

            </View>

        </View>
    );
}


const styles = StyleSheet.create({

    drawerContent: {
        flex: 1,
    },

    userInfoSection: {
        padding: 10,
    },

    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
        color: '#fff',
        padding: 5,
    },

    caption: {
        fontSize: 14,
        lineHeight: 16,
        color: '#fff',
        paddingLeft: 5
    },

    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },

    section: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },

    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },

    drawerSection: {
        marginTop: 15,
    },

    bottomDrawerSection: {
        marginBottom: 15,
        //borderTopColor: '#f4f4f4',
        //borderTopWidth: 1
    },

    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },

    avatar: {
        alignItems: 'center',
    },

    avatarImage: {
        height: 100,
        width: 100,
        overflow: 'hidden',
        borderColor: '#ffffff',
        borderWidth: 1,
        borderRadius: 45,
    },

});


