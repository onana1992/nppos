import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, TouchableOpacity, AppState } from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import VirtualKeyboard from 'react-native-virtual-keyboard';
import NfcManager from 'react-native-nfc-manager';
import { useSelector, useDispatch } from 'react-redux';
import { Colors } from '../Themes';


export default function PaiementScreen() {

  
    const [amount, setAmount] = React.useState<string>("0");
    const navigation = useNavigation();
    const dispatch = useDispatch<any>();
    const state = useSelector<any, any>(state => state.userReducer);
    const [saveAccount, setSaveAccount] = useState(state.pro_account);
    const [hasNfc, setHasNfc] = React.useState(false);
    const [enabled, setEnabled] = React.useState(true);
    const appState = useRef(AppState.currentState);
    const { t } = useTranslation();

    const keyboardPress = (val:string) => {

         console.log(val)
        if (Number(val)==0) {

            setAmount("0");
          
        } else {
            
            if (val == "") {
                setAmount("0");
            } else {
                setAmount(Number(val).toString());

            }
        }
       

    } 

    

    async function checkNfc() {
          
        const supported = await NfcManager.isSupported();
        if (supported) {
              console.log("Supported");
        }

        setHasNfc(supported);
        setEnabled(await NfcManager.isEnabled()); // only for Android, always
    }



    const validate = () => {
        
        if (!hasNfc) {
            Alert.alert(
                t('Error') || "",
                t('nfcnotsupported') || "",
                [{
                    text: t('close') || "",
                    onPress: () => { return null },
                    style: 'cancel'
                },
                ]
            );
        }
        else if (!enabled) {

           
             Alert.alert(
                t('Error') || "",
                t('nfcnotactivated') || "",
                [{
                    text: t('close') || "",
                    onPress: () => { return null },
                    style: 'cancel'
                },
                    
                {
                    text: t('activatenfcReading') || "",
                    onPress: () => { NfcManager.goToNfcSetting() }
                    }

                ]
             );
             
        }
        else {

             if (Number(amount) <= 0) {

                Alert.alert(
                    t('Error') || "",
                    t('invalidamount') || "",
                    [{
                        text: t('close') || "",
                        onPress: () => { return null },
                        style: 'cancel'
                    },


                    ]
                );


             }
             else {

                 if (state.pro_account == null) {

                     Alert.alert(
                         t('Error') || "",
                         t('selectaccountmessage') || "",
                         [{
                             text: t('close') || "",
                             onPress: () => { return null },
                             style: 'cancel'
                         },


                         ]
                     );

                 }
                 else {

                     navigation.navigate('PaiementValidationScreen' as never, { amount: amount } as never);
                 }
                 

             }

        }
        
          
    }


    useEffect(() => {

        const subscription = AppState.addEventListener("change", nextAppState => {

           // alert();
           // setSaveAccount (state.pro_account);
            checkNfc();
            appState.current = nextAppState;         

        });

        return () => {
            subscription.remove();

        };

    }, []);


    useEffect(() => {

            checkNfc();

    }, []);

 

    return (
   
        <View style={styles.container}>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginRight: 10,  }}>
                <View style={{ width: "100%", alignItems:"center", borderWidth: 0.5, borderColor: "gray", marginTop: 10, padding:5}}>
                    <Text style={{ fontSize: 30, color: Colors.header, fontWeight: "bold", position: 'relative',  }}>{amount}<Text style={{ fontSize: 18, fontWeight: "bold" }}> FCFA</Text></Text> 
                </View>
            </View>

            <View style={{flex:5, justifyContent:'flex-start', alignItems:'flex-start'}}>
                <VirtualKeyboard
                    cellStyle={{ padding: 8, borderWidth:0.5, borderColor: "gray" }}
                    rowStyle={{ width: '100%' }}
                    textStyle={{ fontWeight: 'bold' }}
                    color={Colors.header }
                    pressMode='string'
                    onPress={(val: any) => keyboardPress(val)}
                />
            </View>

            <View style={{ flex: 2, paddingLeft: 30, paddingRight: 30, paddingBottom: 30, justifyContent:'flex-end'}}>
                <TouchableOpacity style={styles.button} onPress={() => validate()}>
                    <Text style={styles.textButton}>{ t('validate') }</Text>
                </TouchableOpacity>
            </View>
     
        </View>
       
    )

}

const styles = StyleSheet.create({

  container: {
    padding: 0,
    flex: 1,
    backgroundColor:"#fff"
  },

  button: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: Colors.header,
        marginTop:20,
       
  },

  textButton: {
        fontSize: 18,
        fontWeight: "100",
        color: "#fff"
  },
  
})
