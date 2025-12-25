import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import * as appsApi from '@/lib/supabase/database/apps';
import useAuth from '@/hooks/useAuth';
import User from '@/models/User';
import AppsByBrand from '@/models/AppsByBrand';
import DashboardPage from './page';
import { push } from '@/__mocks__/next/navigation';

jest.mock('next/link');
jest.mock('next/image');
jest.mock('next/navigation');
jest.mock('@/hooks/useAuth');
jest.mock('./_components/BrandsManager');
jest.mock('./_components/AppForms/AddAppForm');
jest.mock('./_components/AppForms/EditAppForm');
jest.mock('./_components/AppForms/UpdateAppForm');

const mockAppsApi = appsApi as jest.Mocked<typeof appsApi>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const MOCK_USER_DATA: User = {
	uid: '123',
	email: 'test@example.com',
	displayName: 'Frank Lampard',
	isDev: true,
};

const MOCK_APPS_DATA: AppsByBrand[] = [
	{
		brandId: 1,
		brandName: 'My brand A',
		apps: [
			{
				id: 1,
				name: 'My app 1',
				version: '1.0',
				lastUpdated: '2020-04-01T10:00:00',
				createdAt: '2020-02-10T10:00:00',
				logoUrl: 'https://localhost/fake-logo-url-1.png',
			},
			{
				id: 2,
				name: 'My app 2',
				version: '2.1.1',
				lastUpdated: '2022-06-22T10:00:00',
				createdAt: '2021-02-10T10:00:00',
				logoUrl: 'https://localhost/fake-logo-url-2.png',
			},
		],
	},
	{ brandId: 2, brandName: 'My brand B', apps: [] },
	{
		brandId: 3,
		brandName: 'My brand C',
		apps: [
			{
				id: 3,
				name: 'My app 3',
				version: '1.6.0',
				lastUpdated: '2023-11-11T12:00:00',
				createdAt: '2023-11-11T12:00:00',
				logoUrl: 'https://localhost/fake-logo-url-3.png',
			},
		],
	},
];

type RenderComponentOptions = {
	injectMockedApps?: boolean;
	mockAppsByBrand?: AppsByBrand[];
	mockUser?: User | null;
};

function renderComponent({
	mockAppsByBrand,
	mockUser = MOCK_USER_DATA,
	injectMockedApps = true,
}: RenderComponentOptions = {}) {
	if (injectMockedApps) {
		mockAppsByBrand = mockAppsByBrand ?? MOCK_APPS_DATA;
		mockAppsApi.getUserAppsByBrands.mockResolvedValue(mockAppsByBrand);
	}
	const mockLogout = jest.fn();

	mockUseAuth.mockReturnValue({
		currentUser: mockUser,
		logOut: mockLogout,
		logIn: jest.fn(),
		register: jest.fn(),
	});

	return {
		mockUser,
		mockLogout,
		mockAppsByBrand,
		renderResult: render(<DashboardPage />),
	};
}

test('Should display the header and apps', async () => {
	const { mockAppsByBrand } = renderComponent();

	expect(screen.getByRole('heading', { name: /moje aplikacje/i })).toBeInTheDocument();
	expect(screen.getByRole('button', { name: /zarządzaj markami/i })).toBeInTheDocument();
	expect(screen.getByRole('button', { name: /dodaj aplikację/i })).toBeInTheDocument();
	expect(screen.getByRole('button', { name: /wyloguj się/i })).toBeInTheDocument();

	const brandsWithApps = mockAppsByBrand!.filter((b) => b.apps.length > 0);
	for (const { brandName, apps: appsForBrand } of brandsWithApps) {
		expect(
			await screen.findByRole('heading', {
				name: new RegExp(brandName, 'i'),
			})
		).toBeInTheDocument();
		for (const app of appsForBrand) {
			expect(
				screen.getByRole('heading', { name: new RegExp(app.name, 'i') })
			).toBeInTheDocument();
		}
	}

	const brandsWithoutApps = mockAppsByBrand!.filter((b) => b.apps.length == 0);
	for (const { brandName } of brandsWithoutApps) {
		// brands with no apps are hidden from the dashboard
		expect(
			screen.queryByRole('heading', {
				name: new RegExp(brandName, 'i'),
			})
		).not.toBeInTheDocument();
	}
});

test('Should display the spinner while the data is loading', () => {
	mockAppsApi.getUserAppsByBrands.mockImplementation(() => new Promise(() => {}));
	renderComponent({ injectMockedApps: false });
	expect(screen.getByRole('status')).toBeInTheDocument();
});

test('Should display an info if there are no brands', async () => {
	renderComponent({ mockAppsByBrand: [] });
	expect(
		await screen.findByText(/Obecnie nie ma żadnych aplikacji powiązanych z tym kontem/i)
	).toBeInTheDocument();
});

test('Should display an info if there are no apps (but some brands)', async () => {
	renderComponent({
		mockAppsByBrand: MOCK_APPS_DATA.filter((b) => b.apps.length === 0),
	});
	expect(
		await screen.findByText(/Obecnie nie ma żadnych aplikacji powiązanych z tym kontem/i)
	).toBeInTheDocument();
});

test('Should display the brands manager dialog when the relevant button clicked', async () => {
	renderComponent();
	await user.click(screen.getByRole('button', { name: /zarządzaj markami/i }));
	expect(
		screen.getByRole('heading', { name: /zarządzanie markami/i })
	).toBeInTheDocument();
});

test('Should display the add application dialog when the relevant button clicked', async () => {
	renderComponent();
	await user.click(screen.getByRole('button', { name: /dodaj aplikację/i }));
	expect(screen.getByRole('heading', { name: /dodaj aplikację/i })).toBeInTheDocument();
});

test('Should trigger the logout function when the logout button clicked', async () => {
	const { mockLogout } = renderComponent();
	await user.click(screen.getByRole('button', { name: /wyloguj się/i }));
	expect(mockLogout).toHaveBeenCalled();
});

test('Should redirect to auth page if user is not logged in', async () => {
	renderComponent({ mockUser: null });
	await waitFor(() => {
		expect(push).toHaveBeenCalledWith('/dev/auth');
	});
});

test('Should redirect to access denied page if user is not a developer', async () => {
	renderComponent({ mockUser: { ...MOCK_USER_DATA, isDev: false } });
	await waitFor(() => {
		expect(push).toHaveBeenCalledWith('/dev/access-denied');
	});
});
