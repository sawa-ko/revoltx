import { err, ok, Result } from '@sapphire/result';
import type { Member, Message } from 'revolt.js';

import { UserMentionIdRegex } from '../../utils/regex';
import { Identifiers } from '../errors/identifiers';

export async function resolveMember(parameter: string, message: Message): Promise<Result<Member, Identifiers.ArgumentUserError>> {
	const memberId = parameter.match(UserMentionIdRegex);
	if (!memberId) return err(Identifiers.ArgumentUserError);

	const member = await message.member?.server?.fetchMember(memberId[1]).catch(() => null);
	if (!member) return err(Identifiers.ArgumentUserError);

	return ok(member as Member);
}
