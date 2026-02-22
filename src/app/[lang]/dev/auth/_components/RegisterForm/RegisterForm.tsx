import Button from '@/components/buttons/Button';
import TextInput from '@/components/inputs/TextInput';
import useAuth from '@/hooks/useAuth';
import Translator from '@/models/Translator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const createRegisterSchema = (t: Translator) =>
	z
		.object({
			email: z.email(t('invalidEmail')),
			password: z
				.string()
				.min(1, t('passwordRequired'))
				.min(8, t('passwordTooShort'))
				.regex(
					/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/i,
					t('passwordTooSimple')
				),
			repeatPassword: z.string().min(1, t('pleaseRepeatPassword')),
		})
		.refine((data) => data.password === data.repeatPassword, {
			message: t('passwordsDifferent'),
			path: ['repeatPassword'],
		});
type RegisterSchemaType = z.infer<ReturnType<typeof createRegisterSchema>>;

export default function RegisterForm() {
	const { register } = useAuth();
	const t = useTranslations('AuthPage');

	const {
		register: formRegister,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterSchemaType>({
		resolver: zodResolver(createRegisterSchema(t)),
	});

	async function onSubmitValid({ email, password }: RegisterSchemaType) {
		await register(email, password);
	}

	return (
		<form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmitValid)}>
			<h3>{t('registerTitle')}</h3>
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
			<TextInput
				{...formRegister('repeatPassword')}
				type="password"
				label={t('repeatPassword')}
				error={errors.repeatPassword?.message}
			/>
			<Button type="submit" className="mt-5 w-full">
				{t('createAccount')}
			</Button>
		</form>
	);
}
