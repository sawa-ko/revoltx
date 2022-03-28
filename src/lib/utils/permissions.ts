import { container } from '@sapphire/pieces';
import { Channel, Permission } from 'revolt.js';

export class PermissionsManager {
	private _permissions = 0;

	public add(permissions: number | number[] | PermissionsResolvable[]) {
		if (Array.isArray(permissions)) {
			permissions.forEach((permission) => {
				this._permissions |= typeof permission === 'number' ? permission : Permission[permission];
			});
		} else {
			this._permissions |= permissions;
		}

		return this;
	}

	public delete(permissions: number | number[] | PermissionsResolvable[]) {
		if (Array.isArray(permissions)) {
			permissions.forEach((permission) => {
				this._permissions &= typeof permission === 'number' ? permission : Permission[permission];
			});
		} else {
			this._permissions &= permissions;
		}

		return this;
	}

	public has(permission: number | PermissionsResolvable) {
		if (typeof permission === 'number') {
			if ((this._permissions & permission) === Permission.GrantAllSafe) return Permission.GrantAllSafe;
			return (this._permissions & permission) === permission;
		}

		return (this._permissions & Permission[permission]) === Permission[permission];
	}

	public missing(permissions: PermissionsResolvable[]) {
		return permissions.filter((p) => !this.has(p));
	}

	public async computeChannelPermissions(channel: Channel, user = container.client.bot.user) {
		switch (channel.channel_type) {
			case 'SavedMessages':
				this._permissions = Permission.GrantAllSafe;
				break;
			case 'DirectMessage':
			case 'Group':
				this._permissions = DEFAULT_PERMISSION_DIRECT_MESSAGE;
				break;
			case 'TextChannel':
			case 'VoiceChannel': {
				if (!channel.server) break;
				if (channel.owner_id === user?._id) {
					this._permissions = Permission.GrantAllSafe;
				}

				const member = await channel.server?.fetchMember(user?._id ?? '0').catch(() => null);
				if (!member) break;

				this.add(channel.default_permissions ?? channel.server.default_permissions ?? 0);
				if (member.roles) {
					for (const role of member.roles) {
						this.add(channel.role_permissions?.[role] ?? 0);
						this.add(channel.server.roles?.[role].permissions[1] ?? 0);
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
			this._permissions = Permission.GrantAllSafe;
		}

		const member = await channel.server?.fetchMember(user?._id ?? '0'.repeat(26)).catch(() => null);
		if (!member) return;

		this.add(channel.server.default_permissions);
		if (member.roles) {
			for (const role of member.roles) {
				this.add(channel.server.roles?.[role].permissions[0] ?? 0);
			}
		}

		return this;
	}

	public get permissions() {
		const permissions: PermissionsResolvable[] = [];
		Object.keys(Permission).forEach((permission) => {
			// @ts-expect-error yup, ignore this
			if (this.has(Permission[permission])) permissions.push(Permission[permission]);
		});

		return permissions;
	}

	public get code() {
		return this._permissions;
	}

	public set setPermissions(permissions: number) {
		this._permissions = permissions;
	}
}

export type PermissionsResolvable = keyof typeof Permission;
export const DEFAULT_PERMISSION =
	Permission.ViewChannel +
	Permission.ReadMessageHistory +
	Permission.SendMessage +
	Permission.InviteOthers +
	Permission.SendEmbeds +
	Permission.UploadFiles +
	Permission.Connect +
	Permission.Speak;

export const DEFAULT_PERMISSION_DIRECT_MESSAGE = DEFAULT_PERMISSION + Permission.ManageChannel;
