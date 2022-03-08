import type { Id } from 'revolt-api/types/_common';
import type { ISettingsParam } from 'tslog';

import type { BucketScope } from '../enums/command';

export interface ClientOptions {
	id?: string;
	prefix: string;
	baseDirectory: string;
	loadDefaultErrorsListeners?: boolean;
	defaultCooldown?: DefaultCooldownOptions;
	logger?: ISettingsParam;
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
	filteredUsers?: Id[];

	/**
	 * The comamnds that are exempt from the Cooldown precondition.
	 * Use this to filter owner commands for example.
	 * @since 1.1.3
	 * @default undefined
	 */
	filteredCommands?: string[];
}

export interface LoggerManagerI {
	silly(message: string, prefix?: string): void;
	trace(message: string, prefix?: string): void;
	debug(message: string, prefix?: string): void;
	info(message: string): void;
	warn(message: string, prefix?: string): void;
	error(message: string, prefix?: string): void;
	fatal(message: string, prefix?: string): void;
}

export enum LogLevels {
	Silly,
	Trace,
	Debug,
	Info,
	Warn,
	Error,
	Fatal
}
