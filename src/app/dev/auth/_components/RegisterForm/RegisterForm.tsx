import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/buttons/Button';
import TextInput from '@/components/inputs/TextInput';
import useAuth from '@/hooks/useAuth';

const registerSchema = z
	.object({
		email: z.email('Adres e-mail jest nieprawidłowy'),
		password: z
			.string()
			.min(1, 'Hasło jest wymagane')
			.min(8, 'Hasło musi mieć przynajmniej 8 znaków')
			.regex(
				/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i,
				'Hasło musi zawierać przynajmniej 1 literę, 1 cyfrę, oraz 1 znak specjalny'
			),
		repeatPassword: z.string().min(1, 'Proszę powtórzyć hasło'),
	})
	.refine((data) => data.password === data.repeatPassword, {
		message: 'Hasła nie są takie same',
		path: ['repeatPassword'],
	});
type RegisterSchemaType = z.infer<typeof registerSchema>;

export default function RegisterForm() {
	const { register } = useAuth();

	const {
		register: formRegister,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterSchemaType>({
		resolver: zodResolver(registerSchema),
	});

	async function onSubmitValid({ email, password }: RegisterSchemaType) {
		await register(email, password);
	}

	return (
		<form className="flex flex-col" onSubmit={handleSubmit(onSubmitValid)}>
			<h3>Rejestracja</h3>
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
			<TextInput
				{...formRegister('repeatPassword')}
				type="password"
				label="Powtórz Hasło"
				error={errors.repeatPassword?.message}
			/>
			<Button type="submit" className="mt-5 w-full">
				Utwórz konto
			</Button>
		</form>
	);
}
