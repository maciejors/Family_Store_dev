import { setupComponent } from '@/__test-utils__/rendering';
import useAuth from '@/hooks/useAuth';
import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import RegisterForm from './RegisterForm';

jest.mock('@/hooks/useAuth');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockRegister = jest.fn();
const mockUseAuthReturnValue = {
	currentUser: null,
	register: mockRegister,
	logIn: jest.fn(),
	logOut: jest.fn(),
};
mockUseAuth.mockReturnValue(mockUseAuthReturnValue);

function renderComponent() {
	return setupComponent(<RegisterForm />)
		.applyLocale('pl')
		.render();
}

type FormData = {
	email?: string;
	password?: string;
	repeatPassword?: string;
};

const getRegisterButton = () => screen.getByRole('button', { name: /utwórz konto/i });

async function fillForm(data: FormData) {
	if (data.email) {
		await user.type(screen.getByRole('textbox', { name: /email/i }), data.email);
	}
	if (data.password) {
		await user.type(screen.getByLabelText(/^hasło/i), data.password);
	}
	if (data.repeatPassword) {
		await user.type(screen.getByLabelText(/powtórz hasło/i), data.repeatPassword);
	}
}

test('Should render register form', async () => {
	renderComponent();
	expect(screen.getByRole('heading', { name: /rejestracja/i })).toBeInTheDocument();
	expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
	expect(screen.getByLabelText(/^hasło/i)).toBeInTheDocument();
	expect(screen.getByLabelText(/powtórz hasło/i)).toBeInTheDocument();
	expect(getRegisterButton()).toBeInTheDocument();
});

test('Should allow to register', async () => {
	renderComponent();

	const email = 'test@example.com';
	const password = 'Password@123';
	await fillForm({ email, password, repeatPassword: password });

	await user.click(getRegisterButton());
	expect(mockRegister).toHaveBeenCalledWith(email, password);
});

describe('Verify required fields', () => {
	const requiredFields = [
		{ id: 'email', missingMsg: /adres e-mail jest nieprawidłowy/i },
		{ id: 'password', missingMsg: /hasło jest wymagane/i },
		{ id: 'repeatPassword', missingMsg: /proszę powtórzyć hasło/i },
	];
	const fullFormInput = {
		email: 'test@example.com',
		password: 'Password@123',
		repeatPassword: 'Password@123',
	};

	test.each(requiredFields)('Should require $id', async ({ id, missingMsg }) => {
		renderComponent();

		const partialFormInput = { ...fullFormInput };
		delete partialFormInput[id];

		await fillForm(partialFormInput);
		await user.click(getRegisterButton());

		expect(mockRegister).not.toHaveBeenCalled();
		expect(screen.getByText(missingMsg)).toBeInTheDocument();
	});
});

test('Should validate password length', async () => {
	renderComponent();

	const shortPassword = 'a@1';
	await fillForm({
		email: 'test@example.com',
		password: shortPassword,
		repeatPassword: shortPassword,
	});
	await user.click(getRegisterButton());

	expect(mockRegister).not.toHaveBeenCalled();
	expect(screen.getByText(/Hasło musi mieć przynajmniej 8 znaków/i)).toBeInTheDocument();
});

test('Should validate password strength', async () => {
	renderComponent();

	const weakPassword = 'weakpass';
	await fillForm({
		email: 'test@example.com',
		password: weakPassword,
		repeatPassword: weakPassword,
	});
	await user.click(getRegisterButton());

	expect(mockRegister).not.toHaveBeenCalled();
	expect(
		screen.getByText(
			/Hasło musi zawierać przynajmniej 1 literę, 1 cyfrę, oraz 1 znak specjalny/i
		)
	).toBeInTheDocument();
});

test('Should validate repeat password', async () => {
	renderComponent();

	await fillForm({
		email: 'test@example.com',
		password: 'Password@123',
		repeatPassword: 'DifferentPassword',
	});
	await user.click(getRegisterButton());

	expect(mockRegister).not.toHaveBeenCalled();
	expect(screen.getByText(/hasła nie są takie same/i)).toBeInTheDocument();
});
