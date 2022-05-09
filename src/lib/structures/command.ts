import { AliasPiece, PieceContext } from '@sapphire/pieces';
import * as Lexure from 'lexure';
import type { Awaitable } from '@sapphire/utilities';
import type { Message } from 'revolt.js';

import { Args } from '../parsers/args';
import { FlagUnorderedStrategy } from '../../utils/strategies/flag-unordered-strategy';
import { PreconditionContainerArray } from '../preconditions/precondition-container-array';
import { CommandContext, CommandJSON, CommandMetadata, CommandOptions, CommandPreConditions } from '../../utils/interfaces/command';
import { BucketScope } from '../../utils/enums/command';
import type { RunInCommands } from '../../utils/interfaces/precondition';
import type { PermissionsResolvable } from '../utils/permissions';

export abstract class Command<T = Args, O extends CommandOptions = CommandOptions> extends AliasPiece<O> {
	/**
	 * Command description.
	 * @since 1.0.0
	 */
	public description?: string;

	/**
	 * Extra data for the command, such as help, more information, etc. Useful for help commands.
	 * TypeScript users can augment the CommandMetadata interface to add their own data.
	 * @since 1.0.0
	 * @see [TypeScript Augment](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
	 */
	public metadata?: CommandMetadata;

	/**
	 * Command category.
	 * The command category can be used to categorize the commands in a help command, etc.
	 * @since 1.0.0
	 */
	public category: string | null;

	/**
	 * The strategy to use for the lexer.
	 * @since 1.0.0
	 */
	public strategy: Lexure.UnorderedStrategy;

	/**
	 * The preconditions to be run.
	 * @since 1.0.0
	 */
	public preconditions: PreconditionContainerArray;

	/**
	 * Mark commands as NSFW.
	 * @since 1.0.0
	 */
	public nsfw?: boolean;

	/**
	 * Select on which type of channels the command should be executed, e.g. only on servers, only on text channels (TextChannel), etc.
	 * @since 1.1.3
	 */
	public runIn?: RunInCommands[];

	/**
	 * Client Permissions
	 * Permissions that the clientr (bot) needs to execute the action.
	 * @since 1.1.3
	 */
	public clientPermissions?: PermissionsResolvable[];

	/**
	 * User Permissions
	 * Permissions that the user (author of message) needs to execute the action.
	 * @since 1.1.3
	 */
	public userPermissions?: PermissionsResolvable[];

	/**
	 * The lexer to be used for command parsing
	 * @since 1.0.0
	 * @private
	 */
	protected lexer = new Lexure.Lexer();

	public constructor(context: PieceContext, options: CommandOptions) {
		super(context, options);

		this.description = options.description;
		this.metadata = options.metadata;
		this.nsfw = options.nsfw ?? false;
		this.runIn = options.runIn;
		this.clientPermissions = options.clientPermissions;

		this.strategy = new FlagUnorderedStrategy(options);
		this.preconditions = new PreconditionContainerArray(options.preconditions);

		if (options.category) this.category = options.category;
		else this.category = this.location.directories.length > 0 ? this.location.directories[0] : null;

		if (this.nsfw) this.preconditions.append(CommandPreConditions.NSFW);

		const { defaultCooldown } = this.container.client;

		// We will check for whether the command is filtered from the defaults, but we will allow overridden values to
		// be set. If an overridden value is passed, it will have priority. Otherwise it will default to 0 if filtered
		// (causing the precondition to not be registered) or the default value with a fallback to a single-use cooldown.
		const filtered = defaultCooldown?.filteredCommands?.includes(this.name) ?? false;
		const limit = options.cooldown?.cooldownLimit ?? (filtered ? 0 : defaultCooldown?.limit ?? 1);
		const delay = options.cooldown?.cooldownDelay ?? (filtered ? 0 : defaultCooldown?.delay ?? 0);

		if (limit && delay) {
			const scope = options.cooldown?.cooldownScope ?? defaultCooldown?.scope ?? BucketScope.User;
			const filteredUsers = options.cooldown?.cooldownFilteredUsers ?? defaultCooldown?.filteredUsers;
			this.preconditions.append({
				name: CommandPreConditions.Cooldown,
				context: { scope, limit, delay, filteredUsers }
			});
		}

		if (this.runIn && this.runIn.length > 0) {
			if (this.runIn.includes('DMChannel')) this.preconditions.append('DMChannelOnly');
			if (this.runIn.includes('GroupChannel')) this.preconditions.append('GroupChannelOnly');
			if (this.runIn.includes('Server')) this.preconditions.append('ServerOnly');
			if (this.runIn.includes('TextChannel')) this.preconditions.append('TextChannelOnly');
		}

		if (this.clientPermissions) {
			this.preconditions.append({
				name: CommandPreConditions.ClientPermissions,
				context: { permissions: this.clientPermissions ?? [] }
			});
		}

		if (this.userPermissions) {
			this.preconditions.append({
				name: CommandPreConditions.userPermissions,
				context: { permissions: this.userPermissions ?? [] }
			});
		}
	}

	public toJSON(): CommandJSON {
		return {
			...super.toJSON(),
			description: this.description ?? null,
			category: this.description ?? null,
			metadata: this.metadata ?? {}
		};
	}

	/**
	 * Executes the command's logic for a message.
	 * @param message The message that triggered the command.
	 * @param args The value returned by {@link Command.preParse}, by default an instance of {@link Args}.
	 */
	public abstract run(message: Message, args: T, context: CommandContext): Awaitable<unknown>;

	/**
	 * The pre-parse method. This method can be overridden by plugins to define their own argument parser.
	 * @param message The message that triggered the command.
	 * @param parameters The raw parameters as a single string.
	 */
	public preParse(message: Message, parameters: string): Awaitable<T> {
		const parser = new Lexure.Parser(this.lexer.setInput(parameters).lex()).setUnorderedStrategy(this.strategy);
		const args = new Lexure.Args(parser.parse());
		return new Args(message, this as any, args) as any;
	}
}
