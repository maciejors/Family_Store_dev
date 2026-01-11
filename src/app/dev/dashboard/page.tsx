'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getUserAppsByBrands } from '@/lib/supabase/database/apps';
import AppList from './_components/AppList';
import Dialog from '@/components/wrappers/Dialog';
import useAuth from '@/hooks/useAuth';
import { isLoggedInDeveloper, isLoggedInRegular } from '@/lib/utils/userFunctions';
import NoAppsInfo from './_components/NoAppsInfo';
import BrandsManager from './_components/BrandsManager';
import ConditionalSpinner from '@/components/loading/ConditionalSpinner';
import AddAppForm from './_components/AppForms/AddAppForm';
import Button from '@/components/buttons/Button';
import MainContainer from '@/components/wrappers/MainContainer';

export default function DashboardPage() {
	const { push } = useRouter();
	let { currentUser, logOut } = useAuth();

	const {
		data: appsData,
		isPending: areAppsPending,
		refetch: fetchUserAppsByBrand,
	} = useQuery({
		queryKey: ['appsByBrand', currentUser?.uid],
		queryFn: async () => {
			const fetchedData = await getUserAppsByBrands(currentUser!.uid);
			return fetchedData.filter(({ apps }) => apps.length > 0); // skip brands with no apps
		},
		enabled: false,
	});

	useEffect(() => {
		async function onUserChanged() {
			if (currentUser !== undefined) {
				if (currentUser === null) {
					push('/dev/auth');
					return;
				}
				if (isLoggedInRegular(currentUser)) {
					push('/dev/access-denied');
					return;
				}
				fetchUserAppsByBrand();
			}
		}
		onUserChanged();
	}, [currentUser]);

	const [isBrandsDialogOpen, setIsBrandsDialogOpen] = useState(false);
	const [isAddAppDialogOpen, setIsAddAppDialogOpen] = useState(false);

	return (
		currentUser &&
		isLoggedInDeveloper(currentUser) && (
			<MainContainer>
				<header className="flex flex-row justify-between mt-4 mb-8 w-full">
					<h2>Moje aplikacje</h2>
					<div className="flex flex-row gap-4">
						<>
							<Button className="h-full" onClick={() => setIsBrandsDialogOpen(true)}>
								Zarządzaj markami
							</Button>
							<Dialog
								open={isBrandsDialogOpen}
								handleClose={() => setIsBrandsDialogOpen(false)}
								title="Zarządzanie markami"
								className="w-80"
							>
								<BrandsManager userUid={currentUser.uid} />
							</Dialog>
						</>
						<>
							<Button className="h-full" onClick={() => setIsAddAppDialogOpen(true)}>
								Dodaj aplikację
							</Button>
							<Dialog
								open={isAddAppDialogOpen}
								handleClose={() => setIsAddAppDialogOpen(false)}
								title="Dodaj aplikację"
							>
								<AddAppForm userUid={currentUser.uid} />
							</Dialog>
						</>
						<Button variant="secondary" onClick={logOut}>
							Wyloguj się
						</Button>
					</div>
				</header>
				<main className="w-full">
					<ConditionalSpinner
						isLoading={areAppsPending}
						extraSpinnerWrapperClasses="pt-16"
					>
						{appsData &&
							appsData.length > 0 &&
							appsData.map(({ brandId, brandName, apps }) => (
								<AppList key={brandId} brandName={brandName} apps={apps} />
							))}
						{appsData && appsData.length === 0 && <NoAppsInfo />}
					</ConditionalSpinner>
				</main>
			</MainContainer>
		)
	);
}
