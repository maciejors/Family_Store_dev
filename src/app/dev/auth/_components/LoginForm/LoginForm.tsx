import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/buttons/Button';
import useAuth from '@/hooks/useAuth';
import TextInput from '@/components/inputs/TextInput';

const loginSchema = z.object({
	email: z.email('Adres e-mail jest nieprawidłowy'),
	password: z.string().min(1, 'Proszę podać hasło'),
});
type LoginSchemaType = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const { logIn } = useAuth();

	const {
		register: formRegister,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginSchemaType>({
		resolver: zodResolver(loginSchema),
	});

	async function onSubmitValid({ email, password }: LoginSchemaType) {
		await logIn(email, password);
	}

	return (
		<form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmitValid)}>
			<h3>Logowanie</h3>
			<TextInput
				{...formRegister('email')}
				type="email"
				label="Email"
				error={errors.email?.message}
			/>
			<TextInput
				{...formRegister('password')}
				type="password"
				label="Hasło"
				error={errors.password?.message}
			/>
			{/* <a className="mt-5 underline self-end hidden" href={undefined}>
				Nie pamiętasz hasła?
			</a> */}
			<Button type="submit" className="mt-5 w-full">
				Zaloguj się
			</Button>
		</form>
	);
}
