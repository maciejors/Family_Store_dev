import './authPage.css';

export default function LoginPage() {

	function login() {

	}

	return (
		<>
			<h3>Logowanie</h3>
			<label className="auth-label" htmlFor="email">
				Email
			</label>
			<input className="auth-input" id="email" type="email" required />
			<label className="auth-label" htmlFor="password">
				Hasło
			</label>
			<input className="auth-input" id="password" type="password" required />
			<a className="auth-label auth-link" href="">
				Nie pamiętasz hasła?
			</a>
			<button onClick={login} className="btn btn-primary auth-btn auth-btn-submit">Zaloguj się</button>
		</>
	);
}
