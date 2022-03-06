import type { AliasPieceJSON, PieceOptions } from '@sapphire/pieces';
import type { NonNullObject } from '@sapphire/utilities';
import type { Message } from 'revolt.js/dist/maps/Messages';
import type { Command } from '../../lib/structures/command';

export interface CommandMetadata extends NonNullObject {}

export interface CommandOptions extends PieceOptions {
	/**
	 * Command description.
	 * @since 1.0.0
	 */
	description: string;

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
}

export interface CommandJSON extends AliasPieceJSON {
	description: string;
	category: string | null;
	metadata: CommandMetadata;
}

export interface CommandAcceptedPayload {
	command: Command;
	message: Message;
}
