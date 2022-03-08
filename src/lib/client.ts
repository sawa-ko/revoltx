import { container, StoreRegistry } from '@sapphire/pieces';
import { join } from 'path';
import { fileURLToPath } from 'url';
import EventEmitter from 'events';
import * as Revolt from 'revolt.js';
import type { ClientOptions, MemberCompositeKey } from '../utils/interfaces/client';
import type { Message } from 'revolt.js/dist/maps/Messages';
import type { Channel } from 'revolt.js/dist/maps/Channels';
import type { Server } from 'revolt.js/dist/maps/Servers';
import type { Role } from 'revolt-api/types/Servers';
import type { Member } from 'revolt.js/dist/maps/Members';
import type { User } from 'revolt.js/dist/maps/Users';
import type { ClientboundNotification } from 'revolt.js/dist/websocket/notifications';
import type { Id } from 'revolt-api/types/_common';

import { ListenerStore } from './structures/listener.store';
import { ClientEvents } from '../utils/enums/events';
import { CommandStore } from './structures/command.store';
import { ArgumentStore } from './structures/argument.store';
import { PreconditionStore } from './structures/precondition.store';

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
	public prefix: string;

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

	public constructor(private clientOptions: ClientOptions) {
		super();
		container.client = this;
		this.prefix = this.clientOptions.prefix;
		this.id = this.clientOptions.id;
		this.ping = 0;
		this.baseDirectory = this.clientOptions.baseDirectory;
		this.loadDefaultErrorsListeners = this.clientOptions.loadDefaultErrorsListeners;

		this.stores = new StoreRegistry();
		container.stores = this.stores;

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
		this.bot.on('message/delete', (messageId: Id) => this.emit(ClientEvents.MessageDelete, this.bot.messages.get(messageId)));
		this.bot.on('channel/create', (channel: Channel) => this.emit(ClientEvents.ChannelCreate, channel));
		this.bot.on('channel/update', (channel: Channel) => this.emit(ClientEvents.ChannelUpdate, channel));
		this.bot.on('channel/delete', (channelId: Id) => this.emit(ClientEvents.ChannelDelete, this.bot.channels.get(channelId)));
		this.bot.on('server/update', (server: Server) => this.emit(ClientEvents.ServerUpdate, server));
		this.bot.on('server/delete', (serverId: Id) => this.emit(ClientEvents.ServerDelete, this.bot.servers.get(serverId)));
		this.bot.on('role/update', (_: string, role: Role, serverId: Id) =>
			this.emit(ClientEvents.RoleUpdate, { server: this.bot.servers.get(serverId), role })
		);
		this.bot.on('role/delete', (roleId: Id, serverId: Id) => this.emit(ClientEvents.RoleDelete, { roleId, serverId }));
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
	}

	interface StoreRegistryEntries {
		listeners: ListenerStore;
		commands: CommandStore;
		arguments: ArgumentStore;
		preconditions: PreconditionStore;
	}
}
