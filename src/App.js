import React, { useEffect, useState } from 'react'
import { firebaseConfig } from './firebase.js'
import { initializeApp } from 'firebase/app'
import { 
	getFirestore,
	collection, 
	getDocs, doc, onSnapshot,
	query, orderBy, serverTimestamp, 
	addDoc
} from 'firebase/firestore'

const App = () => {

	const [name, setName] = useState("Your name");
	const [nameInput, setNameInput] = useState(false);

	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");

	// firestore
	initializeApp(firebaseConfig);
	const db = getFirestore();

	// handle functions
	const handleNameChange = event => setName(event.target.value);

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
			author: name,
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
			<header className='flex justify-center items-center w-full h-16 bg-gradient-to-b from-white to-gray-200 fixed top-0 left-0'>
				{ nameInput ? 
					( <form onSubmit={ () => setNameInput(false) } className='w-40'>
						<input 
							type="text" 
							className='w-full bg-gray-300 px-4 py-1 rounded-full text-center text-xl' 
							placeholder='Your name'
							onChange={handleNameChange}
							value={name}
						/>
					</form> ) :
					( <h1 
						className='text-xl font-semibold' 
						onClick={() => setNameInput(true)}>{ name }
					</h1> )}
			</header>

			<div className='p-1 mt-16 mb-10'>
				{messages.map(message => (
					message.author === name ? (
						<div key={message.id} className='flex flex-col items-end'>
							<h4 className='text-xs text-gray-500'>{message.author}</h4>
							<span className="bg-gradient-to-b from-sky-500 to-sky-600 text-white inline-block max-w-xs md:max-w-lg px-4 py-1 my-1 rounded-2xl">
								<p >{message.message}</p>
							</span>
						</div>
					) : (
						<div key={message.id} className='flex flex-col items-start'>
							<h4 className='text-xs text-gray-500'>{message.author}</h4>
							<span className="bg-gradient-to-b from-orange-500 to-orange-700 text-white inline-block max-w-xs md:max-w-lg px-4 py-1 my-1 rounded-2xl">
								<p >{message.message}</p>
							</span>
						</div>
					)
					
				))}
			</div>
			
			<form onSubmit={ handleSubmit } className='bg-white p-1 w-full flex border-t-2 fixed bottom-0 z-10'>
				<input 
					className='flex-auto bg-gray-200 px-4 py-1 rounded-full'
					type="text" 
					value={ input } 
					onChange={ handleChange }
					placeholder="Aa"
				/>
				<button 
					className='bg-gradient-to-b from-sky-500 to-sky-600 text-white p-2 mx-1 rounded-full'
					onClick={ handleClick }
				>
					<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
					</svg>
				</button>
			</form>
		</div>
	)
}

export default App