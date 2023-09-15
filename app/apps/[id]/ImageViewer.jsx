import './image-viewer.css';

export default function ImageViewer({ images }) {
	return (
		<div className="img-container">
			{images.map((imgUrl, i) => (
				<img
					key={imgUrl}
					src={imgUrl}
					alt={`Image ${i + 1}/${images.length}`}
					fetchPriority="low"
					loading="lazy"
					decoding="async"
				/>
			))}
		</div>
	);
}
