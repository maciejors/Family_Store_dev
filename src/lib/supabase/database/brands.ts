import { supabase } from '../supabaseSetup';
import Brand from '@/models/Brand';

export async function getBrandsForUser(userId: string): Promise<Brand[]> {
	const { data: userBrands, error } = await supabase
		.from('brands')
		.select('id, name, apps:apps(count)')
		.eq('owner_id', userId)
		.order('created_at', { ascending: true });

	if (error) throw error;

	return userBrands.map((b) => ({
		...b,
		appCount: b.apps[0].count,
	}));
}

export async function getBrandById(brandId: number): Promise<Brand> {
	const { data: fetchedBrand, error } = await supabase
		.from('brands')
		.select('id, name, apps:apps(count)')
		.eq('id', brandId)
		.single();

	if (error) throw error;

	return {
		...fetchedBrand,
		appCount: fetchedBrand.apps[0].count,
	};
}

export async function updateBrand(brandId: number, newBrandName: string) {
	const { error } = await supabase
		.from('brands')
		.update({ name: newBrandName })
		.eq('id', brandId);

	if (error) throw error;
}

export async function addBrand(userId: string, newBrandName: string) {
	const { error } = await supabase
		.from('brands')
		.insert([{ name: newBrandName, owner_id: userId }]);

	if (error) throw error;
}

export async function deleteBrand(brandId: number) {
	const { error } = await supabase.from('brands').delete().eq('id', brandId);
	if (error) throw error;
}
