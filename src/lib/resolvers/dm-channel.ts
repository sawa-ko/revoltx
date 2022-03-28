import { container } from '@sapphire/pieces';
import { err, ok, Result } from '@sapphire/result';
import type { Channel } from 'revolt.js';

import { ChannelMentionIdRegex } from '../../utils/regex';
import { Identifiers } from '../errors/identifiers';

export function resolveDMChannel(parameter: string): Result<Channel, Identifiers.ArgumentChannelError> {
	const channelId = parameter.match(ChannelMentionIdRegex);
	if (!channelId) return err(Identifiers.ArgumentChannelError);

	const channel = container.client.bot.channels.get(channelId[1]);
	if (!channel || channel.channel_type !== 'DirectMessage') return err(Identifiers.ArgumentChannelError);

	return ok(channel);
}
