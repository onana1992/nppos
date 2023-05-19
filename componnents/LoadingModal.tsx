
import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ActivityIndicator, Keyboard, TouchableOpacity,
    Dimensions, TouchableWithoutFeedback, Alert, Platform
} from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../Themes';
import { useTranslation } from 'react-i18next';
import Modal from "react-native-modal";


type propType = {
    isLoading: boolean
    setIsloading: (parm: boolean) => void
}


function LoadingModal({ isLoading, setIsloading }: propType) {

    const { t } = useTranslation();


    return (

        <Modal
            backdropOpacity={0.7}
            isVisible={isLoading}
            onRequestClose={() => {
                setIsloading(!isLoading);
            }}
        >


            <View style={styles.modal}>

                <View style={{ height: '90%', alignItems: "center", justifyContent: 'center', backgroundColor: "white" }}>
                    <ActivityIndicator size="large" color={Colors.background} />
                    <Text style={{ padding: 20, fontSize: 14, color: 'black' }}> {t('processing')}... </Text>
                </View>


                <View style={{ alignItems: "center", borderColor: "#009387", borderBottomRightRadius: 5, borderBottomLeftRadius: 5, height: '10%', justifyContent: 'center', backgroundColor: "#009387", padding: -10 }}>
                    <Text style={{ padding: 5, textAlign: "center", fontSize: 12, color: 'white' }}> Nano Pay </Text>
                </View>

            </View>


        </Modal>

    );

}


const styles = StyleSheet.create({

    main_container: {
        flex: 1,
    },

    modal: {
        width: Dimensions.get('window').width / 1.1 - Metrics.doubleBaseMargin,
        height: Dimensions.get('window').height / 1.3 - 3 * Metrics.navBarHeight,
        alignSelf: 'center',
        marginVertical: 60,
        marginHorizontal: 20,
        borderRadius: 5,
        borderColor: '#009387',

    },

})




export default LoadingModal;


