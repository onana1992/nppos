import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Pressable, } from "react-native";
import { ListItem } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AccountSwipeable from '../componnents/SwipeablePanel/AccountSwipeable';


export default function MenuScreen() {

    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const state = useSelector<any, any>(state => state.userReducer);
    const [user, setUser] = useState(state.user.user);
    const [saveAccount, setSaveAccount] = useState(state.pro_account);
    const [proAccounts, setProAccounts] = useState<any[]>([]);
    const [languagePanelActive, setLanguagePanelActive] = useState(false);
    const [accountPanelActive, setAccountPanelActive] = useState(false);

    //console.log("Save account ",saveAccount);

    const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: true,
        showCloseButton: true,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
    });


    const[panelProps2, setPanelProps2] = useState({
        fullWidth: true,
        openLarge: true,
        showCloseButton: true,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
    });


    const openPanel = () => {
        setLanguagePanelActive(true);
    };

    const closePanel = () => {
        setLanguagePanelActive(false);
    };

    const openPanel2 = () => {
        setAccountPanelActive(true);
    };

    const closePanel2 = () => {
        setAccountPanelActive(false);
    };

    const languageList = [

        {
            id: '0',
            value: 'fr',
            title: 'Francais'
        },

        {
            id: '1',
            value: 'en',
            title: 'English'

        },
    ]; 

    const languageRow = ({ item }:any) => {
        return (
            <ListItem bottomDivider onPress={() => i18n.changeLanguage(item.value)} >
                <ListItem.Content>
                    <ListItem.Title style={{ fontSize: 14 }}>{item.title}</ListItem.Title>
                </ListItem.Content>
                {i18n.language == item.value && <Text><Ionicons color="#0084BD" size={22} name='checkmark'/></Text>}
            </ListItem>
        );
    };

    useEffect(() => {

        let accounts = [...user.comptes];

        let proAccount = accounts.filter((item) => {
            if (item.type == "professionnel") {

                return true
               
            } else {

                return false;

            }       
            
        })

        setProAccounts(proAccount)
         

    }, []);


    return (
        <View style={styles.container}>
            
            <ListItem bottomDivider onPress={() => setAccountPanelActive(true)}>
                <ListItem.Content>
                    <ListItem.Title style={{ fontSize: 14, marginLeft: 10 }}>{t('activepaiementAccount')}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>

            <ListItem bottomDivider onPress={() => setLanguagePanelActive(true)}>
                <ListItem.Content>
                    <ListItem.Title style={{ fontSize: 14, marginLeft: 10 }}>{t('language')}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>

            <SwipeablePanel {...panelProps} isActive={languagePanelActive} style={{ height: 200 }}>

                <View style={{ marginTop: 20 }}>
                    <View style={{ flex: 1, marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16, top: 5, fontWeight: 'bold', color: '#4C4C4C' }}>{t('changelanguage')}</Text>
                    </View>
                </View>

                <FlatList
                    data={languageList}
                    renderItem={languageRow}
                    keyExtractor={item => item.id}
                />

            </SwipeablePanel>

          

             <AccountSwipeable accounts= {proAccounts} setAccountPanelActive={setAccountPanelActive} accountPanelActive={accountPanelActive}/>

    </View>
    )

}

const styles = StyleSheet.create({

  container: {

        flex: 1,
        backgroundColor:"#fff"
  },
  
})
