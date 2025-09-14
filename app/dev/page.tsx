'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './authPage.css';
import useAuth from '@/app/shared/hooks/useAuth';
import { isLoggedInDeveloper, isLoggedInRegular } from '@/app/shared/utils/userFunctions';
import validate from './validation';

export default function AuthPage() {
	const { currentUser, logIn, register } = useAuth();
	const { push } = useRouter();

	const [isLogin, setIsLogin] = useState(true);
	const [alertMessage, setAlertMessage] = useState('');

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');

	function changeAuthType(event: FormEvent) {
		event.preventDefault();
		setIsLogin(!isLogin);
		setAlertMessage('');
	}

	async function submit(event: FormEvent) {
		event.preventDefault();
		try {
			if (isLogin) {
				await logIn(email, password);
			} else {
				const validation = validate(email, password, repeatPassword);
				if (!validation.isValid) {
					setAlertMessage(validation.message);
					return;
				}
				await register(email, password);
			}
		} catch (error) {
			console.error(error);
			setAlertMessage(error.message ?? 'An unknown error occurred');
		}
	}

	useEffect(() => {
		if (currentUser !== undefined) {
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
		currentUser !== undefined &&
		currentUser === null && (
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
							<a className="auth-label auth-link" href={undefined}>
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
