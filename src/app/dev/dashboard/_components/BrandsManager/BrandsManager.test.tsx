import { render, screen } from '@testing-library/react';
import BrandsManager from './BrandsManager';
import Brand from '@/models/Brand';
import * as brandsApi from '@/lib/supabase/database/brands';
import { setupComponent } from '@/__test-utils__/rendering';

const mockedBrandsApi = brandsApi as jest.Mocked<typeof brandsApi>;

const MOCK_BRANDS: Brand[] = [
	{ id: 1, name: 'My brand A', appCount: 12 },
	{ id: 2, name: 'My brand B', appCount: 0 },
	{ id: 3, name: 'My brand C', appCount: 3 },
];

function renderComponent(injectMockData = true) {
	if (injectMockData) {
		mockedBrandsApi.getBrandsForUser.mockResolvedValue(MOCK_BRANDS);
	}
	setupComponent(<BrandsManager userUid={1} />)
		.applyQueryClient()
		.render();
}

test('Displays fetched data and action buttons', async () => {
	renderComponent();

	expect(await screen.findByRole('button', { name: /dodaj/i })).toBeInTheDocument();
	for (const brand of MOCK_BRANDS) {
		expect(screen.getByText(new RegExp(brand.name))).toBeInTheDocument();
		expect(screen.getByText(new RegExp(brand.appCount.toString()))).toBeInTheDocument();
	}
	expect(screen.getAllByRole('button', { name: /edit/i })).toHaveLength(3);
	expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(1); // only 1 brand with 0 apps
});

test('Displays loading when the data is loading', async () => {
	mockedBrandsApi.getBrandsForUser.mockImplementation(() => new Promise(() => {}));
	renderComponent(false);

	expect(screen.getByRole('status')).toBeInTheDocument();
});
