export default function Spinner({ size, width, light = false }) {
	return (
		<span
			className={`block border-8 rounded-[100%] border-b-transparent animate-spin ${
				light ? 'border-white' : 'border-gray-600'
			}`}
			style={{ width: size, height: size, borderWidth: width + 'px' }}
		/>
	);
}
