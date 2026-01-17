import Role from './Role';

export default interface User {
	uid: string;
	email: string;
	displayName: string;
	role: Role;
}
