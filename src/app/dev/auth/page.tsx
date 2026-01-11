'use client';

import React, { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useAuth from '@/hooks/useAuth';
import { isLoggedInDeveloper, isLoggedInRegular } from '@/lib/utils/userFunctions';
import Button from '@/components/buttons/Button';
import MainContainer from '@/components/wrappers/MainContainer';
import LoginForm from './_components/LoginForm';
import RegisterForm from './_components/RegisterForm';

export default function AuthPage() {
	const { currentUser } = useAuth();
	const { push } = useRouter();

	const [isLogin, setIsLogin] = useState(true);

	function changeAuthType() {
		setIsLogin(!isLogin);
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
	}, [currentUser, push]);

	return (
		currentUser !== undefined &&
		currentUser === null && (
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
