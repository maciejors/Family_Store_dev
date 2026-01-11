import AppPicture from './AppPicture';
import AppPreview from './AppPreview';

export default interface AppDetails extends AppPreview {
	brandName: string;
	description: string | null;
	changelog: string | null;
	downloadUrl: string;
	pictures: AppPicture[];
}
