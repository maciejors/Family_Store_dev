'use client';

import Button from '@/components/buttons/Button';
import ConditionalSpinner from '@/components/loading/ConditionalSpinner';
import Dialog from '@/components/wrappers/Dialog';
import MainContainer from '@/components/wrappers/MainContainer';
import useAccess from '@/hooks/useAccess';
import useAuth from '@/hooks/useAuth';
import { getUserAppsByBrands } from '@/lib/supabase/database/apps';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import AddAppForm from './_components/AppForms/AddAppForm';
import AppList from './_components/AppList';
import BrandsManager from './_components/BrandsManager';
import NoAppsInfo from './_components/NoAppsInfo';

export default function DashboardPage() {
	let { currentUser, logOut } = useAuth();
	const canViewPage = useAccess(['dev']);
	const t = useTranslations('DashboardPage');

	const { data: appsData, isPending: areAppsPending } = useQuery({
		queryKey: ['appsByBrand', currentUser?.uid],
		queryFn: async () => {
			const fetchedData = await getUserAppsByBrands(currentUser!.uid);
			return fetchedData.filter(({ apps }) => apps.length > 0); // skip brands with no apps
		},
		enabled: canViewPage,
	});

	const [isBrandsDialogOpen, setIsBrandsDialogOpen] = useState(false);
	const [isAddAppDialogOpen, setIsAddAppDialogOpen] = useState(false);

	return (
		canViewPage &&
		currentUser && (
			<MainContainer>
				<header className="flex flex-row justify-between mt-4 mb-8 w-full">
					<h2>{t('myApps')}</h2>
					<div className="flex flex-row gap-4">
						<>
							<Button className="h-full" onClick={() => setIsBrandsDialogOpen(true)}>
								{t('manageBrands')}
							</Button>
							<Dialog
								open={isBrandsDialogOpen}
								handleClose={() => setIsBrandsDialogOpen(false)}
								title={t('brands')}
								className="w-80"
							>
								<BrandsManager userUid={currentUser.uid} />
							</Dialog>
						</>
						<>
							<Button className="h-full" onClick={() => setIsAddAppDialogOpen(true)}>
								{t('addApp')}
							</Button>
							<Dialog
								open={isAddAppDialogOpen}
								handleClose={() => setIsAddAppDialogOpen(false)}
								title={t('addApp')}
							>
								<AddAppForm userUid={currentUser.uid} />
							</Dialog>
						</>
						<Button variant="secondary" onClick={logOut}>
							{t('logOut')}
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
