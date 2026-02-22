import { setupComponent } from '@/__test-utils__/rendering';
import { screen } from '@testing-library/react';
import AppList, { AppListProps } from './AppList';

jest.mock('@/i18n/navigation');

const MOCK_DATA: AppListProps = {
	brandName: 'SuperBrand',
	apps: [
		{
			id: 1,
			name: 'My app 1',
			version: '1.0',
			lastUpdated: new Date('2020-04-01T10:00:00'),
			createdAt: new Date('2019-10-02T10:00:00'),
			logoUrl: 'https://localhost/fake-logo-url-1.png',
		},
		{
			id: 2,
			name: 'My app 2',
			version: '2.1.1',
			lastUpdated: new Date('2022-06-22T10:00:00'),
			createdAt: new Date('2022-06-22T10:00:00'),
			logoUrl: 'https://localhost/fake-logo-url-2.png',
		},
	],
};

function renderComponent() {
	setupComponent(<AppList {...MOCK_DATA} />)
		.applyLocale()
		.render();
}

test('Should display a brand header and a list of apps', () => {
	renderComponent();

	expect(screen.getByRole('heading', { name: MOCK_DATA.brandName })).toBeInTheDocument();
	for (const app of MOCK_DATA.apps) {
		expect(
			screen.getByRole('heading', { name: new RegExp(app.name) })
		).toBeInTheDocument();
		expect(screen.getByText(new RegExp(`Version: ${app.version}`))).toBeInTheDocument();
	}
});
