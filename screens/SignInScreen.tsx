import React, { useState } from 'react';
import {
    View, StatusBar, TextInput, Text, StyleSheet,ScrollView, Keyboard, TouchableOpacity, Dimensions, KeyboardAvoidingView,
    TouchableWithoutFeedback, Alert, Platform
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Formik } from 'formik';
import * as Animatable from 'react-native-animatable';
//import { ApplicationStyles, Metrics, Colors } from '../Themes';
import { connect } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Feather from 'react-native-vector-icons/Feather';
import LoadingModal from '../componnents/LoadingModal';


function SignInScreen() {

    const { colors } = useTheme();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const [isLoading, setIsloading] = React.useState(false);
    const baseUrl = 'https://nanoapp-api.herokuapp.com/api/';
    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });


    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }


    const submit = async (user:any, password:any) => {

        setIsloading(true);

        const  setPin= (data:any)=> {
            const action1 = { type: "SET_PIN", value: { pin: data.pin } };
            dispatch(action1)
        }


        const  launch = async (url:any, data:any) => {

           

            const action2 = { type: "SET_PROFIL_URL", value: { url: url } };
            dispatch(action2);

            const action3 = { type: "SIGN_IN", value: { user: data } };
            dispatch(action3);
        }

        const userId = "237"+user

        try {

            var url = `${baseUrl}user/login/${userId}/${password}`;
            const response = await axios.get(url);

            console.log(response.data);

            if (response.data.sucess == true) {


                if (response.data.data.profil.image_url == null) {
                    var url_img:any = null
                } else {
                    var url_img: any = "https://nanoapp-api.herokuapp.com" + response.data.data.profil.image_url
                }

               launch(url_img, response.data.data)

            }
            else {

                Toast.show({
                    type: 'failure',
                    props: { message: t('failureAuth') },
                    position: 'bottom'
                });

            }

            setIsloading(false);

        } catch (error) {

            console.log(error)
            setIsloading(false);
        }

    }



    React.useEffect(() => {


    }, []);


    React.useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {

        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, []);



    return (

        <View style={styles.container}>

            <StatusBar backgroundColor='#009387' barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.text_header}>{t('welcome')}</Text>
            </View>

            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >

                <ScrollView>
                    <View style={{ marginTop:10 }}>
                        <Text style={styles.text_header2} >{t('welcomeback')}</Text>
                    </View>

                    <View style={{ marginBottom: 30 }}>
                        <Text style={styles.text_tip} >{t('letsignin')}</Text>
                    </View>

                    <Formik

                        initialValues={{ username: "", password: "" }}
                        onSubmit={(values, { setSubmitting }) => {
                            submit(values.username, values.password);
                        }}

                        validate={values => {
                            const errors = {};
                            if (!values.username) {
                                errors.username = t('requiredValue')
                            }

                            if (!values.password) {
                                errors.password = t('requiredValue')
                            }
                            return errors;
                        }}
                    >

                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (

                            <KeyboardAvoidingView style={{ flex: 1 }}>
                                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                    <View style={{}}>

                                        <View>
                                            <Text style={styles.text_footer}>{t('mobilePhone')} *</Text>
                                            <View style={styles.action}>

                                                <Feather
                                                    name="phone"
                                                    color="#05375a"
                                                    size={18}
                                                />

                                                <Text style={{ paddingLeft: 10, color: '#05375a', fontWeight: 'bold' }}>237</Text>

                                                <TextInput
                                                    placeholder={t('yourmobile')}
                                                    keyboardType="numeric"
                                                    style={styles.textInput}
                                                    autoCapitalize="none"
                                                    name="username"
                                                    onChangeText={handleChange('username')}
                                                    onBlur={handleBlur('username')}
                                                    maxLength={9}
                                                    value={values.username}
                                                />


                                            </View>

                                            {touched.username && errors.username &&
                                                <Animatable.View animation="fadeInLeft" duration={500}>
                                                    <Text style={styles.errorMsg}> {touched.username && errors.username} </Text>
                                                </Animatable.View>
                                            }

                                        </View>

                                        <View>

                                            <Text style={[styles.text_footer, { marginTop: 35 }]}>{t('password')}</Text>
                                            <View style={styles.action}>
                                                <Feather
                                                    name="lock"
                                                    color={colors.text}
                                                    size={18}
                                                />
                                                <TextInput
                                                    placeholder={t('yourpassword')}
                                                    secureTextEntry={data.secureTextEntry ? true : false}
                                                    style={styles.textInput}
                                                    autoCapitalize="none"
                                                    name="password"
                                                    onChangeText={handleChange('password')}
                                                    onBlur={handleBlur('password')}
                                                    value={values.password}
                                                />
                                                <TouchableOpacity
                                                    onPress={updateSecureTextEntry}
                                                >
                                                    {data.secureTextEntry ?
                                                        <Feather
                                                            name="eye-off"
                                                            color="grey"
                                                            size={20}
                                                        />
                                                        :
                                                        <Feather
                                                            name="eye"
                                                            color="grey"
                                                            size={20}
                                                        />
                                                    }
                                                </TouchableOpacity>
                                            </View>


                                            {
                                                touched.password && errors.password &&
                                                <Animatable.View animation="fadeInLeft" duration={500}>
                                                    <Text style={styles.errorMsg}> {touched.password && errors.password} </Text>
                                                </Animatable.View>
                                            }

                                        </View>

                    
                                        <View style={styles.button}>

                                            <TouchableOpacity
                                                style={styles.signIn}
                                                onPress={handleSubmit}
                                            >

                                                <Text style={[styles.textSign, {
                                                    color: '#fff'
                                                }]}>{t('signin')}
                                                </Text>

                                            </TouchableOpacity>
                                        </View>

                                     </View>
                                </TouchableWithoutFeedback>
                            </KeyboardAvoidingView>
                        )}
                    </Formik>
                </ScrollView>
            </Animatable.View>

            <LoadingModal isLoading={isLoading} setIsloading={setIsloading}/>

        </View>
    );

}


const { height } = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 6 : 6,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 16,

    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 0
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        fontSize: 16
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 12,
    },
    button: {
        alignItems: 'center',
        marginTop: 45
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: "#009387"
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    },

    text_header2: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
        color: 'black'
    },

    text_tip: {
        textAlign: 'center',
        color: 'gray',
        fontSize: 16
    },
});

export default SignInScreen




