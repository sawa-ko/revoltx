import { container, StoreRegistry } from '@sapphire/pieces';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { Logger } from 'tslog';
import EventEmitter from 'events';
import * as Revolt from 'revolt.js';
import type { ClientOptions, ClientPrefixHook, DefaultCooldownOptions, MemberCompositeKey } from '../utils/interfaces/client';
import type { Channel, Message, Server, Member, User, API } from 'revolt.js';
import type { ClientboundNotification } from 'revolt.js/dist/websocket/notifications';

import { ListenerStore } from './structures/listener.store';
import { ClientEvents } from '../utils/enums/events';
import { CommandStore } from './structures/command.store';
import { ArgumentStore } from './structures/argument.store';
import { PreconditionStore } from './structures/precondition.store';
import { HMROptions, startHMR } from './utils/hmr';

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
	public bot: Revolt.Client;

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

	public constructor(private clientOptions: ClientOptions) {
		super();
		container.client = this;
		this.defaultPrefix = this.clientOptions.defaultPrefix;
		this.id = this.clientOptions.id;
		this.ping = 0;
		this.baseDirectory = this.clientOptions.baseDirectory;
		this.loadDefaultErrorsListeners = this.clientOptions.loadDefaultErrorsListeners;
		this.defaultCooldown = this.clientOptions.defaultCooldown;
		this.hmr = this.clientOptions.hmr;

		this.stores = new StoreRegistry();
		container.stores = this.stores;
		container.logger = new Logger({
			name: 'RevoltX',
			minLevel: 'info',
			displayFilePath: 'hidden',
			maskValuesOfKeys: ['token', 'password', 'secret'],
			exposeErrorCodeFrameLinesBeforeAndAfter: 10,
			...this.clientOptions.logger
		});

		this.stores.register(new ListenerStore().registerPath(join(fileURLToPath(import.meta.url), '..', '..', 'listeners')));
		this.stores.register(new CommandStore().registerPath(join(fileURLToPath(import.meta.url), '..', '..', 'commands')));
		this.stores.register(new ArgumentStore().registerPath(join(fileURLToPath(import.meta.url), '..', '..', 'arguments')));
		this.stores.register(new PreconditionStore().registerPath(join(fileURLToPath(import.meta.url), '..', '..', 'preconditions')));

		if (this.baseDirectory) {
			this.stores.get('commands').registerPath(join(this.baseDirectory, 'commands'));
			this.stores.get('listeners').registerPath(join(this.baseDirectory, 'listeners'));
			this.stores.get('arguments').registerPath(join(this.baseDirectory, 'arguments'));
			this.stores.get('preconditions').registerPath(join(this.baseDirectory, 'preconditions'));
		}

		if (this.loadDefaultErrorsListeners) {
			this.stores.get('listeners').registerPath(join(fileURLToPath(import.meta.url), '..', '..', 'listeners-errors'));
		}

		this.fetchPrefix = this.clientOptions.fetchPrefix ?? (() => this.clientOptions.defaultPrefix ?? null);
		this.bot = new Revolt.Client();
		this.setupEvents();
	}

	/**
	 * Login to Revolt and start the client bot service.
	 * @param token Bot access token to log in.
	 * @returns Bot user.
	 */
	public async login(token: string) {
		await Promise.all([...this.stores.values()].map((store) => store.loadAll()));
		await this.bot.loginBot(token);
		startHMR(this.hmr);
		return this.bot.user;
	}

	private setupEvents() {
		this.bot.on('connected', () => this.emit(ClientEvents.Connected));
		this.bot.on('connecting', () => this.emit(ClientEvents.Connected));
		this.bot.on('dropped', () => this.emit(ClientEvents.Dropped));
		this.bot.on('ready', () => this.emit(ClientEvents.Ready, this.bot.user));
		this.bot.on('logout', () => this.emit(ClientEvents.LogOut, this.bot.user));
		this.bot.on('message', (message: Message) => this.emit(ClientEvents.MessageCreate, message));
		this.bot.on('message/update', (message: Message) => this.emit(ClientEvents.MessageUpdate, message));
		this.bot.on('message/delete', (messageId: API.Id) => this.emit(ClientEvents.MessageDelete, this.bot.messages.get(messageId)));
		this.bot.on('channel/create', (channel: Channel) => this.emit(ClientEvents.ChannelCreate, channel));
		this.bot.on('channel/update', (channel: Channel) => this.emit(ClientEvents.ChannelUpdate, channel));
		this.bot.on('channel/delete', (channelId: API.Id) => this.emit(ClientEvents.ChannelDelete, this.bot.channels.get(channelId)));
		this.bot.on('server/update', (server: Server) => this.emit(ClientEvents.ServerUpdate, server));
		this.bot.on('server/delete', (serverId: API.Id) => this.emit(ClientEvents.ServerDelete, this.bot.servers.get(serverId)));
		this.bot.on('role/update', (_: string, role: API.Role, serverId: API.Id) =>
			this.emit(ClientEvents.RoleUpdate, { server: this.bot.servers.get(serverId), role })
		);
		this.bot.on('role/delete', (roleId: API.Id, serverId: API.Id) => this.emit(ClientEvents.RoleDelete, { roleId, serverId }));
		this.bot.on('member/join', (member: Member) => this.emit(ClientEvents.ServerMemberJoin, member));
		this.bot.on('member/update', (member: Member) => this.emit(ClientEvents.ServerMemberUpdate, member));
		this.bot.on('member/leave', (Ids: MemberCompositeKey) => this.emit(ClientEvents.ServerMemberLeave, this.bot.members.get(Ids.user)));
		this.bot.on('user/relationship', (user: User) => this.emit(ClientEvents.UserRelationship, user));
		this.bot.on('packet', (packet: ClientboundNotification) => this.emit(ClientEvents.Packet, packet));
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		client: Client;
		logger: Logger;
	}

	interface StoreRegistryEntries {
		listeners: ListenerStore;
		commands: CommandStore;
		arguments: ArgumentStore;
		preconditions: PreconditionStore;
	}
}
