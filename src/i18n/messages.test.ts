type LocaleData = {
	locale: string;
	messages: object;
};

/**
 * Return a list of keys from `a` that are missing in `b`
 */
function getObjectsKeysDiff(a: Object, b: Object): string[] {
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);

	const result: string[] = [];

	for (const key of aKeys) {
		if (!bKeys.includes(key)) {
			result.push(key);
			continue;
		}
		if (typeof a[key] === 'object' && typeof b[key] === 'object') {
			const nestedDiff = getObjectsKeysDiff(a[key], b[key]);
			nestedDiff.forEach((nestedKey) => {
				result.push(`${key}/${nestedKey}`);
			});
		}
	}
	return result;
}

test('Validate all messages present for all locales', async () => {
	const allLocalesMessages: LocaleData[] = [];
	for (const locale of ['pl', 'en']) {
		const messages = (await import(`./messages/${locale}.json`)).default;
		allLocalesMessages.push({ locale, messages });
	}

	const [l1, ...remainingLocales] = allLocalesMessages;
	for (const l2 of remainingLocales) {
		const missingFromFirst = getObjectsKeysDiff(l1.messages, l2.messages);
		const missingFromOther = getObjectsKeysDiff(l2.messages, l1.messages);

		const pass = missingFromFirst.length === 0 && missingFromOther.length === 0;
		let failMessage = 'Expected locales to have the same messages keys.';

		const formatKeys = (keys: string[]) => keys.map((k) => `\t-${k}`);

		if (missingFromFirst.length > 0) {
			failMessage += `\nMessages from '${l1.locale}' that are not in '${l2.locale}':\n${formatKeys(missingFromFirst)}`;
		}
		if (missingFromOther.length > 0) {
			failMessage += `\nMessages from '${l2.locale}' that are not in '${l1.locale}':\n${formatKeys(missingFromOther)}`;
		}

		if (!pass) {
			throw new Error(failMessage);
		}
	}
});
