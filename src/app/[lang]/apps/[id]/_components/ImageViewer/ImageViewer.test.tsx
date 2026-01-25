import { setupComponent } from '@/__test-utils__/rendering';
import { screen } from '@testing-library/react';
import ImageViewer from './ImageViewer';

function renderComponent() {
	const imageUrls = [
		'https://localhost/fake-picture-url-1.png',
		'https://localhost/fake-picture-url-2.png',
		'https://localhost/fake-picture-url-3.png',
	];
	return {
		imageUrls,
		renderResult: setupComponent(<ImageViewer imagesUrls={imageUrls} />)
			.applyLocale()
			.render(),
	};
}

test('Should display all images', () => {
	const { imageUrls } = renderComponent();

	expect(screen.getAllByRole('img')).toHaveLength(imageUrls.length);
	imageUrls.forEach((url, i) => {
		const img = screen.getByRole('img', {
			name: new RegExp(`image ${i + 1}/${imageUrls.length}`, 'i'),
		});
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute('src', url);
	});
});
