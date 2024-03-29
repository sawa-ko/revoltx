export enum ClientEvents {
	Connected = 'connected',
	Connecting = 'connecting',
	Dropped = 'dropped',
	Ready = 'ready',
	LogOut = 'logout',
	MessageCreate = 'messageCreate',
	MessageUpdate = 'messageUpdate',
	MessageDelete = 'messageDelete',
	ChannelCreate = 'channelCreate',
	ChannelUpdate = 'channelUpdate',
	ChannelDelete = 'channelDelete',
	ServerUpdate = 'serverUpdate',
	ServerDelete = 'serverDelete',
	ServerMemberJoin = 'serverMemberJoin',
	ServerMemberUpdate = 'serverMemberUpdate',
	ServerMemberLeave = 'serverMemberLeave',
	RoleUpdate = 'roleUpdate',
	RoleDelete = 'roleDelete',
	UserRelationship = 'userRelationship',
	Packet = 'packet'
}
