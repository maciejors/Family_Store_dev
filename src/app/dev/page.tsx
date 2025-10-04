'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import authStyles from './authStyles.module.css';
import useAuth from '@/hooks/useAuth';
import { isLoggedInDeveloper, isLoggedInRegular } from '@/lib/utils/userFunctions';
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
			<div className="main-container items-center h-screen">
				<form className="p-10 shadow-md rounded-sm bg-white w-96">
					<header>
						<Image
							className="mx-auto mb-5 h-auto w-auto"
							src={'/logo.png'}
							alt={'Family Store logo'}
							width={60}
							height={60}
							priority
						/>
					</header>
					<main className="flex flex-col">
						<h3>{isLogin ? 'Logowanie' : 'Rejestracja'}</h3>
						{alertMessage ? <p className="text-red-700 mt-2">{alertMessage}</p> : ''}
						<label className={authStyles.label} htmlFor="email">
							Email
						</label>
						<input
							className={authStyles.input}
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<label className={authStyles.label} htmlFor="password">
							Hasło
						</label>
						<input
							className={authStyles.input}
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type="password"
							required
						/>
						{isLogin ? (
							<a
								className={`${authStyles.label} mt-5 underline self-end`}
								href={undefined}
							>
								Nie pamiętasz hasła?
							</a>
						) : (
							<>
								<label className={authStyles.label} htmlFor="repeat">
									Powtórz hasło
								</label>
								<input
									className={authStyles.input}
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
							className={`btn btn-primary mt-5 ${authStyles.btn}`}
						>
							{isLogin ? 'Zaloguj się' : 'Utwórz konto'}
						</button>
					</main>
					<footer>
						<button
							onClick={(event) => changeAuthType(event)}
							className={`btn btn-secondary ${authStyles.btn}`}
						>
							{isLogin ? 'Nie mam konta' : 'Mam już konto'}
						</button>
					</footer>
				</form>
			</div>
		)
	);
}
