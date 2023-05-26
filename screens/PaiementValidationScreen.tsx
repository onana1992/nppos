import React, { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import {
	View, StyleSheet, Keyboard, TouchableOpacity, Share,
	Dimensions, RefreshControl,
	KeyboardAvoidingView, TouchableWithoutFeedback,
	Alert, Platform, SafeAreaView, Text, ActivityIndicator, TextInput
} from 'react-native';


/*import { Card, ListItem, Button, Header } from 'react-native-elements';*/
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Metrics, Colors } from '../Themes';
import { useTranslation } from 'react-i18next';
import NfcManager, { NfcEvents, NfcTech } from 'react-native-nfc-manager';
import { RSA } from 'react-native-rsa-native';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { lauchTransaction } from '../Services/services';


function PaiementValidationScreen() {

	
	
	const state = useSelector<any, any>(state => state.userReducer);
	const [saveAccount, setSaveAccount] = useState(state.account);
	console.log(state.user);
	const [user, setUser] = useState(state.user.user);
	const { amount } = useRoute<any>().params;
	const { t } = useTranslation();
	const navigation = useNavigation();


	console.log(user.telephone)

	const { width, height } = Dimensions.get('window');
	const [profilReceiver, setProfilReceiver] = useState(null);
	const [enabled, setEnabled] = React.useState(null);
	const [inWaiting, setInWaiting] = useState(true);
	const [inProcess, setInprocess] = useState(false);
	const [inEnd, setInEnd] = useState(false);
	const [succeed, setSucceed] = useState(false);
	const [failed, setFailed] = useState(false);
	const [nip, setNip] = useState("");
	const [cashierPhone, setCashierPhone] = useState(user.telephone);
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

			/**********************************extraction du numéro de compte*******************/

			const respAccountBytes = await NfcManager.nfcAHandler.transceive([0x30, 5]);
			if (respAccountBytes.length !== 16) {
				throw new Error('fail to read');
			}
			else {
				for (var k = 0; k < respAccountBytes.length; k++) {
					blockAccountData.push(respAccountBytes[k])
				}

				console.log(blockAccountData);

				blockAccountData = blockAccountData.slice(0, 14);

				numCompteEnc = blockAccountData.reduce((acc, c) => {
					return acc + c;
				}, '');

				numCompte = numCompteEnc.slice(0, 12)+ "-" + numCompteEnc.slice(12, 14)

				setSenderAccount(numCompte);
				console.log("le numéro de compte ", numCompte);

			}

			/**********************************extraction de la signature *************************/
			var i = 0
			var j = 9

			//lecture de 36 block au lieu de 33 
			while (i < 36 / 4) {// 9 tours donc 144 O

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
			while (m < 14) {
				blockData.pop();
				m++;
			}

			let signature = blockData.reduce((acc, c) => {
				return acc + String.fromCharCode(c);
			}, '');

			//console.log(blockData);
			console.log("la signature est ", signature);



			/****************************requete de la clé public lié au compte*******************/

			try {

				setInprocess(true);
				setInWaiting(false);
				var url = `${baseUrl}/user/compte/info/${numCompte}`;
				const response = await axios.get(url);
				//console.log(response.data.data.parametre)


				if (response.data.success == true && response.data.data.parametre != null) {

					// clé publique  trouvé
					pk = response.data.data.parametre.publickey;
					console.log("num de compte encoder",numCompteEnc);
					data = response.data.data.parametre.uid + numCompteEnc;
					console.log("la clé public est", pk);
					console.log(data);

					//********************************verification de la signature ***********************/
					console.log("taille signature", signature.length);
					let result = await RSA.verify(signature, data, pk)
					


					if (!result) {
						console.log("La signature n'est pas  vérifier");

						// cas 1 : la signature n'est pas vérifier
						setInprocess(false);
						setAuthRequired(false);
						setFailed(true);
						setSucceed(false);
						setInEnd(true);
						setFailure("failure1")

					} else {

						// cas 2 : la signature est vérifier
						console.log("La signature est vérifier");
						setInprocess(false);
						/***************************envois de la requete de la transaction *****************/
						send(numCompte, "xxxx");
					}



				}
				else {

					// cas 3 : clé public non trouvé 	 
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

		let senderPhone = numCompteEmetteur.slice(0,12);
		let senderAccount = numCompteEmetteur;
		/*console.log("num émetteur ", senderPhone);
		console.log("compte émetteur ", senderAccount);
		console.log("num recepteur ", saveAccount.slice(0, 12));
		console.log("compte recepteur", saveAccount);*/

		setInprocess(true);
		/*saveAccount.numCompte.slice(0, 12)*/
		let userNip = nip == "" ? "xxxx":nip
		lauchTransaction(senderPhone, cashierPhone , cashierPhone, senderAccount, saveAccount.numCompte, amount, "paiement", userNip).then(
			(response) => {

				console.log(response.data);

				if (response.data.success == true) {

					setInprocess(false);
					setAuthRequired(false);
					setFailed(false);
					setSucceed(true);
					setInEnd(true);

				}
				else {

					if (response.data.detail == "Card locked") {
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
					else if (response.data.detail == "Disabled account") {
						setFailure("failure5");
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

				console.log(error);


			})


	}


	const sendAutorisation = () => {
		send(senderAccount, nip);
	}


	const endProcess = () => {

		NfcManager.cancelTechnologyRequest();
		navigation.navigate("HomeScreen" as never);

		//setModalVisible(false);
		/*setInprocess(false);
		setAuthRequired(false);
		setFailed(false);
		setSucceed(false);
		setInEnd(false);
		setInWaiting(true);*/
		//setMontant("");
		//setIsvalidMontant(false);
		/*setNip("");
		NfcManager.cancelTechnologyRequest();*/
	}




	React.useEffect(() => {
			readTag();
			
	}, []);



	return (

		<View style={{ flex: 1 }}>

			<View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', marginTop: 0 }}>
				<Text style={{ fontSize: 20, color: "black", fontWeight: "bold"  }}>{t('totalamount') }</Text>
				<Text style={{ fontSize: 40, color: Colors.header, fontWeight: "bold", position: 'relative'}}>{amount}<Text style={{ fontSize: 18, fontWeight: "bold" }}> FCFA</Text></Text>
			</View>

			<View style={{ flex: 7 }}>

				{
					inWaiting &&


					<View style={{ flex: 6, alignItems: "center", justifyContent: 'center' }}>
							<View style={{ flex: 0.8, alignItems: "center", justifyContent: 'center', borderWidth: 1, borderColor: "gray", borderStyle:"dashed" }}>
								<MaterialCommunityIcons name="contactless-payment-circle-outline" size={120} color="black" />
								<Text style={{ padding: 20, fontSize: 16, color: 'black', }}>{t('presentyourcard')}</Text>
							</View>
					</View>
				}

				{
					inProcess && !inWaiting &&

					<View style={{ flex: 6, alignItems: "center", justifyContent: 'center' }}>
							<ActivityIndicator size="large" color={Colors.header} />
						<Text style={{ padding: 20, fontSize: 16, color: 'gray' }}> {t('processing1')}</Text>
					</View>
				}

				{
					authRequired && !inProcess && !inWaiting &&
					
					<View style={{ flex: 6, alignItems: "center", justifyContent: 'center' }}>
						<View style={{ flex: 1, alignItems: "center", justifyContent: 'center', borderWidth: 1, borderColor: "gray", borderStyle:"dashed", width:"90%" }}>
							<Animatable.View animation="pulse" iterationCount="infinite">
									<Text><MaterialCommunityIcons name="key-outline" size={80} color="orange" /></Text>
							</Animatable.View>

							<Text style={{ padding: 10, fontSize: 16, color: 'orange', textAlign: 'center' }}>{t('authorizationrequired')}</Text>
							<View style={{ padding:10, paddingTop: Metrics.doubleBaseMargin, width:"100%" }}>
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
							<View style={{ flex: 2, padding: 5, flexDirection: 'row', }}>

								<View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
									<TouchableOpacity style={styles.buttonModal2} onPress={() => endProcess()}>
										<View>
											<Text style={[styles.textButton2, {
												color: '#fff'
											}]}>{t('cancel')}</Text>
										</View>
									</TouchableOpacity>
								</View>

								<View style={{ flex: 1, alignItems: "center", justifyContent: 'center' }}>
									<TouchableOpacity style={styles.buttonModal2} onPress={() => sendAutorisation()}>
										<View>
											<Text style={[styles.textButton2, {
												color: '#fff'
											}]}>{t('confirm')}</Text>
										</View>
									</TouchableOpacity>
								</View>

							</View>

						</View>
					</View>
				}

				{
					!inWaiting && succeed && !authRequired &&
					<View style={{ flex: 6, alignItems: "center", justifyContent: 'center' }}>
						<View style={{ flex: 0.8, alignItems: "center", justifyContent: 'center', borderWidth: 1, borderColor: "gray", borderStyle:"dashed" }}>

							<Animatable.View animation="pulse" iterationCount="infinite">
								<Text><Ionicons name="checkmark-done-circle-outline" size={150} color="#004d46" /></Text>
							</Animatable.View>
							<Text style={{ padding: 20, fontSize: 16, color: '#004d46', textAlign: "center" }}> {t('paymentmadesuccessfully')}  </Text>
						</View>
					</View>

				}


				{
					!inWaiting && failed && !authRequired &&
					<View style={{ flex: 6, alignItems: "center", justifyContent: 'center' }}>
						<View style={{ flex: 0.8, alignItems: "center", justifyContent: 'center', borderWidth: 1, borderColor: "gray", borderStyle:"dashed" }}>

							<Animatable.View animation="pulse" iterationCount="infinite">
									<Text><Ionicons name="ios-warning" size={140} color="red"/> </Text>
							</Animatable.View>
							<Text style={{ padding: 20, fontSize: 16, color: 'red', textAlign: 'center' }}> {t(failure)}</Text>
						</View>
					</View>
				}


				

				{
					inEnd &&
					
					<View style={{ flex: 0.5, padding: Metrics.doubleBaseMargin, flexDirection: 'row', }}>

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
				}

			</View>


			<View style={{ flex: 2, alignItems: "center", justifyContent: "flex-end", padding:20 }}>
				{ state.mode == "entreprise" &&
					<Text style={{ fontSize: 16, color: "black" }}> {t('paymentissuedto')} <Text style={{ fontWeight: "bold", color: Colors.header } }>{state.account.enterprise.nom}</Text></Text>
				}

				<Text style={{ fontSize: 16, color: Colors.header, fontWeight: "bold" }}> Nano Pay </Text>
			</View>
		
				
			
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
		fontSize: 18,
		fontWeight: 'bold',
		 color: "#fff"
	},

	buttonModal: {
		width: '90%',
		height: 45,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: Colors.header,
		marginTop: 0
	},

	textButton2: {
		fontSize: 16,
		fontWeight: 'bold',
		color: "#fff"
	},

	buttonModal2: {
		width: '90%',
		height: 40,
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


