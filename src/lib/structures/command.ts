import { AliasPiece, PieceContext } from '@sapphire/pieces';
import * as Lexure from 'lexure';
import type { Awaitable } from '@sapphire/utilities';
import type { Message } from 'revolt.js/dist/maps/Messages';

import { Args } from '../parsers/args';
import { FlagUnorderedStrategy } from '../../utils/strategies/flag-unordered-strategy';
import { PreconditionContainerArray } from '../preconditions/precondition-container-array';
import { CommandJSON, CommandMetadata, CommandOptions, CommandPreConditions } from '../../utils/interfaces/command';

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

		this.strategy = new FlagUnorderedStrategy(options);
		this.preconditions = new PreconditionContainerArray(options.preconditions);

		if (options.category) this.category = options.category;
		else this.category = this.location.directories.length > 0 ? this.location.directories[0] : null;

		if (this.nsfw) this.preconditions.append(CommandPreConditions.NSFW);
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
	public abstract run(message: Message, args: T): Awaitable<unknown>;

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
