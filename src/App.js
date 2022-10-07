import React, { useEffect, useState } from 'react'
import { firebaseConfig } from './firebase.js'
import { initializeApp } from 'firebase/app'
import { 
	getFirestore,
	collection, 
	getDocs,
	doc,
	onSnapshot,
} from 'firebase/firestore'

const App = () => {

	const [blogs, setBlogs] = useState([]);


	initializeApp(firebaseConfig);
	const db = getFirestore();

	useEffect(() => {

		// (async () => {
		// 	const querySnapshot = await getDocs(collection(db, 'blogs'));
		// 	const blogArr = [];
	
		// 	querySnapshot.forEach(doc => {
		// 		const blog = { ...doc.data(), id: doc.id };
		// 		blogArr.push(blog);
		// 	});
	
		// 	setBlogs(blogArr);
		// })();

		onSnapshot(collection(db, 'blogs'), querySnapshot => {
			const blogArr = [];
	
			querySnapshot.forEach(doc => {
				const blog = { ...doc.data(), id: doc.id };
				blogArr.push(blog);
			});

			setBlogs(blogArr);
		});
	}, []);

	return (
		<div className="app">
			{blogs.map(blog => (
				<div key={blog.id}>
					<p>{blog.title}</p>
					<p>{blog.content}</p>
				</div>
			))}
		</div>
	)
}

export default App