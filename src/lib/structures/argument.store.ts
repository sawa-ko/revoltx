import { AliasStore } from '@sapphire/pieces';
import { Argument } from './argument';

export class ArgumentStore extends AliasStore<Argument> {
	public constructor() {
		super(Argument as any, { name: 'arguments' });
	}
}
