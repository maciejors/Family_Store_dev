const actualNextIntl = jest.requireActual('next-intl');

module.exports = {
	...actualNextIntl,
	useFormatter: jest.fn(() => ({
		dateTime: (date: Date) => date.toISOString(),
	})),
};
