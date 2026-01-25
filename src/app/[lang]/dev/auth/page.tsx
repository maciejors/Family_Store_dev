'use client';

import Button from '@/components/buttons/Button';
import MainContainer from '@/components/wrappers/MainContainer';
import useAccess from '@/hooks/useAccess';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import LoginForm from './_components/LoginForm';
import RegisterForm from './_components/RegisterForm';

export default function AuthPage() {
	const canViewPage = useAccess(['anon']);
	const [isLogin, setIsLogin] = useState(true);
	const t = useTranslations('AuthPage');

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
							alt={t('FamilyStoreLogo')}
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
							{t(isLogin ? 'noAccount' : 'haveAccount')}
						</Button>
					</footer>
				</div>
			</MainContainer>
		)
	);
}
