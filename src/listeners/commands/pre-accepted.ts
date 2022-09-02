import type { PieceContext } from '@sapphire/pieces';

import { Listener } from '../../lib/structures/listener';
import { CommandEvents } from '../../utils/enums/command';
import type { CommandPreAcceptedPayload } from '../../utils/interfaces/command';

export class CoreListener extends Listener {
	public constructor(context: PieceContext) {
		super(context, { event: CommandEvents.CommandPreAccepted });
	}

	public async run(payload: CommandPreAcceptedPayload) {
		const { message, command, prefix } = payload;

		const globalResult = await this.container.stores.get('preconditions').run(message, command, payload as any);
		if (globalResult.isErr()) {
			this.container.client.emit(CommandEvents.CommandDenied, { ...payload, error: globalResult.err().unwrap() });
			return;
		}

		const localResult = await command.preconditions.run(message, command, payload as any);
		if (localResult.isErr()) {
			this.container.client.emit(CommandEvents.CommandDenied, { ...payload, error: localResult.err().unwrap() });
			return;
		}

		this.container.client.emit(CommandEvents.CommandAccepted, payload, { commandName: command.name, prefix });
	}
}
