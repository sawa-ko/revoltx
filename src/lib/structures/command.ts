import { AliasPiece, PieceContext } from '@sapphire/pieces';
import type { Awaitable } from '@sapphire/utilities';
import type { Message } from 'revolt.js/dist/maps/Messages';
import type { CommandJSON, CommandMetadata, CommandOptions } from '../../utils/interfaces/command';

export abstract class Command extends AliasPiece {
	/**
	 * Command description.
	 * @since 1.0.0
	 */
	public description: string;

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
	public category?: string;

	public constructor(context: PieceContext, options: CommandOptions) {
		super(context, options);

		this.description ??= options.description;
		this.metadata ??= options.metadata;
		this.category ??= options.category;
	}

	public toJSON(): CommandJSON {
		return {
			...super.toJSON(),
			description: this.description,
			category: this.description ?? null,
			metadata: this.metadata ?? {}
		};
	}

	/**
	 * Executes the command's logic for a message.
	 * @param message The message that triggered the command.
	 */
	public abstract run(message: Message): Awaitable<unknown>;
}
