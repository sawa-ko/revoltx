import type { Awaitable } from '@sapphire/utilities';
import type { API, Message } from 'revolt.js';
import type { ISettingsParam } from 'tslog';
import type { ILogObj } from 'tslog/dist/types/interfaces';

import type { HMROptions } from '../../lib/utils/hmr';
import type { BucketScope } from '../enums/command';

export interface ClientOptions {
	/**
	 * Client Id
	 * @since 1.3.0
	 */
	id?: string;

	/**
	 * The default prefix, in case of `null`, only mention prefix will trigger the bot's commands.
	 * @since 1.3.0
	 */
	defaultPrefix: string;

	/**
	 * Path where all commands, listeners, arguments, etc. are located.
	 * @since 1.0.0
	 */
	baseUserDirectory?: string;

	/**
	 * If Client should load the pre-included error event listeners that log any encountered errors to the {@link Client.logger} instance
	 * @since 1.3.0
	 * @default true
	 */
	loadDefaultErrorsListeners?: boolean;

	/**
	 * Sets the default cooldown time for all commands.
	 * @default "No cooldown options"
	 */
	defaultCooldown?: DefaultCooldownOptions;

	/**
	 * The logger options
	 * @since 1.3.0
	 */
	logger?: ISettingsParam<ILogObj>;

	/**
	 * The prefix hook, by default it is a callback function that returns {@link ClientOptions.defaultPrefix}.
	 * @since 1.3.0
	 * @default () => client.options.defaultPrefix
	 */
	fetchPrefix?: ClientPrefixHook;

	/**
	 * HMR options
	 * @since 1.3.0
	 * @default null (disabled)
	 */
	hmr?: HMROptions;
}

export interface MemberCompositeKey {
	server: string;
	user: string;
}

export interface DefaultCooldownOptions {
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
	 * Use this to filter owner users for example.
	 * @since 1.1.3
	 * @default undefined
	 */
	filteredUsers?: API.Id[];

	/**
	 * The comamnds that are exempt from the Cooldown precondition.
	 * Use this to filter owner commands for example.
	 * @since 1.1.3
	 * @default undefined
	 */
	filteredCommands?: string[];
}

/**
 * A valid prefix in Client.
 * * `string`: a single prefix, e.g. `'!'`.
 * * `string[]`: an array of prefixes, e.g. `['!', '.']`.
 * * `null`: disabled prefix, locks the bot's command usage to mentions only.
 */
export type ClientPrefix = string | readonly string[] | null;

export interface ClientPrefixHook {
	(message: Message): Awaitable<ClientPrefix>;
}
