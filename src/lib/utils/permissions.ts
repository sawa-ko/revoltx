import { Permission } from 'revolt.js';

// TODO: Improve this tool
export type PermissionsResolvable = keyof typeof Permission;
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
