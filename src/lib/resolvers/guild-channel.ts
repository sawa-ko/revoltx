import { container } from '@sapphire/pieces';
import { err, ok, Result } from '@sapphire/result';
import type { Channel, Message } from 'revolt.js';

import { ChannelMentionIdRegex } from '../../utils/regex';
import { Identifiers } from '../errors/identifiers';

export function resolveGuildChannel(parameter: string, message: Message): Result<Channel, Identifiers.ArgumentChannelError> {
	const channelId = parameter.match(ChannelMentionIdRegex);
	if (!channelId) return err(Identifiers.ArgumentChannelError);

	const channel = container.client.bot.channels.get(channelId[1]);
	if (!channel || channel.server_id !== message.member?.server?._id) return err(Identifiers.ArgumentChannelError);

	return ok(channel);
}
