'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import useAccess from '@/hooks/useAccess';
import Button from '@/components/buttons/Button';
import MainContainer from '@/components/wrappers/MainContainer';
import LoginForm from './_components/LoginForm';
import RegisterForm from './_components/RegisterForm';

export default function AuthPage() {
	const canViewPage = useAccess(['anon']);
	const [isLogin, setIsLogin] = useState(true);

	function changeAuthType() {
		setIsLogin(!isLogin);
	}

	return (
		canViewPage && (
			<MainContainer fillScreen>
				<div className="p-10 shadow-md rounded-sm bg-white w-96">
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
						{isLogin ? <LoginForm /> : <RegisterForm />}
					</main>
					<footer>
						<Button onClick={changeAuthType} variant="secondary" className="mt-3 w-full">
							{isLogin ? 'Nie mam konta' : 'Mam już konto'}
						</Button>
					</footer>
				</div>
			</MainContainer>
		)
	);
}
