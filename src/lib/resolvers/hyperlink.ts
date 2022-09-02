import { err, Result } from '@sapphire/result';
import { URL } from 'url';
import { Identifiers } from '../errors/identifiers';

export function resolveHyperlink(parameter: string): Result<URL, Identifiers.ArgumentHyperlinkError> {
	const result = Result.from(() => new URL(parameter));
	return result.isOk() ? result : err(Identifiers.ArgumentHyperlinkError);
}
