import { client } from "./axiosClient";


export function signIn(user, password) {

  return client.get(`user/login/${user}/${password}`,{ authorization: false});

}


export function getAccounts(telephone){
	
	return client.get(
	    `user/compte/${telephone}`,
	    { authorization: true}
    );

}


export function getContacts(telephone){
	
	return client.get(
	    `user/contact/list/${telephone}`,
	    { authorization: true}
    );

}


export function getAllHistories(telephone,page,size){
	
	return client.get(
	    `transactions/cassier/${telephone}/all/${size}/${page}`,
	    { authorization: true}
    );

}


export function getDetailsAccounts(numCompte){
	
	return client.get(
	    `user/compte/info/${numCompte}`,
	    { authorization: true}
    );

}



export function lauchTransaction(senderPhone, receiverPhone,cashierPhone,senderaccount,receiverAccount,montant,type,nip){

	return client.post(
      "transaction/create/",
      {   senderPhone: senderPhone,
	      receiverPhone: receiverPhone,
	      senderaccount : senderaccount,
		  receiverAccount: receiverAccount,
		  tel_caissier: cashierPhone,
	      montant: montant,
		  type: type,
		  nip: nip
	    },
      { authorization: true, }

  );


}


export function lauchTransactionRecharge(senderPhone,receiverPhone,senderaccount,receiverAccount,montant,type,operator,pays,tel_transaction){

	return client.post(
      "transaction/create/",
      { senderPhone: senderPhone,
	      receiverPhone: receiverPhone,
	      senderaccount : senderaccount,
	      receiverAccount: receiverAccount, 
	      montant: montant,
	      type: type,
	      operateur: operator,
	      pays:pays,
	      tel_transaction: tel_transaction
	    },
      { authorization: true, }

  );



}




            


