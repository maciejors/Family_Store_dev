import './image-viewer.css';

interface ImageViewerProps {
	imagesUrls: string[];
}

export default function ImageViewer({ imagesUrls }: ImageViewerProps) {
	return (
		<div className="img-container">
			{imagesUrls.map((imgUrl, i) => (
				<img
					key={imgUrl}
					src={imgUrl}
					alt={`Image ${i + 1}/${imagesUrls.length}`}
					fetchPriority="low"
					loading="lazy"
					decoding="async"
				/>
			))}
		</div>
	);
}
