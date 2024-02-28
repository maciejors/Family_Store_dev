'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './authPage.css';
import useAuth from '../shared/useAuth';
import { isLoggedInDeveloper, isLoggedInRegular, isNotAuthenticated } from '../shared/user';
import validate from './validation';

export default function AuthPage() {
	const { currentUser, login, register } = useAuth();
	const { push } = useRouter();

	const [isLogin, setIsLogin] = useState(true);
	const [alertMessage, setAlertMessage] = useState('');

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');

	function changeAuthType(event) {
		event.preventDefault();
		setIsLogin(!isLogin);
		setAlertMessage('');
	}

	async function submit(event) {
		event.preventDefault();
		try {
			if (isLogin) {
				const isSucceed = await login(email, password);
				if (!isSucceed) setAlertMessage('Dane logowania są niepoprawne');
			} else {
				const validation = validate(email, password, repeatPassword);
				if (validation.isValid) {
					const isSucceed = await register(email, password);
					if (!isSucceed) setAlertMessage('Coś poszło nie tak');	
				}
				else
					setAlertMessage(validation.message);	
			}
		} catch (error) {
			console.error(Error, 'Submit auth form error');
		}
	}

	useEffect(() => {
		if (currentUser !== null) {
			if (isLoggedInRegular(currentUser)) {
				push('/dev/access-denied');
				return;
			}
			if (isLoggedInDeveloper(currentUser)) {
				push('/dev/dashboard');
				return;
			}
		}
	}, [currentUser]);

	return (
		currentUser &&
		isNotAuthenticated(currentUser) && (
			<div className="main-container auth-container">
				<form className="auth-form">
					<header>
						<Image
							className="auth-logo"
							src={'/logo.png'}
							alt={'Family Store logo'}
							width={60}
							height={60}
							priority
						/>
					</header>
					<main className="auth-main">
						<h3>{isLogin ? 'Logowanie' : 'Rejestracja'}</h3>
						{alertMessage ? <p className="auth-error">{alertMessage}</p> : ''}
						<label className="auth-label" htmlFor="email">
							Email
						</label>
						<input
							className="auth-input"
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<label className="auth-label" htmlFor="password">
							Hasło
						</label>
						<input
							className="auth-input"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type="password"
							required
						/>
						{isLogin ? (
							<a className="auth-label auth-link" href="">
								Nie pamiętasz hasła?
							</a>
						) : (
							<>
								<label className="auth-label" htmlFor="repeat">
									Powtórz hasło
								</label>
								<input
									className="auth-input"
									id="repeat"
									value={repeatPassword}
									onChange={(e) => setRepeatPassword(e.target.value)}
									type="password"
									required
								/>
							</>
						)}
						<button
							onClick={(event) => submit(event)}
							className="btn btn-primary auth-btn auth-btn-submit"
						>
							{isLogin ? 'Zaloguj się' : 'Utwórz konto'}
						</button>
					</main>
					<footer>
						<button
							onClick={(event) => changeAuthType(event)}
							className="btn btn-secondary auth-btn"
						>
							{isLogin ? 'Nie mam konta' : 'Mam już konto'}
						</button>
					</footer>
				</form>
			</div>
		)
	);
}
