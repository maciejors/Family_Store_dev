import { render, screen } from '@testing-library/react';
import * as appsApi from '@/lib/supabase/database/apps';
import AppDetailsPage from './page';
import AppDetails from '@/models/AppDetails';

jest.mock('next/image');
jest.mock('@/components/FormattedDateLabel');

const mockAppsApi = appsApi as jest.Mocked<typeof appsApi>;

const MOCK_APP_DATA: AppDetails = {
	id: 1,
	name: 'My app 1',
	version: '1.0',
	lastUpdated: '2020-04-01T10:00:00',
	createdAt: '2019-10-02T10:00:00',
	logoUrl: 'https://localhost/fake-logo-url-1.png',
	downloadUrl: 'https://localhost/fake-app-url.apk',
	brandName: 'SuperBrand',
	description: 'Super app',
	changelog: 'New changes were made',
	pictures: [
		{ filename: 'fake-picture-1.png', url: 'https://localhost/fake-picture-url-1.png' },
		{ filename: 'fake-picture-2.png', url: 'https://localhost/fake-picture-url-2.png' },
		{ filename: 'fake-picture-3.png', url: 'https://localhost/fake-picture-url-3.png' },
	],
};

async function renderComponent(app: AppDetails | undefined = MOCK_APP_DATA) {
	if (app) {
		mockAppsApi.getAppDetails.mockResolvedValue(app);
	}
	const component = await AppDetailsPage({ params: { id: 1 } });
	return {
		app,
		renderResult: render(component),
	};
}

test('Should display all app details', async () => {
	const { app } = await renderComponent();

	expect(
		await screen.findByRole('heading', { name: new RegExp(app.name, 'i') })
	).toBeInTheDocument();

	const logoImg = screen.getByRole('img', { name: new RegExp(`${app.name} logo`) });
	expect(logoImg).toBeInTheDocument();
	expect(logoImg).toHaveAttribute('src', app.logoUrl);

	expect(screen.getByText(new RegExp(`Wersja: ${app.version}`, 'i'))).toBeInTheDocument();
	expect(
		screen.getByText(new RegExp(`Autor: ${app.brandName}`, 'i'))
	).toBeInTheDocument();

	const downloadLink = screen.getByRole('link', { name: /pobierz/i });
	expect(downloadLink).toBeInTheDocument();
	expect(downloadLink).toHaveAttribute('download');
	expect(downloadLink).toHaveAttribute('href', app.downloadUrl);

	expect(screen.getByText(new RegExp(app.lastUpdated))).toBeInTheDocument();
	expect(screen.getByText(new RegExp(app.createdAt))).toBeInTheDocument();
	expect(screen.getByText(new RegExp(app.description!))).toBeInTheDocument();
	expect(screen.getByRole('heading', { name: /lista zmian:/i })).toBeInTheDocument();
	expect(screen.getByText(new RegExp(app.changelog!))).toBeInTheDocument();

	app.pictures.forEach(({ url }, i) => {
		const img = screen.getByRole('img', {
			name: new RegExp(`image ${i + 1}/${app.pictures.length}`, 'i'),
		});
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src', url);
	});
});

test('Should not display the changelog section if no changelog', async () => {
	const { app } = await renderComponent({ ...MOCK_APP_DATA, changelog: null });

	expect(
		await screen.findByRole('heading', { name: new RegExp(app.name, 'i') }) // wait for data fetch
	).toBeInTheDocument();

	expect(
		screen.queryByRole('heading', { name: /lista zmian:/i })
	).not.toBeInTheDocument();
});
