export interface ClientOptions {
	id?: string;
	prefix: string;
	baseDirectory: string;
	loadDefaultErrorsListeners?: boolean;
}

export interface MemberCompositeKey {
	server: string;
	user: string;
}
