import type { PieceContext } from '@sapphire/pieces';

import { Listener } from '../lib/structures/listener';
import { CommandEvents } from '../utils/enums/command';
import type { CommandErrorPayload } from '../utils/interfaces/command';

export class CoreEvent extends Listener {
	public constructor(context: PieceContext) {
		super(context, {
			event: CommandEvents.CommandError
		});
	}

	public run(payload: CommandErrorPayload) {
		const { command, error } = payload;
		throw new Error(`Encountered error on command "${command.name}" at path "${command.location.full}"`, { cause: error as Error });
	}
}
