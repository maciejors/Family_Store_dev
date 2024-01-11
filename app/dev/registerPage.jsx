import './authPage.css';

export default function RegisterPage() {
	function register() {}

	return (
		<>
			<h3>Rejestracja</h3>
			<label className="auth-label" htmlFor="email">
				Email
			</label>
			<input className="auth-input" id="email" type="email" required />
			<label className="auth-label" htmlFor="password">
				Hasło
			</label>
			<input className="auth-input" id="password" type="password" required />
			<label className="auth-label" htmlFor="repeat">
				Powtórz hasło
			</label>
			<input className="auth-input" id="repeat" type="password" required />
			<button onClick={register} className="btn btn-primary auth-btn auth-btn-submit">
				Utwórz konto
			</button>
		</>
	);
}
