import { ChannelPermission, DEFAULT_PERMISSION_DM, ServerPermission, U32_MAX } from 'revolt.js/dist/api/permissions';
import { container } from '@sapphire/pieces';
import type { Channel } from 'revolt.js/dist/maps/Channels';

export type PERMISSION_TYPE = 'SERVER' | 'CHANNEL';

export class Permissions {
	private _permissions = {
		SERVER: 0,
		CHANNEL: 0
	};

	public add(permissions: number | number[], type: PERMISSION_TYPE) {
		if (Array.isArray(permissions)) {
			permissions.forEach((permission) => {
				this._permissions[type] |= permission;
			});
		} else {
			this._permissions[type] |= permissions;
		}

		return this;
	}

	public delete(permissions: number | number[], type: PERMISSION_TYPE) {
		if (Array.isArray(permissions)) {
			permissions.forEach((permission) => {
				this._permissions[type] &= ~permission;
			});
		} else {
			this._permissions[type] &= ~permissions;
		}

		return this;
	}

	public has(permission: number, type: PERMISSION_TYPE) {
		if ((this._permissions[type] & permission) === U32_MAX) return U32_MAX;
		return (this._permissions[type] & permission) === permission;
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

				let permissions = channel.default_permissions ?? channel.server.default_permissions[1] ?? 0;
				if (member.roles) {
					for (const role of member.roles) {
						permissions |= channel.role_permissions?.[role] ?? 0;
						permissions |= channel.server.roles?.[role].permissions[1] ?? 0;
					}
				}

				this._permissions.CHANNEL = permissions;
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

		let permissions = channel.server.default_permissions[0] >>> 0;
		if (member.roles) {
			for (const role of member.roles) {
				permissions |= (channel.server.roles?.[role].permissions[0] ?? 0) >>> 0;
			}
		}

		this._permissions.SERVER = permissions;
		return this;
	}

	public get serverPermissionsList() {
		const permissions: string[] = [];
		Object.keys(ServerPermission).forEach((permission) => {
			// @ts-expect-error This is not an error.
			if (this.has(ServerPermission[permission], 'SERVER')) permissions.push(permission);
		});

		return permissions;
	}

	public get channelPermissionsList() {
		const permissions: string[] = [];
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
