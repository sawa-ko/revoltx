import type { PieceContext } from '@sapphire/pieces';

import { Listener } from '../../lib/structures/listener';
import { CommandEvents } from '../../utils/enums/command';
import type { CommandPreRunPayload } from '../../utils/interfaces/command';

export class CoreListener extends Listener {
	public constructor(context: PieceContext) {
		super(context, { event: CommandEvents.CommandPreAccepted });
	}

	public async run(payload: CommandPreRunPayload) {
		const { message, command } = payload;

		const globalResult = await this.container.stores.get('preconditions').run(message, command, payload as any);
		if (!globalResult.success) {
			this.container.client.emit(CommandEvents.CommandDenied, { ...payload, error: globalResult.error });
			return;
		}

		const localResult = await command.preconditions.run(message, command, payload as any);
		if (!localResult.success) {
			this.container.client.emit(CommandEvents.CommandDenied, { ...payload, error: localResult.error });
			return;
		}

		this.container.client.emit(CommandEvents.CommandAccepted, payload);
	}
}
