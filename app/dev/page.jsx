'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import './authPage.css';
import useAuth from '../shared/useAuth';

export default function AuthPage() {
	const { login, register } = useAuth();
	const { push } = useRouter();

	const [isLogin, setIsLogin] = useState(true);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');

	function changeAuthType(event) {
		event.preventDefault();
		setIsLogin(!isLogin);
	}

	function submit(event) {
		event.preventDefault();
		try {
			if (isLogin) {
				login(email, password);
				push('/dev/dashboard');
			} else {
				if (validateRegisterForm) {
					register(email, password);
					push('/dev/dashboard');
				}
			}
		} catch (error) {
			console.error(Error, 'Submit auth form error');
		}
	}

	function validateRegisterForm() {
		return password === repeatPassword;
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
						priority
					/>
				</header>
				<main className="auth-main">
					<h3>{isLogin ? 'Logowanie' : 'Rejestracja'}</h3>
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
					<button onClick={(event) => changeAuthType(event)} className="btn btn-secondary auth-btn">
						{isLogin ? 'Nie mam konta' : 'Mam już konto'}
					</button>
				</footer>
			</form>
		</div>
	);
}
