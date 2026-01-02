import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import EditAppForm from './EditAppForm';
import * as appsApi from '@/lib/supabase/database/apps';
import { getFakePicture } from '@/__test-utils__/fakeFiles';
import AppDetails from '@/models/AppDetails';
import EditAppData from '@/schemas/EditAppData';

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
	pictureNames: ['fake-picture-1.png', 'fake-picture-2.png', 'fake-picture-3.png'],
	pictureUrls: [
		'https://localhost/fake-picture-url-1.png',
		'https://localhost/fake-picture-url-2.png',
		'https://localhost/fake-picture-url-3.png',
	],
};

const MOCK_INPUT: EditAppData = {
	newName: 'Super App',
	newLogoFile: getFakePicture('logo.png'),
	newDescription: 'Very good app',
	newChangelog: 'Lots of changes',
	newPicturesFiles: [
		getFakePicture('new-picture1.png'),
		getFakePicture('new-picture2.png'),
	],
	picturesToDeleteNames: ['fake-picture-1.png'],
};

const MOCK_INPUT_NOT_TRIMMED: EditAppData = {
	...MOCK_INPUT,
	newName: '  Super App  ',
	newDescription: '  Very good app      ',
	newChangelog: '     Lots of changes  ',
};

const getSubmitButton = () => screen.getByRole('button', { name: /zapisz zmiany/i });

async function clearTextInputs() {
	await user.clear(screen.getByRole('textbox', { name: /nazwa aplikacji/i }));
	await user.clear(screen.getByRole('textbox', { name: /opis/i }));
	await user.clear(screen.getByRole('textbox', { name: /lista zmian/i }));
}

async function fillForm(data: Partial<EditAppData>) {
	if (data.newName) {
		await user.type(
			screen.getByRole('textbox', { name: /nazwa aplikacji/i }),
			data.newName
		);
	}
	if (data.newLogoFile) {
		await user.click(screen.getByLabelText(/logo aplikacji/i));
		await user.upload(screen.getByLabelText(/dodaj logo/i), data.newLogoFile);
	}
	if (data.newDescription) {
		await user.type(screen.getByRole('textbox', { name: /opis/i }), data.newDescription);
	}
	if (data.newChangelog) {
		await user.type(
			screen.getByRole('textbox', { name: /lista zmian/i }),
			data.newChangelog
		);
	}
	if (data.newPicturesFiles) {
		await user.upload(
			screen.getByLabelText(/dodaj nowe screenshoty/i),
			data.newPicturesFiles
		);
	}
	if (data.picturesToDeleteNames) {
		for (const pictureName of data.picturesToDeleteNames) {
			await user.click(
				screen.getByRole('button', {
					name: new RegExp(`^delete picture ${pictureName}`, 'i'),
				})
			);
		}
	}
}

function renderComponent(autoMockAppDetails: boolean = true) {
	const appId = 1;
	if (autoMockAppDetails) {
		mockAppsApi.getAppDetails.mockResolvedValue(MOCK_APP_DATA);
	}
	return { appId, renderResult: render(<EditAppForm appId={appId} />) };
}

test('Should display a spinner when data fetch is loading', () => {
	mockAppsApi.getAppDetails.mockImplementation(() => new Promise(() => {}));
	renderComponent(false);
	expect(screen.getByRole('status')).toBeInTheDocument();
	expect(screen.queryByRole('form')).not.toBeInTheDocument();
});

test('Should display all form contents, with pre-populated values', async () => {
	renderComponent();
	expect(await screen.findByRole('form')).toBeInTheDocument();

	const nameInput = screen.getByRole('textbox', { name: /nazwa aplikacji/i });
	expect(nameInput).toBeInTheDocument();
	expect(nameInput).toHaveValue(MOCK_APP_DATA.name);

	const logoEditBtn = screen.getByLabelText(/logo aplikacji/i);
	expect(logoEditBtn).toBeInTheDocument();
	expect(screen.getByText('logo.png')).toBeInTheDocument();
	await user.click(logoEditBtn);
	expect(screen.getByLabelText(/dodaj logo/i)).toBeInTheDocument();

	const descriptionInput = screen.getByRole('textbox', { name: /opis/i });
	expect(descriptionInput).toBeInTheDocument();
	expect(descriptionInput).toHaveValue(MOCK_APP_DATA.description);

	const changelogInput = screen.getByRole('textbox', { name: /lista zmian/i });
	expect(changelogInput).toBeInTheDocument();
	expect(changelogInput).toHaveValue(MOCK_APP_DATA.changelog);

	expect(screen.getByLabelText(/dodaj nowe screenshoty/i)).toBeInTheDocument();
	for (const pictureName of MOCK_INPUT.picturesToDeleteNames) {
		expect(
			screen.getByRole('button', {
				name: new RegExp(`^delete picture ${pictureName}`, 'i'),
			})
		).toBeInTheDocument();
	}
	expect(getSubmitButton()).toBeInTheDocument();
});

test('Should submit the form', async () => {
	const { appId } = renderComponent();
	await screen.findByRole('form');

	await clearTextInputs();
	await fillForm(MOCK_INPUT);
	await user.click(getSubmitButton());
	expect(mockAppsApi.editApp).toHaveBeenCalledWith(appId, MOCK_INPUT);
});

test('Should trim the text values', async () => {
	const { appId } = renderComponent();
	await screen.findByRole('form');

	await clearTextInputs();
	await fillForm(MOCK_INPUT_NOT_TRIMMED);
	await user.click(getSubmitButton());
	expect(mockAppsApi.editApp).toHaveBeenCalledWith(appId, MOCK_INPUT);
});

test('Should require app name', async () => {
	renderComponent();
	await screen.findByRole('form');

	await clearTextInputs();
	const { newName, ...formData } = MOCK_INPUT;
	await fillForm(formData);

	await user.click(getSubmitButton());
	expect(mockAppsApi.editApp).not.toHaveBeenCalled();
});

describe('Verify optional fields', () => {
	const optionalFields = [
		{ key: 'newDescription', emptyValue: '' },
		{ key: 'newChangelog', emptyValue: '' },
		{ key: 'newLogoFile', emptyValue: undefined },
		{ key: 'newPicturesFiles', emptyValue: [] },
		{ key: 'picturesToDeleteNames', emptyValue: [] },
	];
	test.each(optionalFields)('Should not require $key', async ({ key, emptyValue }) => {
		const { appId } = renderComponent();
		await screen.findByRole('form');

		await clearTextInputs();
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
		expect(mockAppsApi.editApp).toHaveBeenCalledWith(appId, expectedData);
	});
});

test('Should allow to toggle pictures to delete', async () => {
	renderComponent();
	await screen.findByRole('form');

	for (const pictureName of MOCK_INPUT.picturesToDeleteNames) {
		await user.click(
			screen.getByRole('button', {
				name: new RegExp(`^delete picture ${pictureName}`, 'i'),
			})
		);

		const undoDeleteBtn = screen.getByRole('button', {
			name: new RegExp(`^undo delete picture ${pictureName}`, 'i'),
		});
		expect(undoDeleteBtn).toBeInTheDocument();
		await user.click(undoDeleteBtn);
	}

	await user.click(getSubmitButton());
	expect(mockAppsApi.editApp).toHaveBeenCalledWith(
		expect.any(Number),
		expect.objectContaining({ picturesToDeleteNames: [] })
	);
});
