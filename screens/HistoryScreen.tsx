import React, { useState } from 'react';
import {
    View, Text, StyleSheet,ActivityIndicator,
     ScrollView, Keyboard, TouchableOpacity,
    Share, Dimensions,SectionList} from 'react-native'
import {  Avatar } from '@rneui/themed';
import { Metrics, Colors } from '../Themes';
import { images } from '../assets';
import { useTranslation } from 'react-i18next';
import { getAllHistories } from '../Services/services'
import { useSelector } from 'react-redux';
               



function HistoryScreen() {


    const { width, height } = Dimensions.get('window');
    const baseUrl = 'https://nanoapp-api.herokuapp.com/api';
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [list, setList] = useState([]);
    const [size, setSize] = useState(12);
    const [page, setPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(0);
    const state = useSelector<any, any>(state => state.userReducer);
    const [user, setUser] = useState(state.user.user);
    const { t } = useTranslation();


    const RenderRow = ({ item }: {item:any}) => {

        return (

            <View style={{ flexDirection: 'row', minHeight: 90, padding: 5, borderBottomColor: 'gray', borderBottomWidth: 0.5 }}>


                <View style={{ flex: 2, paddingTop: 5 }}>
                    <Avatar
                        rounded
                        style={{ width: 38, height: 38, borderWidth: 1, borderColor: "gray", borderRadius: 19 }}
                        //source={filePath ? {uri:filePath} : images.avatar}
                        source={images.avatar}
                    />
                </View>

                <View style={{ flex: 8 }}>

                    {
                        item.type == "paiement" && item.tel_caissier == user.telephone &&
                        <>
                            <Text style={{ color: "black", fontSize: 14, fontWeight: 'bold' }}>{item.recepteur.nom} {item.recepteur.prenom} </Text>
                            <Text style={{ color: "black", fontSize: 13 }}>{t('incomingpayment')} </Text>
                            <Text style={{ color: "black", fontSize: 13 }}>{t('from')}  {item.CompteEmetteur.numCompte} {t('to')} {item.CompteRecepteur.numCompte}  </Text>
                        </>
                    }

                    {
                        item.type == "paiementqr" && item.tel_caissier == user.telephone &&
                        <>
                            <Text style={{ color: "black", fontSize: 14, fontWeight: 'bold' }}>{item.recepteur.nom} {item.recepteur.prenom} </Text>
                            <Text style={{ color: "black", fontSize: 13 }}>{t('incomingpayment')} </Text>
                            <Text style={{ color: "black", fontSize: 13 }}>{t('from')}  {item.CompteEmetteur.numCompte} {t('to')} {item.CompteRecepteur.numCompte}  </Text>
                        </>
                    }

                    <Text style={{ color: "gray", fontSize: 12 }}>{time(item.DateTransaction)} </Text>

                </View>

                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'flex-end' }}>

                    {
                        item.type == "paiement" && item.tel_caissier == user.telephone &&
                        <Text style={styles.entrant}>+ {item.montant} FCFA </Text>
                    }

                    {
                        item.type == "paiementqr" && item.tel_caissier == user.telephone &&
                        <Text style={styles.sortant}> + {item.montant} FCFA </Text>
                    }

                </View>
            </View>
        )

    }


    function day(date:Date) {
        const d = new Date(date);
        var month = (d.getMonth() + 1) > 9 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1)
        var jour = d.getDate() > 9 ? d.getDate() : "0" + d.getDate()
        return d.getFullYear() + "-" + month + "-" + jour
    }


    function time(date:Date) {
        const d = new Date(date);
        var hour = d.getHours() > 9 ? d.getHours() : "0" + d.getHours()
        var minute = d.getMinutes() > 9 ? d.getMinutes() : "0" + d.getMinutes()
        return hour + "h:" + minute
    }


   

    const requestHistory = async (size:number, page:number) => {

        setIsLoading(true);
        getAllHistories(user.telephone, page, size).then((response) => {

            console.log(response.data.data);

            if (response.data.success == true) {

                setCurrentPageSize(response.data.data.length)
                var resp = [...list, ...response.data.data]
                setList([...list, ...response.data.data] as never)

                const groupByDate = resp.reduce((group, history) => {
                    const { DateTransaction } = history;
                    const date = day(DateTransaction)
                    group[date] = group[date] ?? [];
                    group[date].push(history);
                    return group;
                }, {});

                var historyTab = []
                for (const [key, value] of Object.entries(groupByDate)) {

                    historyTab.push({
                        jour: key,
                        data: value
                    })
                }

                setHistory(historyTab as never);
                setIsLoading(false);
                setPage(page + 1);

            }

            else {

                setIsLoading(false);
            }


        }).catch(error => {

            //console.log(error);

        })

    }

   

    React.useEffect(() => {

        requestHistory(size, page);

    }, []);


    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 20, marginBottom: 0 }}>
            {!isLoading ?
                <View style={{ marginBottom: 20 }} >
                    {history.length > 0 ?
                        <View>
                            <SectionList
                                sections={history}
                                keyExtractor={(item, index) => item + index}
                                renderItem={({ item }) => <RenderRow item={item} />}
                                renderSectionHeader={({ section: { jour } }) => (
                                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: "black", paddingLeft: 10, paddingTop: 10 }}>{jour}</Text>
                                )}
                            />
                            {
                                currentPageSize == size &&
                                <TouchableOpacity style={styles.button} onPress={() => requestHistory(size, page)}>
                                    <View >
                                        <Text style={[styles.textButton, {
                                            color: '#fff'
                                        }]}>{t('seemoretransactions')}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                        :
                        <View style={{ minHeight: height - 50, justifyContent: 'center', alignItems: "center" }}>
                            <Text style={{ color: 'gray' }}> {t('notransactions')}  </Text>
                        </View>
                    }

                </View>
                :
                <View style={{ flex: 1 }}>

                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color={Colors.background} />
                        <Text style={{ textAlign: 'center', color: 'gray', marginTop: 15, fontSize: 14 }}> {t('pleasewait')}...</Text>
                    </View>

                </View>
            }

        </ScrollView>
    );

}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({

    main_container: {
        flex: 1,
    },

    account: {
        flex: 1,
        marginTop: 5,
        backgroundColor: "#F9F9F8",
        padding: 15,
        borderRadius: 3.84,
        shadowColor: "#000",

    },

    entrant: {
        fontSize: 14,
        color: Colors.header,
    },

    sortant: {
        color: Colors.header,
        fontSize: 14
    },

    loading: {

        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width - Metrics.doubleBaseMargin,
        minHeight: height,
        backgroundColor: "white",
        alignSelf: 'center',
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 2,
    },


    button: {
        width: '100%',
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: "#009387",
        marginTop: 20,
        marginBottom: 40
    },

    textButton: {
        fontSize: 16,
        fontWeight: 'bold'
    },

})



export default (HistoryScreen);


