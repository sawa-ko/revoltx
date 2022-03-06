import type { Client } from '../../lib/client';

export interface ClientOptions {
	id?: string;
	prefix: string;
	piecesDirectory?: string;
}

export interface Container {
	client: Client;
}

export interface MemberCompositeKey {
	server: string;
	user: string;
}
