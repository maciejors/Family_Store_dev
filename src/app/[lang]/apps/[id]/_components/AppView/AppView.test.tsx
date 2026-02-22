import { setupComponent } from '@/__test-utils__/rendering';
import AppDetails from '@/models/AppDetails';
import { screen } from '@testing-library/react';
import AppView from './AppView';

const MOCK_APP_DATA: AppDetails = {
	id: 1,
	name: 'My app 1',
	version: '1.0',
	lastUpdated: new Date('2020-04-01T10:00:00'),
	createdAt: new Date('2019-10-02T10:00:00'),
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

function renderComponent(app: AppDetails | undefined = MOCK_APP_DATA) {
	return {
		app,
		renderResult: setupComponent(<AppView app={app} />)
			.applyQueryClient()
			.applyLocale('pl')
			.render(),
	};
}

test('Should display all app details', async () => {
	const { app } = renderComponent();

	expect(
		screen.getByRole('heading', { name: new RegExp(app.name, 'i') })
	).toBeInTheDocument();

	const logoImg = screen.getByRole('img', { name: new RegExp(`logo ${app.name}`, 'i') });
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

	expect(
		screen.getByText(
			new RegExp(`ostatnia aktualizacja: ${app.lastUpdated.toISOString()}`, 'i')
		)
	).toBeInTheDocument();
	expect(
		screen.getByText(new RegExp(`opublikowano: ${app.createdAt.toISOString()}`, 'i'))
	).toBeInTheDocument();
	expect(screen.getByText(new RegExp(app.description!))).toBeInTheDocument();
	expect(screen.getByRole('heading', { name: /lista zmian:/i })).toBeInTheDocument();
	expect(screen.getByText(new RegExp(app.changelog!))).toBeInTheDocument();

	app.pictures.forEach(({ url }, i) => {
		const img = screen.getByRole('img', {
			name: new RegExp(`zdjęcie ${i + 1}/${app.pictures.length}`, 'i'),
		});
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src', url);
	});
});

test('Should not display the changelog section if no changelog', async () => {
	renderComponent({ ...MOCK_APP_DATA, changelog: null });
	expect(
		screen.queryByRole('heading', { name: /lista zmian:/i })
	).not.toBeInTheDocument();
});
