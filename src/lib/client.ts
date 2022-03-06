import { container, StoreRegistry } from '@sapphire/pieces';
import { join } from 'path';
import { fileURLToPath } from 'url';
import * as Revolt from 'revolt.js';

import { ListenerStore } from './structures/listener.store';
import type { ClientOptions } from '../utils/interfaces/client';

export class Client extends Revolt.Client {
	/**
	 * Client Id
	 * @since 1.0.0
	 */
	public id: string | null;

	/**
	 * Commands prefix
	 * @since 1.0.0
	 */
	public prefix: string;

	/**
	 * The registered stores.
	 * @since 1.0.0
	 */
	public stores: StoreRegistry;

	public constructor(private clientOptions: ClientOptions) {
		super();
		this.prefix = this.clientOptions.prefix;
		this.id = this.clientOptions.id ?? null;
		container.client = this;

		this.stores = new StoreRegistry();
		container.stores = this.stores;

		this.stores.register(new ListenerStore().registerPath(join(fileURLToPath(import.meta.url), '..', 'listeners')));
	}

	public async start(token: string) {
		await Promise.all([...this.stores.values()].map((store) => store.loadAll()));
		const login = await super.loginBot(token);
		return login;
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		client: Client;
	}

	interface StoreRegistryEntries {
		listeners: ListenerStore;
	}
}
