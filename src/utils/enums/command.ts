export enum CommandEvents {
	CommandNotFound = 'commandNotFound',
	CommandNameNotFound = 'commandNameNotFound',
	CommandParse = 'commandParse',
	CommandDenied = 'commandDenied',
	CommandAccepted = 'commandAccepted',
	CommandPreParse = 'commandPreParse',
	commandRun = 'commandRun',
	commandSuccess = 'commandSuccess',
	commandError = 'commandError',
	commandFinish = 'commandFinish',
	NonPrefixedCommand = 'nonPrefixedCommand'
}
