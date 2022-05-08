import { container } from '@sapphire/pieces';
import { err, ok, Result } from '@sapphire/result';
import type { User } from 'revolt.js';

import { UserMentionIdRegex } from '../../utils/regex';
import { Identifiers } from '../errors/identifiers';

export async function resolveUser(parameter: string): Promise<Result<User, Identifiers.ArgumentUserError>> {
	const userId = parameter.match(UserMentionIdRegex);
	if (!userId) return err(Identifiers.ArgumentUserError);

	const user = container.client.x.users.get(userId[1]) ?? (await container.client.x.users.fetch(userId[1]).catch(() => null));
	if (!user) return err(Identifiers.ArgumentUserError);

	return ok(user);
}
