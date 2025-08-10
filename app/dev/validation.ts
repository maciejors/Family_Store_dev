export default function validate(email?: string, password?: string, repeatPassword?: string) {
	let isValid = true;
	let message = '';

	if (!(email && password && repeatPassword)) {
		isValid = false;
		message = 'Wypełnij wszystkie pola';
	} else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/i)) {
		isValid = false;
		message = 'Adres e-mail jest nieprawidłowy';
	} else if (password !== repeatPassword) {
		isValid = false;
		message = 'Hasła nie są takie same';
	} else if (!password.match(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i)) {
		isValid = false;
		message = 'Twoje hasło jest do dupy, wymyśl coś trudniejszego';
	}

	return {
		isValid,
		message,
	};
}
