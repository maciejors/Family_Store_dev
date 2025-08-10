export default interface AppDetails {
	id: string;
	name: string;
	authorId: string;
	version: string;
	lastUpdated: number;
	logoUrl: string;
	description: string;
	changelog: string;
	downloadUrl: string;
	pictureUrls: string[];
	pictureNames: string[];
}
