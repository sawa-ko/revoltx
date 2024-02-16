import { Store } from '@sapphire/pieces';
import { Result } from '@sapphire/result';
import type { Message } from 'revolt.js';
import type { PreconditionContext } from '../../../utils/interfaces/precondition';
import { Identifiers } from '../../errors/identifiers';
import type { Command } from '../command';
import { Precondition, type AsyncPreconditionResult } from '../precondition';

export class PreconditionStore extends Store<Precondition> {
	private readonly globalPreconditions: Precondition[] = [];

	public constructor() {
		super(Precondition, { name: 'preconditions' });
	}

	public async run(message: Message, command: Command, context: PreconditionContext = {}): AsyncPreconditionResult {
		for (const precondition of this.globalPreconditions) {
			const result = precondition.run
				? await precondition.run(message, command, context)
				: await precondition.error({
						identifier: Identifiers.PreconditionMissingRunHandler,
						message: `The precondition "${precondition.name}" is missing a "messageRun" handler, but it was requested for the "${command.name}" command.`
					});

			if (result.isErr()) {
				return result;
			}
		}

		return Result.ok();
	}

	public override set(key: string, value: Precondition): this {
		if (value.position !== null) {
			const index = this.globalPreconditions.findIndex((precondition) => precondition.position! >= value.position!);

			// If a precondition with lower priority wasn't found, push to the end of the array
			if (index === -1) this.globalPreconditions.push(value);
			else this.globalPreconditions.splice(index, 0, value);
		}

		return super.set(key, value);
	}

	public override delete(key: string): boolean {
		const index = this.globalPreconditions.findIndex((precondition) => precondition.name === key);

		// If the precondition was found, remove it
		if (index !== -1) this.globalPreconditions.splice(index, 1);

		return super.delete(key);
	}

	public override clear(): void {
		this.globalPreconditions.length = 0;
		return super.clear();
	}
}
