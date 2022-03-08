import type { PieceOptions } from '@sapphire/pieces';
import type { Id } from 'revolt-api/types/_common';
import type { ChannelPermissionsResolvable, ServerPermissionsResolvable } from '../../lib/structures/permissions';
import type { BucketScope } from '../enums/command';

/**
 * The registered preconditions and their contexts, if any. When registering new ones, it is recommended to use
 * [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) so
 * custom ones are registered.
 *
 * When a key's value is `never`, it means that it does not take any context, which allows you to pass its identifier as
 * a bare string (e.g. `preconditions: ['NSFW']`), however, if context is required, a non-`never` type should be passed,
 * which will type {@link PreconditionContainerArray#append} and require an object with the name and a `context` with
 * the defined type.
 *
 * @example
 * ```typescript
 * declare module '@kaname-png/revoltx' {
 *   interface Preconditions {
 *     // A precondition named `Moderator` which does not read `context`:
 *     Moderator: never;
 *
 *     // A precondition named `ChannelPermissions` which does read `context`:
 *     ChannelPermissions: {
 *       permissions: Permissions;
 *     };
 *   }
 * }
 *
 * // [✔] These are valid:
 * preconditions.append('Moderator');
 * preconditions.append({ name: 'Moderator' });
 * preconditions.append({
 *   name: 'ChannelPermissions',
 *   context: { permissions: new Permissions(8) }
 * });
 *
 * // [X] These are invalid:
 * preconditions.append({ name: 'Moderator', context: {} });
 * // ➡ `never` keys do not accept `context`.
 *
 * preconditions.append('ChannelPermissions');
 * // ➡ non-`never` keys always require `context`, a string cannot be used.
 *
 * preconditions.append({
 *   name: 'ChannelPermissions',
 *   context: { unknownProperty: 1 }
 * });
 * // ➡ mismatching `context` properties, `{ unknownProperty: number }` is not
 * // assignable to `{ permissions: Permissions }`.
 * ```
 */
export interface Preconditions {
	ClientPermissions: PermissionsContext;
	Cooldown: CooldownContext;
	DMChannelOnly: never;
	Enabled: never;
	GroupChannelOnly: never;
	NSFW: never;
	ServerOnly: never;
	TextChannelOnly: never;
	UserPermissions: PermissionsContext;
}

export type PreconditionKeys = keyof Preconditions;
export type SimplePreconditionKeys = {
	[K in PreconditionKeys]: Preconditions[K] extends never ? K : never;
}[PreconditionKeys];

export interface PreconditionOptions extends PieceOptions {
	/**
	 * The position for the precondition to be set at in the global precondition list. If set to `null`, this
	 * precondition will not be set as a global one.
	 * @default null
	 */
	position?: number | null;
}

export interface PreconditionContext extends Record<PropertyKey, unknown> {
	external?: boolean;
}

export interface CooldownContext extends PreconditionContext {
	/**
	 * The scope of the cooldown entries.
	 * @since 1.1.3
	 * @default BucketScope.User
	 */
	scope?: BucketScope;

	/**
	 * The time in milliseconds for the cooldown entries to reset, if set to a non-zero value alongside {@link Command.Options.cooldownLimit}, the `Cooldown` precondition will be added to the list.
	 * @since 1.1.3
	 * @default 0
	 */
	delay: number;

	/**
	 * The amount of entries the cooldown can have before filling up, if set to a non-zero value alongside {@link Command.Options.cooldownDelay}, the `Cooldown` precondition will be added to the list.
	 * @since 1.1.3
	 * @default 1
	 */
	limit?: number;

	/**
	 * The users that are exempt from the Cooldown precondition.
	 * Use this to filter out someone like a bot owner
	 * @since 2.0.0
	 * @default undefined
	 */
	filteredUsers?: Id[];
}

export interface PermissionsContext extends PreconditionContext {
	/**
	 * Permissions required in the channel.
	 * @since 1.1.3
	 */
	channel_permissions: ChannelPermissionsResolvable[];

	/**
	 * Required permissions on the server.
	 * @since 1.1.3
	 */
	server_permissions: ServerPermissionsResolvable[];
}

export type RunInCommands = 'DMChannel' | 'GroupChannel' | 'Server' | 'TextChannel';
