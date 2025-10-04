import AppPreview from './AppPreview';

export default interface AppsByBrand {
	brandId: number;
	brandName: string;
	apps: AppPreview[];
}
