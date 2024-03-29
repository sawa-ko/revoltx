import type { AliasPieceJSON, AliasPieceOptions } from '@sapphire/pieces';
import type { ResultError } from '@sapphire/result';
import type { NonNullObject } from '@sapphire/utilities';
import type { Message, API } from 'revolt.js';

import type { UserError } from '../../lib/errors/user-error';
import type { PreconditionEntryResolvable } from '../../lib/preconditions/precondition-container-array';

import type { Command } from '../../lib/structures/command';
import type { PermissionsResolvable } from '../../lib/utils/permissions';
import type { BucketScope } from '../enums/command';
import type { FlagStrategyOptions } from '../strategies/flag-unordered-strategy';
import type { RunInCommands } from './precondition';

export type CommandMetadata = string | CommandMetadataObject;

export interface CommandMetadataObject extends NonNullObject {}

export interface CommandOptions extends AliasPieceOptions, FlagStrategyOptions {
	/**
	 * Command description.
	 * @since 1.0.0
	 */
	description?: string;

	/**
	 * Extra data for the command, such as help, more information, etc. Useful for help commands.
	 * TypeScript users can augment the CommandMetadata interface to add their own data.
	 * @since 1.0.0
	 * @see [TypeScript Augment](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
	 */
	metadata?: CommandMetadata;

	/**
	 * Command category.
	 * The command category can be used to categorize the commands in a help command, etc.
	 * @since 1.0.0
	 */
	category?: string;

	/**
	 * The {@link Precondition}s to be run, accepts an array of their names.
	 * @seealso {@link PreconditionContainerArray}
	 * @since 1.0.0
	 * @default []
	 */
	preconditions?: readonly PreconditionEntryResolvable[];

	/**
	 * Mark commands as NSFW.
	 * @since 1.0.0
	 */
	nsfw?: boolean;

	/**
	 * Set individual command cooldown.
	 * */
	cooldown?: {
		/**
		 * The amount of entries the cooldown can have before filling up, if set to a non-zero value alongside {@link Command.Options.cooldownDelay}, the `Cooldown` precondition will be added to the list.
		 * @since 1.1.3
		 * @default 1
		 */
		cooldownLimit?: number;

		/**
		 * The time in milliseconds for the cooldown entries to reset, if set to a non-zero value alongside {@link Command.Options.cooldownLimit}, the `Cooldown` precondition will be added to the list.
		 * @since 1.1.3
		 * @default 0
		 */
		cooldownDelay?: number;

		/**
		 * The scope of the cooldown entries.
		 * @since 1.1.3
		 * @default BucketScope.User
		 */
		cooldownScope?: BucketScope;

		/**
		 * The users that are exempt from the Cooldown precondition.
		 * Use this to filter out someone like a bot owner
		 * @since 2.0.0
		 * @default undefined
		 */
		cooldownFilteredUsers?: API.Id[];
	};

	/**
	 * Type of channels where the command will be allowed to be executed.
	 * @since 1.1.3
	 */
	runIn?: RunInCommands[];

	/**
	 * Client Permissions
	 * Permissions that the client (bot) needs to execute the action.
	 * @since 1.1.3
	 */
	clientPermissions?: PermissionsResolvable[];

	/**
	 * User Permissions
	 * Permissions that the user (author of message) needs to execute the action.
	 * @since 1.1.3
	 */
	userPermissions?: PermissionsResolvable[];

	/**
	 * The quotes accepted by this command, pass `[]` to disable them.
	 * @since 1.1.4
	 * @default
	 * [
	 *   ['"', '"'], // Double quotes
	 *   ['“', '”'], // Fancy quotes (on iOS)
	 *   ['「', '」'] // Corner brackets (CJK)
	 *   ['«', '»'] // French quotes (guillemets)
	 * ]
	 */
	quotes?: [string, string][];
}

export interface CommandJSON extends AliasPieceJSON {
	description: string | null;
	category: string | null;
	metadata: CommandMetadata;
}

export interface CommandPreAcceptedPayload extends CommandParsePayload {
	command: Command;
	message: Message;
	parameters: string;
}

export interface CommandDeniedPayload extends CommandPreAcceptedPayload {
	error: UserError;
}

export interface CommandAcceptedPayload extends CommandPreAcceptedPayload {
	context: CommandRunContext;
}

export interface CommandErrorPayload {
	command: Command;
	message: Message;
	error: ResultError<unknown>;
}

export interface CommandNameNotFoundPayload {
	message: Message;
	commandName: string;
}

export interface CommandParsePayload {
	message: Message;
	prefix: string;
}

export interface CommandNotFoundPayload extends CommandNameNotFoundPayload {}

export interface CommandContext {
	commandName: string;
	prefix: string;
}

export interface CommandRunContext {
	commandName: string;
	prefix: string;
}

/**
 * The available command pre-conditions.
 * @since 1.0.0
 */
export const enum CommandPreConditions {
	ClientPermissions = 'ClientPermissions',
	Cooldown = 'Cooldown',
	DMChannelOnly = 'DMChannelOnly',
	Enabled = 'Enabled',
	GroupChannelOnly = 'GroupChannelOnly',
	NSFW = 'NSFW',
	ServerOnly = 'ServerOnly',
	TextChannelOnly = 'TextChannelOnly',
	userPermissions = 'UserPermissions'
}
