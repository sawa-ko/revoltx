import { container } from '@sapphire/pieces';
import { err, ok, Result } from '@sapphire/result';
import type { Message } from 'revolt.js/dist/maps/Messages';

import { IdRegex } from '../../utils/regex';
import { Identifiers } from '../errors/identifiers';

export function resolveMessage(parameter: string): Result<Message, Identifiers.ArgumentMessageError> {
	const messageId = parameter.match(IdRegex);
	if (!messageId) return err(Identifiers.ArgumentMessageError);

	const message = container.client.bot.messages.get(messageId[1]);
	if (!message) return err(Identifiers.ArgumentMessageError);

	return ok(message);
}
