import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyAWfUSo1UJ8JpdZUv8TLsTcvA-mxuBd6S0',
	authDomain: 'family-store.firebaseapp.com',
	databaseURL: 'https://family-store.firebaseio.com',
	projectId: 'family-store',
	storageBucket: 'family-store.appspot.com',
	messagingSenderId: '1088252679631',
	appId: '1:1088252679631:web:c621b3653385cd4e71aeba',
	measurementId: 'G-C6KZ2ZK78Z',
};

export const app = initializeApp(firebaseConfig);
