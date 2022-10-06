import React, { useEffect, useState } from 'react'
import { firebaseConfig } from './firebase.js'
import { initializeApp } from 'firebase/app'
import { 
	getFirestore,
	collection, 
	getDocs } from 'firebase/firestore'

const App = () => {

	const [blogs, setBlogs] = useState([]);

	initializeApp(firebaseConfig);
	const db = getFirestore();
	const colBlogs = collection(db, 'blogs');

	useEffect(() => {
		getDocs(colBlogs)
		.then((snapshot) => {
			const blogArr = [];
			snapshot.docs.forEach(doc => {
				const blog = { ...doc.data(), id: doc.id };
				blogArr.push(blog);
			});
			setBlogs(blogArr);
		})
		.catch(error => error(error.message));
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