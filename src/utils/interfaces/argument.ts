import type { AliasPieceOptions } from '@sapphire/pieces';
import type { Maybe } from '@sapphire/result';
import type { Message } from 'revolt.js/dist/maps/Messages';

import type { Args } from '../../lib/parsers/args';
import type { IArgument } from '../../lib/structures/argument';
import type { Command } from '../../lib/structures/command';

export interface ArgumentOptions extends AliasPieceOptions {}

export interface ArgumentContext<T = unknown> extends Record<PropertyKey, unknown> {
	argument: IArgument<T>;
	args: Args;
	message: Message;
	command: Command;
	minimum?: number;
	maximum?: number;
	inclusive?: boolean;
}

export interface ArgType {
	boolean: boolean;
	enum: string;
	float: number;
	hyperlink: URL;
	integer: number;
	number: number;
	string: string;
}

export interface ArgOptions extends Omit<ArgumentContext, 'message' | 'command'> {}

export interface RepeatArgOptions extends ArgOptions {
	/**
	 * The maximum amount of times the argument can be repeated.
	 * @default Infinity
	 */
	times?: number;
}

/**
 * The callback used for {@link Args.nextMaybe} and {@link Args.next}.
 */
export interface ArgsNextCallback<T> {
	/**
	 * The value to be mapped.
	 */
	(value: string): Maybe<T>;
}
