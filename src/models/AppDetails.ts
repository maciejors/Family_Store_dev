import AppPreview from './AppPreview';

export default interface AppDetails extends AppPreview {
	description: string | null;
	changelog: string | null;
	downloadUrl: string;
	pictureUrls: string[];
	pictureNames: string[];
}
