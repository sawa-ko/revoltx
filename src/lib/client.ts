import { container, StoreRegistry } from '@sapphire/pieces';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { Logger } from 'tslog';
import EventEmitter from 'events';
import * as Revolt from 'revolt.js';
import type { ClientOptions, ClientPrefixHook, DefaultCooldownOptions, MemberCompositeKey } from '../utils/interfaces/client';
import type { Channel, Message, Server, Member, User, API, ClientboundNotification } from 'revolt.js';

import { ListenerStore } from './structures/stores/listener';
import { ClientEvents } from '../utils/enums/events';
import { CommandStore } from './structures/stores/command';
import { ArgumentStore } from './structures/stores/argument';
import { PreconditionStore } from './structures/stores/precondition';
import { HMROptions, startHMR } from './utils/hmr';
import type { ILogObj } from 'tslog/dist/types/interfaces';

export class Client extends EventEmitter {
	/**
	 * Client Id
	 * @since 1.0.0
	 */
	public id?: string;

	/**
	 * Commands prefix
	 * @since 1.0.0
	 */
	public defaultPrefix: string;

	/**
	 * The registered stores.
	 * @since 1.0.0
	 */
	public stores: StoreRegistry;

	/**
	 * The registered stores.
	 * @since 1.0.0
	 */
	public x: Revolt.Client;

	/**
	 * Ping to Revolt Servers.
	 * @since 1.0.0
	 */
	public ping;

	/**
	 * Base directory.
	 *
	 * Path where all commands, listeners, arguments, etc. are located.
	 * @since 1.0.0
	 */
	public baseDirectory?: string;

	/**
	 * Default Errors Listeners.
	 *
	 * Default events showing errors in commands and events.
	 * @since 1.0.0
	 */
	public loadDefaultErrorsListeners?: boolean;

	/**
	 * Sets the default cooldown time for all commands.
	 * @default "No cooldown options"
	 */
	public defaultCooldown?: DefaultCooldownOptions;

	/**
	 * The method to be overridden by the developer.
	 * @since 1.3.0
	 * @return A string for a single prefix, an array of strings for matching multiple, or null for no match (mention prefix only).
	 * @example
	 * ```typescript
	 * // Return always the same prefix (unconfigurable):
	 * client.fetchPrefix = () => '!';
	 * ```
	 * @example
	 * ```typescript
	 * // Retrieving the prefix from a SQL database:
	 * client.fetchPrefix = async (message) => {
	 *   // note: driver is something generic and depends on how you connect to your database
	 *   const guild = await driver.getOne('SELECT prefix FROM public.guild WHERE id = $1', [message.guild.id]);
	 *   return guild?.prefix ?? '!';
	 * };
	 * ```
	 * @example
	 * ```typescript
	 * // Retrieving the prefix from an ORM:
	 * client.fetchPrefix = async (message) => {
	 *   // note: driver is something generic and depends on how you connect to your database
	 *   const guild = await driver.getRepository(GuildEntity).findOne({ id: message.guild.id });
	 *   return guild?.prefix ?? '!';
	 * };
	 * ```
	 */
	public fetchPrefix: ClientPrefixHook;

	/**
	 * HMR options
	 * @since 1.3.0
	 * @default null (disabled)
	 */
	public hmr?: HMROptions;

	/**
	 * Date on which the bot was marked as ready.
	 * @since 1.4.1
	 * @default undefined
	 */
	public readyAt?: Date;

