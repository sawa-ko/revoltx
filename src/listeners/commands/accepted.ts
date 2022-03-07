import type { PieceContext } from '@sapphire/pieces';
import { fromAsync, isErr } from '@sapphire/result';

import { Listener } from '../../lib/structures/listener';
import { CommandEvents } from '../../utils/enums/command';
import type { CommandAcceptedPayload } from '../../utils/interfaces/command';

export class CoreListener extends Listener {
	public constructor(context: PieceContext) {
		super(context, {
			event: CommandEvents.CommandAccepted
		});
	}

	public async run(payload: CommandAcceptedPayload) {
		const { command, message, parameters } = payload;
		const args = await command.preParse(message, parameters);
		const result = await fromAsync(async () => {
			this.container.client.emit(CommandEvents.CommandRun, { command, message });
			await command.run(message, args);
			this.container.client.emit(CommandEvents.CommandSuccess, { command, message });
		});

		if (isErr(result)) {
			return this.container.client.emit(CommandEvents.CommandError, { command, message, error: result.error });
		}

		return this.container.client.emit(CommandEvents.CommandFinish, { command, message });
	}
}
