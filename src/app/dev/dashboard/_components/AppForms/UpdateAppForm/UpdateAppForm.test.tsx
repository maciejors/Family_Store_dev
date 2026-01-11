import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import UpdateAppForm from './UpdateAppForm';
import * as appsApi from '@/lib/supabase/database/apps';
import * as oneSignalApi from '@/lib/notifications/onesignal';
import { getFakeApk } from '@/__test-utils__/fakeFiles';
import AppUpdateDetails from '@/models/AppUpdateDetails';
import UpdateAppData from '@/schemas/UpdateAppData';
import { setupComponent } from '@/__test-utils__/rendering';

const mockAppsApi = appsApi as jest.Mocked<typeof appsApi>;
const mockOneSignalApi = oneSignalApi as jest.Mocked<typeof oneSignalApi>;

const MOCK_APP_UPDATE_DETAILS: AppUpdateDetails = {
	appName: 'Super app',
	version: '1.0',
	changelog: 'New changes were made',
};

const MOCK_INPUT: UpdateAppData = {
	newVersion: '1.1',
	changelog: 'Lots of changes',
	apkFile: getFakeApk('release.apk'),
};

const MOCK_INPUT_NOT_TRIMMED: UpdateAppData = {
	...MOCK_INPUT,
	newVersion: '             1.1     ',
	changelog: '    Lots of changes    ',
};

const getSubmitButton = () => screen.getByRole('button', { name: /wydaj aktualizację/i });

async function clearTextInputs() {
	await user.clear(screen.getByRole('textbox', { name: /wersja/i }));
	await user.clear(screen.getByRole('textbox', { name: /lista zmian/i }));
}

async function fillForm(data: Partial<UpdateAppData>) {
	if (data.newVersion) {
		await user.type(screen.getByRole('textbox', { name: /wersja/i }), data.newVersion);
	}
	if (data.apkFile) {
		await user.upload(screen.getByLabelText(/dodaj plik instalacyjny/i), data.apkFile);
	}
	if (data.changelog) {
		await user.type(
			screen.getByRole('textbox', { name: /lista zmian/i }),
			data.changelog
		);
	}
}

function renderComponent(autoMockAppUpdateDetails: boolean = true) {
	const appId = 1;
	if (autoMockAppUpdateDetails) {
		mockAppsApi.getAppUpdateDetails.mockResolvedValue(MOCK_APP_UPDATE_DETAILS);
	}
	return {
		appId,
		renderResult: setupComponent(<UpdateAppForm appId={appId} />)
			.applyQueryClient()
			.render(),
	};
}

test('Should display a spinner when data fetch is loading', () => {
	mockAppsApi.getAppUpdateDetails.mockImplementation(() => new Promise(() => {}));
	renderComponent(false);
	expect(screen.getByRole('status')).toBeInTheDocument();
	expect(screen.queryByRole('form')).not.toBeInTheDocument();
});

test('Should display all form contents', async () => {
	renderComponent();
	expect(await screen.findByRole('form')).toBeInTheDocument();
	expect(screen.getByLabelText(/dodaj plik instalacyjny/i)).toBeInTheDocument();

	const versionInput = screen.getByRole('textbox', { name: /wersja/i });
	expect(versionInput).toBeInTheDocument();
	expect(versionInput).toHaveAttribute(
		'placeholder',
		expect.stringMatching(
			new RegExp(`Obecna wersja: ${MOCK_APP_UPDATE_DETAILS.version}`, 'i')
		)
	);
	expect(versionInput).toHaveValue('');

	const changelogInput = screen.getByRole('textbox', { name: /lista zmian/i });
	expect(changelogInput).toBeInTheDocument();
	expect(changelogInput).toHaveValue(MOCK_APP_UPDATE_DETAILS.changelog);

	expect(getSubmitButton()).toBeInTheDocument();
});

test('Should submit the form', async () => {
	const { appId } = renderComponent();
	await screen.findByRole('form');

	await clearTextInputs();
	await fillForm(MOCK_INPUT);
	await user.click(getSubmitButton());

	expect(mockAppsApi.updateApp).toHaveBeenCalledWith(appId, MOCK_INPUT);
	expect(mockOneSignalApi.sendPushAppUpdate).toHaveBeenCalledWith(
		appId,
		MOCK_APP_UPDATE_DETAILS.appName,
		MOCK_INPUT.newVersion
	);
});

test('Should trim the text values', async () => {
	renderComponent();
	await screen.findByRole('form');

	await clearTextInputs();
	await fillForm(MOCK_INPUT_NOT_TRIMMED);
	await user.click(getSubmitButton());

	expect(mockAppsApi.updateApp).toHaveBeenCalledWith(expect.anything(), MOCK_INPUT);
	expect(mockOneSignalApi.sendPushAppUpdate).toHaveBeenCalledWith(
		expect.anything(),
		expect.anything(),
		MOCK_INPUT.newVersion
	);
});

describe('Verify required fields', () => {
	const requiredFields = [
		{ key: 'newVersion', errorText: /id nowej wersji jest wymagane/i },
		{ key: 'apkFile', errorText: /plik instalacyjny jest wymagany/i },
	];
	test.each(requiredFields)('Should require $key', async ({ key }) => {
		renderComponent();
		await screen.findByRole('form');

		await clearTextInputs();
		const formData = {
			...MOCK_INPUT,
		};
		delete formData[key];
		await fillForm(formData);

		await user.click(getSubmitButton());
		expect(mockAppsApi.updateApp).not.toHaveBeenCalled();
		expect(mockOneSignalApi.sendPushAppUpdate).not.toHaveBeenCalled();
	});
});

describe('Verify optional fields', () => {
	const optionalFields = [{ key: 'changelog', emptyValue: '' }];
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
		expect(mockAppsApi.updateApp).toHaveBeenCalledWith(appId, expectedData);
		expect(mockOneSignalApi.sendPushAppUpdate).toHaveBeenCalled();
	});
});
