import type * as Revolt from 'revolt.js';

import type { Client } from '../../lib/client';

export interface ClientOptions extends Revolt.ClientOptions {
	id?: string;
	prefix: string;
}

export interface Container {
	client?: Client;
}
