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