	public constructor(private clientOptions: ClientOptions) {
		super();
		this.defaultPrefix = this.clientOptions.defaultPrefix;
		this.id = this.clientOptions.id;
		this.ping = 0;
		this.baseDirectory = this.clientOptions.baseUserDirectory;
		this.loadDefaultErrorsListeners = this.clientOptions.loadDefaultErrorsListeners ?? true;
		this.defaultCooldown = this.clientOptions.defaultCooldown;
		this.hmr = this.clientOptions.hmr;

		this.stores = new StoreRegistry();
		container.client = this;
		container.stores = this.stores;
		container.logger = new Logger({
			name: 'RevoltX',
			minLevel: 1,
			maskValuesOfKeys: ['token', 'password', 'secret'],
			...this.clientOptions.logger
		});

		this.stores
			.register(new ListenerStore().registerPath(join(fileURLToPath(import.meta.url), '..', '..', 'listeners')))
			.register(new CommandStore())
			.register(new ArgumentStore().registerPath(join(fileURLToPath(import.meta.url), '..', '..', 'arguments')))
			.register(new PreconditionStore().registerPath(join(fileURLToPath(import.meta.url), '..', '..', 'preconditions')));

		// Register user directory path for the store pieces, otherwise get the path from the "main" property in package.json using the @sapphire/pieces strategy
		this.stores.registerPath(this.clientOptions.baseUserDirectory);

		if (this.loadDefaultErrorsListeners) {
			this.stores.get('listeners').registerPath(join(fileURLToPath(import.meta.url), '..', '..', 'listeners-errors'));
		}

		this.fetchPrefix = this.clientOptions.fetchPrefix ?? (() => this.clientOptions.defaultPrefix ?? null);
		this.x = new Revolt.Client();
		this.setupEvents();
	}

	/**
	 * Login to Revolt and start the client bot service.
	 * @param token Bot access token to log in.
	 * @returns Bot user.
	 */
	public async login(token: string) {
		await Promise.all([...this.stores.values()].map((store) => store.loadAll()));
		await this.x.loginBot(token);

		startHMR({ ...this.hmr });
		return this.x.user;
	}

	private setupEvents() {
		this.x.on('connected', () => this.emit(ClientEvents.Connected));
		this.x.on('connecting', () => this.emit(ClientEvents.Connected));
		this.x.on('dropped', () => this.emit(ClientEvents.Dropped));
		this.x.on('ready', () => this.emit(ClientEvents.Ready, this.x.user));
		this.x.on('logout', () => this.emit(ClientEvents.LogOut, this.x.user));
		this.x.on('message', (message: Message) => this.emit(ClientEvents.MessageCreate, message));
		this.x.on('message/update', (message: Message) => this.emit(ClientEvents.MessageUpdate, message));
		this.x.on('message/delete', (_: API.Id, message?: Message) => this.emit(ClientEvents.MessageDelete, message));
		this.x.on('channel/create', (channel: Channel) => this.emit(ClientEvents.ChannelCreate, channel));
		this.x.on('channel/update', (channel: Channel) => this.emit(ClientEvents.ChannelUpdate, channel));
		this.x.on('channel/delete', (_: API.Id, channel?: Channel) => this.emit(ClientEvents.ChannelDelete, channel));
		this.x.on('server/update', (server: Server) => this.emit(ClientEvents.ServerUpdate, server));
		this.x.on('server/delete', (_: API.Id, server?: Server) => this.emit(ClientEvents.ServerDelete, server));
		this.x.on('role/update', (_: string, role: API.Role, serverId: API.Id) =>
			this.emit(ClientEvents.RoleUpdate, { server: this.x.servers.get(serverId), role })
		);
		this.x.on('role/delete', (roleId: API.Id, serverId: API.Id) =>
			this.emit(ClientEvents.RoleDelete, { role_id: roleId, server: this.x.servers.get(serverId) })
		);
		this.x.on('member/join', (member: Member) => this.emit(ClientEvents.ServerMemberJoin, member));
		this.x.on('member/update', (member: Member) => this.emit(ClientEvents.ServerMemberUpdate, member));
		this.x.on('member/leave', (Ids: MemberCompositeKey) => this.emit(ClientEvents.ServerMemberLeave, this.x.members.get(Ids.user)));
		this.x.on('user/relationship', (user: User) => this.emit(ClientEvents.UserRelationship, user));
		this.x.on('packet', (packet: ClientboundNotification) => this.emit(ClientEvents.Packet, packet));
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		client: Client;
		logger: Logger<ILogObj>;
	}

	interface StoreRegistryEntries {
		listeners: ListenerStore;
		commands: CommandStore;
		arguments: ArgumentStore;
		preconditions: PreconditionStore;
	}
}
