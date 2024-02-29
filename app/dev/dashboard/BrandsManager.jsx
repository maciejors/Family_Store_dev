async function getBrandsData() {}

export default async function BrandsManager() {
	// brands data: a list of objects { brand, appCount }
	const brandsData = await getBrandsData();

	return <div>ManageBrands</div>;
}
