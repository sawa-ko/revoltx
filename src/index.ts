export * from './lib/client';
export * from './lib/parsers/args';

export * from './utils/enums/events';
export * from './utils/enums/command';
export * from './utils/interfaces/client';
export * from './utils/interfaces/command';
export * from './utils/interfaces/argument';

export * from './lib/structures/command';
export * from './lib/structures/listener';
export * from './lib/structures/argument';

export { container } from '@sapphire/pieces';

/**
 * Revoltx version
 *
 * Revoltx is a framework for revolt.js inspired by the framework [@sapphire/framework](https://github.com/sapphiredev/framework).
 */
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const version: string = '[VI]{version}[/VI]';
