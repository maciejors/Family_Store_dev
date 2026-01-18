import { render, screen } from '@testing-library/react';
import AppList, { AppListProps } from './AppList';

jest.mock('@/i18n/navigation');
jest.mock('next/image');

const MOCK_DATA: AppListProps = {
	brandName: 'SuperBrand',
	apps: [
		{
			id: 1,
			name: 'My app 1',
			version: '1.0',
			lastUpdated: '2020-04-01T10:00:00',
			createdAt: '2019-10-02T10:00:00',
			logoUrl: 'https://localhost/fake-logo-url-1.png',
		},
		{
			id: 2,
			name: 'My app 2',
			version: '2.1.1',
			lastUpdated: '2022-06-22T10:00:00',
			createdAt: '2022-06-22T10:00:00',
			logoUrl: 'https://localhost/fake-logo-url-2.png',
		},
	],
};

function renderComponent() {
	render(<AppList {...MOCK_DATA} />);
}

test('Should display a brand header and a list of apps', () => {
	renderComponent();

	expect(screen.getByRole('heading', { name: MOCK_DATA.brandName })).toBeInTheDocument();
	for (const app of MOCK_DATA.apps) {
		expect(
			screen.getByRole('heading', { name: new RegExp(app.name) })
		).toBeInTheDocument();
		expect(screen.getByText(new RegExp(app.version))).toBeInTheDocument();
	}
});
