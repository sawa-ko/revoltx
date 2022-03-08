export enum CommandEvents {
	CommandNotFound = 'commandNotFound',
	CommandNameNotFound = 'commandNameNotFound',
	CommandParse = 'commandParse',
	CommandDenied = 'commandDenied',
	CommandAccepted = 'commandAccepted',
	CommandPreParse = 'commandPreParse',
	CommandRun = 'commandRun',
	CommandSuccess = 'commandSuccess',
	CommandError = 'commandError',
	CommandFinish = 'commandFinish',
	CommandPreAccepted = 'commandPreAccepted',
	NonPrefixedCommand = 'nonPrefixedCommand'
}

/**
 * The scope the cooldown applies to.
 */
export const enum BucketScope {
	/**
	 * Per channel cooldowns.
	 */
	Channel,
	/**
	 * Global cooldowns.
	 */
	Global,
	/**
	 * Per guild cooldowns.
	 */
	Guild,
	/**
	 * Per user cooldowns.
	 */
	User
}
