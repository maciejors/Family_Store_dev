import { setupComponent } from '@/__test-utils__/rendering';
import AppPreview from '@/models/AppPreview';
import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import AppCard from './AppCard';

jest.mock('@/i18n/navigation');
jest.mock('../AppForms/EditAppForm');
jest.mock('../AppForms/UpdateAppForm');

const MOCK_APP: AppPreview = {
	id: 1,
	name: 'My app 1',
	version: '1.0',
	lastUpdated: new Date('2020-04-01T10:00:00'),
	createdAt: new Date('2019-10-02T10:00:00'),
	logoUrl: 'https://localhost/fake-logo-url-1.png',
};

function renderComponent() {
	setupComponent(<AppCard app={MOCK_APP} />)
		.applyLocale()
		.render();
}

test("Should display the app's data", () => {
	renderComponent();

	expect(screen.getByRole('heading', { name: MOCK_APP.name })).toBeInTheDocument();
	expect(screen.getByText(`Version: ${MOCK_APP.version}`)).toBeInTheDocument();
	expect(
		screen.getByText(`Updated: ${MOCK_APP.lastUpdated.toISOString()}`)
	).toBeInTheDocument();

	const logo = screen.getByRole('img', { name: `${MOCK_APP.name}'s logo` });
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

	const updateLabel = new RegExp(`Update ${MOCK_APP.name}`);
	await user.click(screen.getByRole('button', { name: updateLabel }));
	expect(screen.getByRole('heading', { name: updateLabel })).toBeInTheDocument();
});

test('Should open the edit app dialog when clicked the relevant button', async () => {
	renderComponent();

	const editLabel = new RegExp(`Edit ${MOCK_APP.name}`);
	await user.click(screen.getByRole('button', { name: editLabel }));
	expect(screen.getByRole('heading', { name: editLabel })).toBeInTheDocument();
});
