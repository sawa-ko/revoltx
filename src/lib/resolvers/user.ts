import { container } from '@sapphire/pieces';
import { err, ok, Result } from '@sapphire/result';
import type { User } from 'revolt.js/dist/maps/Users';

import { UserMentionIdRegex } from '../../utils/regex';
import { Identifiers } from '../errors/identifiers';

export async function resolveUser(parameter: string): Promise<Result<User, Identifiers.ArgumentUserError>> {
	const userId = parameter.match(UserMentionIdRegex);
	if (!userId) return err(Identifiers.ArgumentUserError);

	const user = container.client.bot.users.get(userId[1]) ?? (await container.client.bot.users.fetch(userId[1]));
	if (!user) return err(Identifiers.ArgumentUserError);

	return ok(user);
}
