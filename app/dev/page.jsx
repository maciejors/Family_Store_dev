'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import './authPage.css';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import useAuth from '@/lib/useAuth';

export default function AuthPage() {

	const user = useAuth();

	const [authType, setAuthType] = useState('login');

	function changeAuthType() {
		if (authType === 'login') setAuthType('register');
		else setAuthType('login');
	}

	return (
		<div className="main-container auth-container">
			<form className="auth-form">
				<header>
					<Image
						className="auth-logo"
						src={'/logo.png'}
						alt={'Family Store logo'}
						width={60}
						height={60}
					/>
				</header>
				<main className="auth-main">{authType === 'login' ? <LoginForm /> : <RegisterForm />}</main>
				<footer>
					<button onClick={changeAuthType} className="btn btn-secondary auth-btn">
						{authType === 'login' ? 'Nie mam konta' : 'Mam już konto'}
					</button>
				</footer>
			</form>
		</div>
	);
}
