export * from './lib/client';
export * from './lib/parsers/args';
export * from './lib/preconditions/conditions';
export * from './lib/preconditions/precondition-container';
export * from './lib/preconditions/precondition-container-array';
export * from './lib/preconditions/precondition-container-single';
export * from './lib/permissions';

export * from './utils/enums/events';
export * from './utils/enums/command';
export * from './utils/interfaces/client';
export * from './utils/interfaces/command';
export * from './utils/interfaces/argument';
export * from './utils/interfaces/precondition';

export * from './lib/structures/command';
export * from './lib/structures/listener';
export * from './lib/structures/argument';
export * from './lib/structures/precondition';

export * from './lib/resolvers/boolean';
export * from './lib/resolvers/channel';
export * from './lib/resolvers/dm-channel';
export * from './lib/resolvers/enum';
export * from './lib/resolvers/float';
export * from './lib/resolvers/group-channel';
export * from './lib/resolvers/guild-channel';
export * from './lib/resolvers/guild-text-channel';
export * from './lib/resolvers/guild-voice-channel';
export * from './lib/resolvers/hyperlink';
export * from './lib/resolvers/integer';
export * from './lib/resolvers/member';
export * from './lib/resolvers/message';
export * from './lib/resolvers/number';
export * from './lib/resolvers/saved-messages-channel';
export * from './lib/resolvers/string';
export * from './lib/resolvers/user';

export { container } from '@sapphire/pieces';

/**
 * Revoltx version
 */
// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const version: string = '[VI]{version}[/VI]';
