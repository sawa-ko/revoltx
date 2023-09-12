import { type Message, calculatePermission } from 'revolt.js';
import type { PieceContext } from '@sapphire/pieces';

import { Precondition } from '../lib/structures/precondition';
import { PermissionsManager } from '../lib/utils/permissions';
import { Identifiers } from '../lib/errors/identifiers';
import type { Command } from '../lib/structures/command';
import type { PermissionsContext } from '../utils/interfaces/precondition';

export class CorePrecondition extends Precondition {
	public constructor(context: PieceContext) {
		super(context, { name: 'UserPermissions' });
	}

	public run(message: Message, _: Command, context: PermissionsContext) {
		const permissions = new PermissionsManager();
		if (context.permissions.length > 0 && message.channel) {
			permissions.add(calculatePermission(message.channel, { member: message.member }));
		}

		const missingPermissions = context.permissions.filter((p) => !permissions.has(p));
		const errorMessage = ['You are missing the following permissions to run this command:'];
		if (missingPermissions.length > 0) errorMessage.push(missingPermissions.join(', '));

		return missingPermissions.length === 0
			? this.ok()
			: this.error({
					context: { missing: missingPermissions },
					identifier: Identifiers.PreconditionClientPermissions,
					message: errorMessage.join('\n')
			  });
	}
}
