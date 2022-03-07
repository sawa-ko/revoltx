import { err, ok, Result } from '@sapphire/result';
import type { Member } from 'revolt-api/types/Servers';
import type { Message } from 'revolt.js/dist/maps/Messages';

import { UserMentionIdRegex } from '../../utils/regex';
import { Identifiers } from '../errors/identifiers';

export async function resolveMember(parameter: string, message: Message): Promise<Result<Member, Identifiers.ArgumentUserError>> {
	const memberId = parameter.match(UserMentionIdRegex);
	if (!memberId) return err(Identifiers.ArgumentUserError);

	const member = await message.member?.server?.fetchMember(memberId[1]);
	if (!member) return err(Identifiers.ArgumentUserError);

	return ok(member as Member);
}
