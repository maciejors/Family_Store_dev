import Button from '@/components/buttons/Button';
import TextInput from '@/components/inputs/TextInput';
import useAuth from '@/hooks/useAuth';
import Translator from '@/models/Translator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const createLoginSchema = (t: Translator) =>
	z.object({
		email: z.email(t('invalidEmail')),
		password: z.string().min(1, t('providePassword')),
	});
type LoginSchemaType = z.infer<ReturnType<typeof createLoginSchema>>;

export default function LoginForm() {
	const { logIn } = useAuth();
	const t = useTranslations('AuthPage');

	const {
		register: formRegister,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginSchemaType>({
		resolver: zodResolver(createLoginSchema(t)),
	});

	async function onSubmitValid({ email, password }: LoginSchemaType) {
		await logIn(email, password);
	}

	return (
		<form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmitValid)}>
			<h3>{t('loginTitle')}</h3>
			<TextInput
				{...formRegister('email')}
				type="email"
				label={t('email')}
				error={errors.email?.message}
			/>
			<TextInput
				{...formRegister('password')}
				type="password"
				label={t('password')}
				error={errors.password?.message}
			/>
			<Button type="submit" className="mt-5 w-full">
				{t('logIn')}
			</Button>
		</form>
	);
}
