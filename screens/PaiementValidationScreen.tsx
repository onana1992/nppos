import React, { useState } from 'react';
import {
	View, StyleSheet, Keyboard, TouchableOpacity, Share,
	Dimensions, RefreshControl,
	KeyboardAvoidingView, TouchableWithoutFeedback,
	Alert, Platform, SafeAreaView, Text, ActivityIndicator, TextInput
} from 'react-native';

/*import { Card, ListItem, Button, Header } from 'react-native-elements';*/
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ApplicationStyles, Metrics, Colors } from '../Themes';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import Modal from "react-native-modal";
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';
import { RSA } from 'react-native-rsa-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';

function PaiementValidationScreen() {

	const state = useSelector<any, any>(state => state.userReducer);
	const [saveAccount, setSaveAccount] = useState(state.pro_account);
	const [user, setUser] = useState(state.user.user);
	const { amount } = useRoute<any>().params;
	const { t } = useTranslation();

	console.log(saveAccount.numCompte.slice(0, 9))
	//console.log(user)

	
	const { width, height } = Dimensions.get('window');
	const [profilReceiver, setProfilReceiver] = useState(null);
	const [enabled, setEnabled] = React.useState(null);
	const [inWaiting, setInWaiting] = useState(true);
	const [inProcess, setInprocess] = useState(false);
	const [inEnd, setInEnd] = useState(false);
	const [succeed, setSucceed] = useState(false);
	const [failed, setFailed] = useState(false);
	const [nip, setNip] = useState("");
	const [failure, setFailure] = useState("failure1");
	const [authRequired, setAuthRequired] = useState(false);
	const baseUrl = 'https://nanoapp-api.herokuapp.com/api';
	const [senderAccount, setSenderAccount] = useState("");

	


	async function readTag() {

		let blockData = [];
		let blockAccountData = [];
		let respAccountBytes = [];
		let numCompte = null;
		let numCompteEnc = null;
		let data = null;
		let pk = null;
		setInWaiting(true);


		try {

			await NfcManager.requestTechnology(NfcTech.NfcA);

			/**********************************extraction du num�ro de compte*******************/

			const respAccountBytes = await NfcManager.nfcAHandler.transceive([0x30, 5]);
			if (respAccountBytes.length !== 16) {
				throw new Error('fail to read');
			}
			else {
				for (var k = 0; k < respAccountBytes.length; k++) {
					blockAccountData.push(respAccountBytes[k])
				}

				blockAccountData = blockAccountData.slice(0, 11);

				numCompteEnc = blockAccountData.reduce((acc, c) => {
					return acc + c;
				}, '');

				numCompte = numCompteEnc.slice(0, 9) + "-" + numCompteEnc.slice(9, 11)

				setSenderAccount(numCompte);
				console.log("le num�ro de compte ", numCompte);

			}

			/**********************************extraction de la signature *************************/
			var i = 0
			var j = 8

			//lecture de 36 block au lieu de 33 
			while (i <= 36 / 4) {

				const respBytes = await NfcManager.nfcAHandler.transceive([0x30, j]);
				if (respBytes.length !== 16) {
					throw new Error('fail to read');
				}
				else {
					for (var k = 0; k < respBytes.length; k++) {
						blockData.push(respBytes[k])
					}

				}

				i++;
				j = j + 4;

			}

			var m = 0;
			while (m < 30) {
				blockData.pop();
				m++;
			}

			let signature = blockData.reduce((acc, c) => {
				return acc + String.fromCharCode(c);
			}, '');

			//console.log(blockData);
			console.log("la signature est ", signature);



			/****************************requete de la cl� public li� au compte*******************/

			try {

				setInprocess(true);
				setInWaiting(false);
				var url = `${baseUrl}/user/compte/info/${numCompte}`;
				const response = await axios.get(url);
				//console.log(response.data.data.parametre)


				if (response.data.success == true && response.data.data.parametre != null) {

					// cl� publique  trouv�
					pk = response.data.data.parametre.publickey;
					data = response.data.data.parametre.uid + numCompteEnc;
					console.log("la cl� public est", pk);
					console.log(data);

					//********************************verification de la signature ***********************/

					let result = await RSA.verify(signature, data, pk)
					


					if (!result) {
						console.log("La signature n'est v�rifier");

						// cas 1 : la signature n'est pas v�rifier
						setInprocess(false);
						setAuthRequired(false);
						setFailed(true);
						setSucceed(false);
						setInEnd(true);
						setFailure("failure1")

					} else {

						// cas 2 : la signature est v�rifier
						console.log("La signature est v�rifier");
						setInprocess(false);
						/***************************envois de la requete de la transaction *****************/
						send(numCompte, "xxxx");
					}



				}
				else {

					// cas 3 : cl� public non trouv� 	 
					setInWaiting(false);
					setInprocess(false);
					setAuthRequired(false);
					setFailed(true);
					setSucceed(false);
					setInEnd(true);
					setFailure("failure1");

				}


			} catch (error) {

				console.log(error)

			}



		} catch (ex) {
			console.log(ex);
		} finally {
			NfcManager.cancelTechnologyRequest();
		}
	}




	const send = (numCompteEmetteur:string, nip:string) => {

		let senderPhone = numCompteEmetteur.slice(0,9);
		let senderAccount = numCompteEmetteur;
		console.log("num �metteur ", senderPhone);
		console.log("compte recepteur ", senderAccount);

		setInprocess(true);

		axios(
			{
				method: 'post',
				url: `${baseUrl}/transaction/create/`,
				data: {
					senderPhone: senderPhone,
					senderaccount: senderAccount,
					receiverPhone: saveAccount.numCompte.slice(0, 9),
					receiverAccount: saveAccount.numCompte,
					montant: amount,
					type: "paiement",
					nip: nip
				},
				headers: { "Content-Type": "multipart/form-data", "accept": "application/json" },
			}
		).then(response => {

			console.log(response.data);

			if (response.data.succes == true) {

				setInprocess(false);
				setAuthRequired(false);
				setFailed(false);
				setSucceed(true);
				setInEnd(true);

			}
			else {

				if (response.data.detail == "Disabled account") {
					setFailure("failure2");
					setInprocess(false);
					setAuthRequired(false);
					setFailed(true);
					setSucceed(false);
					setInEnd(true);
				}

				else if (response.data.detail == "insufficient balance") {
					setFailure("failure3");
					setInprocess(false);
					setAuthRequired(false);
					setFailed(true);
					setSucceed(false);
					setInEnd(true);
				}
				else if (response.data.detail == "Invalid nip") {
					setFailure("failure4");
					setInprocess(false);
					setAuthRequired(false);
					setFailed(true);
					setSucceed(false);
					setInEnd(true);
				}
				else if (response.data.detail == "autorisation required") {
					setInprocess(false);
					setAuthRequired(true);
					setFailed(true);
					setSucceed(false);
					setInEnd(false);

				}



			}


		}).catch(function (error) {




		})

	}


	const sendAutorisation = () => {
		send(senderAccount, nip);
	}


	const endProcess = () => {
		//setModalVisible(false);
		setInprocess(false);
		setAuthRequired(false);
		setFailed(false);
		setSucceed(false);
		setInEnd(false);
		setInWaiting(true);
		//setMontant("");
		//setIsvalidMontant(false);
		setNip("");
		NfcManager.cancelTechnologyRequest();
	}




	React.useEffect(() => {
			readTag();
			
	}, []);



	return (

		<View style={{ flex: 3 }}>

			<View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', marginTop: 0 }}>
				<Text style={{ fontSize: 20, color: "black", fontWeight: "bold"  }}>{t('totalamount') }</Text>
				<Text style={{ fontSize: 40, color: "#009387", fontWeight: "bold", position: 'relative'}}>{amount}<Text style={{ fontSize: 18, fontWeight: "bold" }}> FCFA</Text></Text>
			</View>

			<View style={{ flex: 8 }}>

				{
					inWaiting &&

					<View style={{ flex: 6, alignItems: "center", justifyContent: 'center' }}>
						<Text style={{ padding: 20, fontSize: 16, color: 'black', fontWeight: "bold" }}>{t('presentyourcard')}</Text>
						<MaterialCommunityIcons name="contactless-payment-circle-outline" size={120} color="black" />
					</View>
				}

				{
					inProcess && !inWaiting &&

					<View style={{ flex: 6, alignItems: "center", justifyContent: 'center' }}>
						<ActivityIndicator size="large" color={Colors.background} />
						<Text style={{ padding: 20, fontSize: 16, color: 'gray' }}> {t('processing1')}</Text>
					</View>
				}

			</View>

			<View style={{ flex: 1, alignItems:"center" }}>
				<Text style={{ padding: 20, fontSize: 16, color: '#009387', fontWeight: "bold" }}>Nano Pay</Text>
			</View>
		
				

				{/*<View style={{ flex: 10, padding: 15 }}>

					

					


					


					{
						authRequired && !inProcess && !inWaiting &&
						<View style={{ flex: 6, alignItems: "center", justifyContent: 'center' }}>
							<MaterialCommunityIcons name="key-outline" size={150} color={Colors.text} />
							<Text style={{ padding: 20, fontSize: 16, color: 'gray', textAlign: 'center' }}>{t('authorizationrequired')}</Text>
						</View>
					}



					{
						!inWaiting && succeed && !authRequired &&
						<View style={{ flex: 6, alignItems: "center", justifyContent: 'center' }}>
							<Ionicons name="checkmark-done-circle-outline" size={150} color="green" />
							<Text style={{ padding: 20, fontSize: 16, color: 'green' }}> {t('paymentmadesuccessfully')}  </Text>
						</View>
					}

					{
						!inWaiting && failed && !authRequired &&
						<View style={{ flex: 6, alignItems: "center", justifyContent: 'center' }}>
							<Ionicons name="ios-warning" size={150} color="red" />
							<Text style={{ padding: 20, fontSize: 16, color: 'red', textAlign: 'center' }}> {t(failure)}</Text>
						</View>
					}

				</View>*/}

				{/*{
					!inWaiting && authRequired &&
					<View style={{ padding: Metrics.doubleBaseMargin, }}>
						<TextInput
							style={styles.textInput}
							value={nip}
							placeholderTextColor="#c4c3cb"
							selectionColor='black'
							keyboardType="numeric"
							placeholder="Entrer votre NIP"
							onChangeText={(value) => setNip(value)}
						/>
					</View>

				}


				{
					authRequired &&
					<View style={{ flex: 2, padding: Metrics.doubleBaseMargin, flexDirection: 'row', }}>

						<View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
							<TouchableOpacity style={styles.buttonModal} onPress={() => endProcess()}>
								<View>
									<Text style={[styles.textButton, {
										color: '#fff'
									}]}>{t('cancel')}</Text>
								</View>
							</TouchableOpacity>
						</View>

						<View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
							<TouchableOpacity style={styles.buttonModal} onPress={() => sendAutorisation()}>
								<View>
									<Text style={[styles.textButton, {
										color: '#fff'
									}]}>{t('confirm')}</Text>
								</View>
							</TouchableOpacity>
						</View>

					</View>
				}

				{
					inEnd &&
					<View style={{ flex: 2, padding: Metrics.doubleBaseMargin, flexDirection: 'row', }}>

						<View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
							<TouchableOpacity style={styles.buttonModal} onPress={() => endProcess()}>
								<View>
									<Text style={[styles.textButton, {
										color: '#fff'
									}]}>{t('close')}</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
				}*/}
		  </View>

	);

}

const styles = StyleSheet.create({

	main_container: {
		flex: 1,
	},


	button: {
		width: '50%',
		height: 35,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: "#009387",
		marginTop: 20
	},

	buttonDisabled: {
		width: '50%',
		height: 35,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: "#33A99F",
	},

	textButton: {
		fontSize: 16,
		fontWeight: 'bold'
	},

	buttonModal: {
		width: '90%',
		height: 35,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: "#009387",
		marginTop: 0
	},

	textInput: {
		height: 40,
		fontSize: 18,
		borderColor: "#009387",
		borderWidth: 1,
	},


	modal: {

		width: Dimensions.get('window').width - Metrics.doubleBaseMargin,
		height: Dimensions.get('window').height - 3 * Metrics.navBarHeight,
		backgroundColor: "white",
		alignSelf: 'center',
		marginVertical: 60,
		marginHorizontal: 20,
		borderRadius: 2,
		borderColor: '#0084BD',
		borderWidth: 0.5,

	},

})





export default PaiementValidationScreen;


