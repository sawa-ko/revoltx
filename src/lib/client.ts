import { container, Store, StoreRegistry } from '@sapphire/pieces';
import { join } from 'path';
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

	public constructor(options: ClientOptions) {
		super(options);
		this.prefix = options.prefix;
		this.id = options.id ?? null;
		container.client = this;

		this.stores = new StoreRegistry();
		container.stores = this.stores;

		this.stores.register(new ListenerStore().registerPath(join(__dirname, '..', 'listeners')));
	}

	public async start(token: string) {
		await Promise.all([...this.stores.values()].map((store: Store<any>) => store.loadAll()));
		const login = await super.loginBot(token);
		return login;
	}
}
