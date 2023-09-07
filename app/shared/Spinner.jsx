export default function Spinner({ size, width }) {
	return (
		<span
			className="block border-8 border-gray-600 rounded-[100%] border-b-transparent animate-spin"
			style={{ width: size, height: size, borderWidth: width + 'px' }}
		/>
	);
}
