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
		const { command, message } = payload;
		const result = await fromAsync(async () => {
			this.container.client.emit(CommandEvents.commandRun, { command, message });
			await command.run(message);
			this.container.client.emit(CommandEvents.commandSuccess, { command, message });
		});

		if (isErr(result)) {
			return this.container.client.emit(CommandEvents.commandError, { command, message, error: result.error });
		}

		return this.container.client.emit(CommandEvents.commandFinish, { command, message });
	}
}
