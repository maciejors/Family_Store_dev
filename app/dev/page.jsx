'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import './authPage.css';
import LoginPage from './loginPage';
import RegisterPage from './registerPage';

export default function AuthPage() {
	const [authType, setAuthType] = useState('login');

	function changeAuthType() {
		if (authType === 'login')
			setAuthType('register');
		else
			setAuthType('login');
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
				<main className="auth-main">{authType === 'login' ? <LoginPage /> : <RegisterPage />}</main>
				<footer>
					<button onClick={changeAuthType} className="btn btn-secondary auth-btn">
						{authType === 'login' ? 'Nie mam konta' : 'Mam już konto'}
					</button>
				</footer>
			</form>
		</div>
	);
}
