import React, { useEffect, useState } from 'react'
import { firebaseConfig } from './firebase.js'
import { initializeApp } from 'firebase/app'
import { 
	getFirestore,
	collection, 
	getDocs,
	doc,
	onSnapshot,
	query, orderBy, serverTimestamp, 
	addDoc
} from 'firebase/firestore'

const App = () => {

	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");

	// firestore
	initializeApp(firebaseConfig);
	const db = getFirestore();

	// handle functions
	const handleChange = event => setInput(event.target.value);

	const handleSubmit = event => {
		event.preventDefault();

		if (event.key === 'enter' && input) {
			sendMessage(input);
			setInput('');
		}
	}

	const handleClick = event => {
		event.preventDefault();

		if (input) {
			sendMessage(input);
			setInput('');
		}
	}	

	const sendMessage = (message) => {
		addDoc(collection(db, 'messages'), {
			message: message,
			createdAt: serverTimestamp()
		});
	}



	useEffect(() => {
		
		const q = query(collection(db, 'messages'), orderBy('createdAt'));

		// get docs once
		// (async () => {
		// 	const querySnapshot = await getDocs(collection(db, 'blogs'));
		// 	const messageArr = [];
	
		// 	querySnapshot.forEach(doc => {
		// 		const message = { ...doc.data(), id: doc.id };
		// 		messageArr.push(message);
		// 	});
	
		// 	setMessages(messageArr);
		// })();

		onSnapshot(q, querySnapshot => {
			const messageArr = [];

			querySnapshot.forEach(doc => {
				const message = { ...doc.data(), id: doc.id };
				messageArr.push(message);

				// setMessages(state => [ ...state, {...doc.data(), id: doc.id}] );
			});

			setMessages(messageArr);
		});
	}, []);

	return (
		<div className="app">
			{messages.map(message => (
				<span key={message.id}>
					<p>{message.message}</p>
				</span>
			))}

			<form onSubmit={ handleSubmit }>
				<input 
					type="text" 
					value={ input } 
					onChange={ handleChange }
					placeholder="Aa"
				/>
				<button onClick={ handleClick }>Send</button>
			</form>
		</div>
	)
}

export default App