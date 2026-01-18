export type ImageViewerProps = {
	imagesUrls: string[];
};

export default function ImageViewer({ imagesUrls }: ImageViewerProps) {
	return (
		<div
			className="w-full h-80 flex gap-1 items-center justify-start overflow-x-auto"
			style={{ height: 'calc(20rem + 100vw - 100%)' }}
		>
			{imagesUrls.map((imgUrl, i) => (
				<img
					key={imgUrl}
					src={imgUrl}
					alt={`Image ${i + 1}/${imagesUrls.length}`}
					loading="lazy"
					decoding="async"
					className="max-h-80 max-w-[90%] w-auto"
				/>
			))}
		</div>
	);
}
