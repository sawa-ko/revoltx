import { Result } from '@sapphire/result';
import type { Message } from 'revolt.js';
import type { PreconditionContext } from '../../utils/interfaces/precondition';
import type { Command } from '../structures/command';
import type { IPreconditionContainer, PreconditionContainerResult, PreconditionContainerReturn } from './precondition-container';

/**
 * Defines the condition for {@link PreconditionContainerArray}s to run.
 * @since 2.0.2
 */
export interface IPreconditionCondition {
	/**
	 * Runs the containers one by one.
	 * @seealso {@link PreconditionRunMode.sequential}
	 * @since 2.0.2
	 * @param message The message that ran this precondition.
	 * @param command The command the message invoked.
	 * @param entries The containers to run.
	 */
	messageSequential(
		message: Message,
		command: Command,
		entries: readonly IPreconditionContainer[],
		context: PreconditionContext
	): PreconditionContainerReturn;

	/**
	 * Runs all the containers using `Promise.all`, then checks the results once all tasks finished running.
	 * @seealso {@link PreconditionRunMode.parallel}
	 * @since 2.0.2
	 * @param message The message that ran this precondition.
	 * @param command The command the message invoked.
	 * @param entries The containers to run.
	 */
	messageParallel(
		message: Message,
		command: Command,
		entries: readonly IPreconditionContainer[],
		context: PreconditionContext
	): PreconditionContainerReturn;
}

/**
 * An {@link IPreconditionCondition} which runs all containers similarly to doing (V0 && V1 [&& V2 [&& V3 ...]]).
 * @since 2.0.2
 */
export const PreconditionConditionAnd: IPreconditionCondition = {
	async messageSequential(message, command, entries, context) {
		for (const child of entries) {
			const result = await child.run(message, command, context);
			if (result.isErr()) return result;
		}

		return Result.ok();
	},
	async messageParallel(message, command, entries, context) {
		const results = await Promise.all(entries.map((entry) => entry.run(message, command, context)));
		return results.find((res) => res.isErr()) ?? Result.ok();
	}
};

/**
 * An {@link IPreconditionCondition} which runs all containers similarly to doing (V0 || V1 [|| V2 [|| V3 ...]]).
 * @since 1.0.0
 */
export const PreconditionConditionOr: IPreconditionCondition = {
	async messageSequential(message, command, entries, context) {
		let error: PreconditionContainerResult | null = null;
		for (const child of entries) {
			const result = await child.run(message, command, context);
			if (result.isOk()) return result;
			error = result;
		}

		return error ?? Result.ok();
	},
	async messageParallel(message, command, entries, context) {
		const results = await Promise.all(entries.map((entry) => entry.run(message, command, context)));

		let error: PreconditionContainerResult | null = null;
		for (const result of results) {
			if (result.isOk()) return result;
			error = result;
		}

		return error ?? Result.ok();
	}
};
