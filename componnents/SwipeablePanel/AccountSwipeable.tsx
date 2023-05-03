import React, { useState } from 'react';
import {
    View, StatusBar, TextInput, Text, StyleSheet, FlatList, ActivityIndicator,
    TouchableHighlight, Image, ScrollView, Keyboard, TouchableOpacity,
    Share, Dimensions, RefreshControl, KeyboardAvoidingView,
    TouchableWithoutFeedback, Alert, Platform, SafeAreaView
} from 'react-native'
import { Card, ListItem, Button, Header } from '@rneui/themed';;
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ApplicationStyles, Metrics, Colors } from '../../Themes';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { SwipeablePanel } from 'rn-swipeable-panel';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useSelector, useDispatch } from 'react-redux';


type propsType = {
    accounts: any[],
    setAccountPanelActive: (val: boolean) => void,
    accountPanelActive: boolean
}


function AccountSwipeable({ accounts, setAccountPanelActive, accountPanelActive }:propsType) {


    const { width, height } = Dimensions.get('window');
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const state = useSelector<any, any>(state => state.userReducer);

    console.log(accounts)


    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: true,
        showCloseButton: true,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
    });

    const closePanel = () => {
        setAccountPanelActive(false);

    };


    const selectAccount = (item: any) => {
        const action = { type: "SET_ACCOUNT", value:item };
        dispatch(action); 
        setAccountPanelActive(false)
    }


    const renderRow = ({ item }:any) => {
        return (

            <TouchableOpacity style={state.pro_account?.numCompte == item.numCompte ? styles.accountSelected: styles.account} onPress={() => { selectAccount(item) }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 5 }}>
                        <Text style={{ color: 'black', fontSize: 14, paddingTop: 3, paddingLeft: 5, fontWeight: "bold" }}>{item.nomCompte}</Text>
                        <Text style={{ color: 'black', fontSize: 14, paddingTop: 3, paddingLeft: 5 }}>{item.numCompte}</Text>
                    </View>

                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                        <Ionicons name="chevron-forward-sharp" size={20} color="gray" />
                    </View >
                </View>
            </TouchableOpacity>
        )

    }


    return (
        <SwipeablePanel {...panelProps} isActive={accountPanelActive} style={{ height: accounts.length <= 1 ? 170 : accounts.length * 130, padding: 5 }}>

            <View>
                <View style={{ flex: 1, marginBottom: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4C4C4C', marginTop: 10 }}> {t('chooseanaccount')}</Text>
                </View>
            </View>

            <FlatList
                data={accounts}
                renderItem={renderRow}
                keyExtractor={item => item.id.toString() }
            />
        </SwipeablePanel>
    );

}


const styles = StyleSheet.create({

    main_container: {
        flex: 1,
    },

    account: {
        width: '100%',
        flex: 1,
        marginTop: 6,
        backgroundColor: "#F9F9F8",
        padding: 10,
    },

    accountSelected: {
        width: '100%',
        flex: 1,
        marginTop: 6,
        backgroundColor: "#F9F9F8",
        padding: 10,
        borderWidth: 2,
        borderColor: "green"
    }

})



export default AccountSwipeable;


