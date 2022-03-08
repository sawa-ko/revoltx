import { ChannelPermission, DEFAULT_PERMISSION_DM, ServerPermission, U32_MAX } from 'revolt.js/dist/api/permissions';
import { container } from '@sapphire/pieces';
import type { Channel } from 'revolt.js/dist/maps/Channels';

export type PERMISSION_TYPE = 'SERVER' | 'CHANNEL';
export type ServerPermissionsResolvable = keyof typeof ServerPermission;
export type ChannelPermissionsResolvable = keyof typeof ChannelPermission;

export class PermissionsManager {
	private _permissions = {
		SERVER: 0,
		CHANNEL: 0
	};

	public add(permissions: number | number[] | ChannelPermissionsResolvable[] | ServerPermissionsResolvable[], type: PERMISSION_TYPE) {
		if (Array.isArray(permissions)) {
			permissions.forEach((permission) => {
				this._permissions[type] |=
					typeof permission === 'number'
						? permission
						: type === 'SERVER'
						? ServerPermission[permission as ServerPermissionsResolvable] ?? 0
						: ChannelPermission[permission as ChannelPermissionsResolvable] ?? 0;
			});
		} else {
			this._permissions[type] |= permissions;
		}

		return this;
	}

	public delete(permissions: number | number[] | ChannelPermissionsResolvable[] | ServerPermissionsResolvable[], type: PERMISSION_TYPE) {
		if (Array.isArray(permissions)) {
			permissions.forEach((permission) => {
				this._permissions[type] &=
					typeof permission === 'number'
						? permission
						: type === 'SERVER'
						? ServerPermission[permission as ServerPermissionsResolvable] ?? 0
						: ChannelPermission[permission as ChannelPermissionsResolvable] ?? 0;
			});
		} else {
			this._permissions[type] &= permissions;
		}

		return this;
	}

	public has(permission: number | ChannelPermissionsResolvable | ServerPermissionsResolvable, type: PERMISSION_TYPE) {
		if (typeof permission === 'number') {
			if ((this._permissions[type] & permission) === U32_MAX) return U32_MAX;
			return (this._permissions[type] & permission) === permission;
		}

		const perm =
			type === 'SERVER'
				? ServerPermission[permission as unknown as ServerPermissionsResolvable]
				: ChannelPermission[permission as unknown as ChannelPermissionsResolvable];

		return (this._permissions[type] & perm) === perm;
	}

	public async computeChannelPermissions(channel: Channel, user = container.client.bot.user) {
		switch (channel.channel_type) {
			case 'SavedMessages':
				this._permissions.CHANNEL = U32_MAX;
				break;
			case 'DirectMessage':
			case 'Group':
				this._permissions.CHANNEL = DEFAULT_PERMISSION_DM;
				break;
			case 'TextChannel':
			case 'VoiceChannel': {
				if (!channel.server) break;
				if (channel.owner_id === user?._id) {
					this._permissions.CHANNEL = U32_MAX;
				}

				const member = await channel.server?.fetchMember(user?._id ?? '0').catch(() => null);
				if (!member) break;

				this.add(channel.default_permissions ?? channel.server.default_permissions[1] ?? 0, 'CHANNEL');
				if (member.roles) {
					for (const role of member.roles) {
						this.add(channel.role_permissions?.[role] ?? 0, 'CHANNEL');
						this.add(channel.server.roles?.[role].permissions[1] ?? 0, 'CHANNEL');
					}
				}

				break;
			}
		}

		return this;
	}

	public async computeServerPermissions(channel: Channel, user = container.client.bot.user) {
		if (!channel.server) return;
		if (channel.owner_id === user?._id) {
			this._permissions.SERVER = U32_MAX;
		}

		const member = await channel.server?.fetchMember(user?._id ?? '0'.repeat(26)).catch(() => null);
		if (!member) return;

		this.add(channel.server.default_permissions[0], 'SERVER');
		if (member.roles) {
			for (const role of member.roles) {
				this.add(channel.server.roles?.[role].permissions[0] ?? 0, 'SERVER');
			}
		}

		return this;
	}

	public get serverPermissionsList() {
		const permissions: ServerPermissionsResolvable[] = [];
		Object.keys(ServerPermission).forEach((permission) => {
			// @ts-expect-error This is not an error.
			if (this.has(ServerPermission[permission], 'SERVER')) permissions.push(permission);
		});

		return permissions;
	}

	public get channelPermissionsList() {
		const permissions: ChannelPermissionsResolvable[] = [];
		Object.keys(ChannelPermission).forEach((permission) => {
			// @ts-expect-error This is not an error.
			if (this.has(ChannelPermission[permission], 'CHANNEL')) permissions.push(permission);
		});

		return permissions;
	}

	public get permissions() {
		return {
			channel: { code: this._permissions.CHANNEL, list: this.channelPermissionsList },
			server: { code: this._permissions.SERVER, list: this.serverPermissionsList }
		};
	}

	public get code() {
		return this._permissions;
	}

	public set setPermissions(options: { permissions: number; type: PERMISSION_TYPE }) {
		this._permissions[options.type] = options.permissions;
	}
}
