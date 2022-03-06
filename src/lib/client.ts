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

import { ListenerStore } from './structures/listener.store';
import { ClientEvents } from '../utils/enums/events';
import { CommandStore } from './structures/command.store';

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

	public constructor(private clientOptions: ClientOptions) {
		super();
		container.client = this;
		this.prefix = this.clientOptions.prefix;
		this.id = this.clientOptions.id;
		this.ping = 0;

		this.stores = new StoreRegistry();
		container.stores = this.stores;

		this.stores.register(new ListenerStore().registerPath(join(fileURLToPath(import.meta.url), '..', '..', 'listeners')));
		this.stores.register(new CommandStore().registerPath(join(fileURLToPath(import.meta.url), '..', '..', 'listeners')));

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
		this.bot.on('connected', () => this.emit(ClientEvents.CONNECTED));
		this.bot.on('connecting', () => this.emit(ClientEvents.CONNECTED));
		this.bot.on('dropped', () => this.emit(ClientEvents.DROPPED));
		this.bot.on('ready', () => this.emit(ClientEvents.READY, this.bot.user));
		this.bot.on('logout', () => this.emit(ClientEvents.LOGOUT, this.bot.user));
		this.bot.on('message', (message: Message) => this.emit(ClientEvents.MESSAGE, message));
		this.bot.on('message/update', (message: Message) => this.emit(ClientEvents.MESSAGE_UPDATE, message));
		this.bot.on('message/delete', (id: string) => this.emit(ClientEvents.MESSAGE_DELETE, this.bot.messages.get(id)));
		this.bot.on('channel/create', (channel: Channel) => this.emit(ClientEvents.CHANNEL_CREATE, channel));
		this.bot.on('channel/update', (channel: Channel) => this.emit(ClientEvents.CHANNEL_UPDATE, channel));
		this.bot.on('channel/delete', (id: string) => this.emit(ClientEvents.CHANNEL_DELETE, this.bot.channels.get(id)));
		this.bot.on('server/update', (server: Server) => this.emit(ClientEvents.SERVER_UPDATE, server));
		this.bot.on('server/delete', (serverId: string) => this.emit(ClientEvents.SERVER_DELETE, this.bot.servers.get(serverId)));
		this.bot.on('role/update', (_: string, role: Role, serverId: string) =>
			this.emit(ClientEvents.ROLE_UPDATE, { server: this.bot.servers.get(serverId), role })
		);
		this.bot.on('role/delete', (roleId: string, serverId: string) => this.emit(ClientEvents.ROLE_DELETE, { roleId, serverId }));
		this.bot.on('member/join', (member: Member) => this.emit(ClientEvents.SERVER_MEMBER_JOIN, member));
		this.bot.on('member/update', (member: Member) => this.emit(ClientEvents.SERVER_MEMBER_UPDATE, member));
		this.bot.on('member/leave', (Ids: MemberCompositeKey) => this.emit(ClientEvents.SERVER_MEMBER_LEAVE, this.bot.members.get(Ids.user)));
		this.bot.on('user/relationship', (user: User) => this.emit(ClientEvents.USER_RELATIONSHIP, user));
		this.bot.on('packet', (packet: ClientboundNotification) => this.emit(ClientEvents.PACKET, packet));
	}
}

declare module '@sapphire/pieces' {
	interface Container {
		client: Client;
	}

	interface StoreRegistryEntries {
		listeners: ListenerStore;
		commands: CommandStore;
	}
}
