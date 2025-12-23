import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import AddAppForm from './AddAppForm';
import * as brandsApi from '@/lib/supabase/database/brands';
import * as appsApi from '@/lib/supabase/database/apps';
import * as oneSignalApi from '@/lib/notifications/onesignal';
import Brand from '@/models/Brand';
import NewAppData from '@/models/NewAppData';
import { getFakeApk, getFakePicture } from '@/__test-utils__/fakeFiles';

const mockBrandsApi = brandsApi as jest.Mocked<typeof brandsApi>;
const mockAppsApi = appsApi as jest.Mocked<typeof appsApi>;
const mockOneSignalApi = oneSignalApi as jest.Mocked<typeof oneSignalApi>;

const MOCK_USER_BRANDS: Brand[] = [
	{ id: 1, name: 'SuperBrand 1', appCount: 12 },
	{ id: 2, name: 'SuperBrand 2', appCount: 0 },
];

const MOCK_INPUT: NewAppData = {
	name: 'Super App',
	version: '1.0',
	brandId: 1,
	apkFile: getFakeApk('release.apk'),
	logoFile: getFakePicture('logo.png'),
	description: 'Very good app',
	appPicturesFiles: [getFakePicture('picture1.png'), getFakePicture('picture2.png')],
};

const MOCK_INPUT_NOT_TRIMMED: NewAppData = {
	...MOCK_INPUT,
	name: '  Super App  ',
	version: '      1.0  ',
	description: '  Very good app      ',
};

const getSubmitButton = () => screen.getByRole('button', { name: /dodaj aplikację/i });

async function fillForm(data: Partial<NewAppData>) {
	if (data.name) {
		await user.type(screen.getByRole('textbox', { name: /nazwa aplikacji/i }), data.name);
	}
	if (data.version) {
		await user.type(screen.getByRole('textbox', { name: /wersja/i }), data.version);
	}
	if (data.brandId) {
		await user.selectOptions(
			screen.getByRole('combobox', { name: /marka/i }),
			data.brandId.toString()
		);
	}
	if (data.apkFile) {
		await user.upload(screen.getByLabelText(/dodaj plik instalacyjny/i), data.apkFile);
	}
	if (data.logoFile) {
		await user.upload(screen.getByLabelText(/dodaj logo/i), data.logoFile);
	}
	if (data.description) {
		await user.type(screen.getByRole('textbox', { name: /opis/i }), data.description);
	}
	if (data.appPicturesFiles) {
		await user.upload(screen.getByLabelText(/dodaj screenshoty/i), data.appPicturesFiles);
	}
}

function renderComponent(autoMockBrands: boolean = true) {
	const userUid = '123';
	if (autoMockBrands) {
		mockBrandsApi.getBrandsForUser.mockResolvedValue(MOCK_USER_BRANDS);
	}
	const newAppId = 1;
	mockAppsApi.addApp.mockResolvedValue(newAppId);
	return {
		userUid,
		newAppId,
		renderResult: render(<AddAppForm userUid={userUid} />),
	};
}

test('Should display a spinner when data fetch is loading', () => {
	mockBrandsApi.getBrandsForUser.mockImplementation(() => new Promise(() => {}));
	renderComponent(false);
	expect(screen.getByRole('status')).toBeInTheDocument();
	expect(screen.queryByRole('form')).not.toBeInTheDocument();
});

test('Should an info when the user has no brands', async () => {
	mockBrandsApi.getBrandsForUser.mockResolvedValue([]);
	renderComponent(false);
	expect(
		await screen.findByText(/Brak marek powiązanych z tym kontem/)
	).toBeInTheDocument();
	expect(screen.queryByRole('form')).not.toBeInTheDocument();
});

test('Should display all form contents', async () => {
	renderComponent();
	expect(await screen.findByRole('form')).toBeInTheDocument();
	expect(screen.getByRole('textbox', { name: /nazwa aplikacji/i })).toBeInTheDocument();
	expect(screen.getByRole('textbox', { name: /wersja/i })).toBeInTheDocument();
	expect(screen.getByRole('combobox', { name: /marka/i })).toBeInTheDocument();
	expect(screen.getByLabelText(/dodaj plik instalacyjny/i)).toBeInTheDocument();
	expect(screen.getByLabelText(/dodaj logo/i)).toBeInTheDocument();
	expect(screen.getByRole('textbox', { name: /opis/i })).toBeInTheDocument();
	expect(screen.getByLabelText(/dodaj screenshoty/i)).toBeInTheDocument();
	expect(getSubmitButton()).toBeInTheDocument();
});

test('Should submit the form', async () => {
	const { newAppId } = renderComponent();
	await screen.findByRole('form');
	await fillForm(MOCK_INPUT);
	await user.click(getSubmitButton());
	expect(mockAppsApi.addApp).toHaveBeenCalledWith(MOCK_INPUT);
	expect(mockOneSignalApi.sendPushNewApp).toHaveBeenCalledWith(newAppId, MOCK_INPUT.name);
});

test('Should trim the text values', async () => {
	const { newAppId } = renderComponent();
	await screen.findByRole('form');
	await fillForm(MOCK_INPUT_NOT_TRIMMED);
	await user.click(getSubmitButton());
	expect(mockAppsApi.addApp).toHaveBeenCalledWith(MOCK_INPUT);
	expect(mockOneSignalApi.sendPushNewApp).toHaveBeenCalledWith(newAppId, MOCK_INPUT.name);
});

describe('Verify required fields', () => {
	const requiredFields = [
		{ key: 'name' },
		{ key: 'version' },
		// { key: 'apkFile' },
		// { key: 'logoFile' },
	];
	test.each(requiredFields)('Should require $key', async ({ key }) => {
		renderComponent();
		await screen.findByRole('form');

		const formData = {
			...MOCK_INPUT,
		};
		delete formData[key];
		await fillForm(formData);

		await user.click(getSubmitButton());
		expect(mockAppsApi.addApp).not.toHaveBeenCalled();
		expect(mockOneSignalApi.sendPushNewApp).not.toHaveBeenCalled();
	});
});

describe('Verify optional fields', () => {
	const optionalFields = [
		{ key: 'description', emptyValue: '' },
		{ key: 'appPicturesFiles', emptyValue: [] },
	];
	test.each(optionalFields)('Should not require $key', async ({ key, emptyValue }) => {
		renderComponent();
		await screen.findByRole('form');

		const formData = {
			...MOCK_INPUT,
		};
		delete formData[key];
		await fillForm(formData);

		const expectedData = {
			...formData,
		};
		expectedData[key] = emptyValue;

		await user.click(getSubmitButton());
		expect(mockAppsApi.addApp).toHaveBeenCalledWith(expectedData);
		expect(mockOneSignalApi.sendPushNewApp).toHaveBeenCalled();
	});
});
