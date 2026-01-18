import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import AppCard from './AppCard';
import AppPreview from '@/models/AppPreview';

jest.mock('next/image');
jest.mock('@/i18n/navigation');
jest.mock('@/components/FormattedDateLabel');
jest.mock('../AppForms/EditAppForm');
jest.mock('../AppForms/UpdateAppForm');

const MOCK_APP: AppPreview = {
	id: 1,
	name: 'My app 1',
	version: '1.0',
	lastUpdated: '2020-04-01T10:00:00',
	createdAt: '2019-10-02T10:00:00',
	logoUrl: 'https://localhost/fake-logo-url-1.png',
};

function renderComponent() {
	render(<AppCard app={MOCK_APP} />);
}

test("Should display the app's data", () => {
	renderComponent();

	expect(screen.getByRole('heading', { name: MOCK_APP.name })).toBeInTheDocument();
	expect(screen.getByText(`Wersja: ${MOCK_APP.version}`)).toBeInTheDocument();
	expect(screen.getByText(`Aktual. ${MOCK_APP.lastUpdated}`)).toBeInTheDocument();

	const logo = screen.getByRole('img', { name: `${MOCK_APP.name} logo` });
	expect(logo).toBeInTheDocument();
	expect(logo).toHaveAttribute('src', MOCK_APP.logoUrl);

	const linkToAppPage = screen.getByRole('link', {
		name: new RegExp(`link to ${MOCK_APP.name}'s page`, 'i'),
	});
	expect(linkToAppPage).toBeInTheDocument();
	expect(linkToAppPage).toHaveAttribute('href', `/apps/${MOCK_APP.id}`);

	expect(
		screen.getByRole('button', { name: new RegExp(`Update ${MOCK_APP.name}`) })
	).toBeInTheDocument();
	expect(
		screen.getByRole('button', { name: new RegExp(`Edit ${MOCK_APP.name}`) })
	).toBeInTheDocument();
});

test('Should open the update dialog when clicked the relevant button', async () => {
	renderComponent();

	await user.click(
		screen.getByRole('button', { name: new RegExp(`Update ${MOCK_APP.name}`) })
	);
	expect(
		screen.getByRole('heading', { name: /dodaj aktualizację/i })
	).toBeInTheDocument();
});

test('Should open the edit app dialog when clicked the relevant button', async () => {
	renderComponent();

	await user.click(
		screen.getByRole('button', { name: new RegExp(`Edit ${MOCK_APP.name}`) })
	);
	expect(screen.getByRole('heading', { name: /edytuj aplikację/i })).toBeInTheDocument();
});
