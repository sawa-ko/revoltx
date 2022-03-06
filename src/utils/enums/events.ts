export enum CoreEvents {
	ListenerError = 'listenerError'
}

export enum ClientEvents {
	CONNECTED = 'connected',
	CONNECTING = 'connecting',
	DROPPED = 'dropped',
	READY = 'ready',
	LOGOUT = 'logout',
	MESSAGE = 'message',
	MESSAGE_CREATE = 'messageCreate',
	MESSAGE_UPDATE = 'messageUpdate',
	MESSAGE_DELETE = 'messageDelete',
	CHANNEL_CREATE = 'channelCreate',
	CHANNEL_UPDATE = 'messageUpdate',
	CHANNEL_DELETE = 'channelDelete',
	SERVER_UPDATE = 'serverUpdate',
	SERVER_DELETE = 'serverDelete',
	SERVER_MEMBER_JOIN = 'serverMemberJoin',
	SERVER_MEMBER_UPDATE = 'serverMemberUpdate',
	SERVER_MEMBER_LEAVE = 'serverMemberLeave',
	ROLE_UPDATE = 'roleUpdate',
	ROLE_DELETE = 'roleDelete',
	USER_RELATIONSHIP = 'userRelationship',
	PACKET = 'packet'
}
