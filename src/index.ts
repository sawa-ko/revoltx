import type { Client } from 'revolt.js';

declare module '@sapphire/pieces' {
	interface Container {
		client: Client;
	}
}

export * from './lib/client';
