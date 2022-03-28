import type { API } from 'revolt.js';

/**
 * Saved Messages channel has only one participant, the user who created it.
 */
export interface SavedMessagesChannel {
	/**
	 * Channel Id
	 */
	_id: API.Id;

	channel_type: 'SavedMessages';

	/**
	 * User Id
	 */
	user: string;
}

export interface DirectMessageChannel {
	/**
	 * Channel Id
	 */
	_id: API.Id;

	channel_type: 'DirectMessage';

	/**
	 * Whether this DM is active
	 */
	active: boolean;

	/**
	 * List of user IDs who are participating in this DM
	 */
	recipients: string[];

	/**
	 * Id of the last message in this channel
	 */
	last_message_id?: string;
}

export interface GroupChannel {
	/**
	 * Channel Id
	 */
	_id: API.Id;

	channel_type: 'Group';

	/**
	 * List of user IDs who are participating in this group
	 */
	recipients: string[];

	/**
	 * Group name
	 */
	name: string;

	/**
	 * User ID of group owner
	 */
	owner: string;

	/**
	 * Group description
	 */
	description?: string;

	/**
	 * Id of the last message in this channel
	 */
	last_message_id?: string;

	/**
	 * Group icon
	 */
	icon?: API.Attachment;

	/**
	 * Permissions given to group members
	 */
	permissions?: number;

	/**
	 * Whether this channel is marked as not safe for work
	 */
	nsfw?: boolean;
}

export interface ServerChannel {
	/**
	 * Channel Id
	 */
	_id: API.Id;

	/**
	 * Server Id
	 */
	server: string;

	/**
	 * Channel name
	 */
	name: string;

	/**
	 * Channel description
	 */
	description?: string;

	icon?: API.Attachment;

	/**
	 * Permissions given to all users
	 */
	default_permissions?: number;

	/**
	 * Permissions given to roles
	 */
	role_permissions?: {
		[key: string]: number;
	};

	/**
	 * Whether this channel is marked as not safe for work
	 */
	nsfw?: boolean;
}

export type TextChannel = ServerChannel & {
	channel_type: 'TextChannel';

	/**
	 * Id of the last message in this channel
	 */
	last_message_id?: string;
};

export type VoiceChannel = ServerChannel & {
	channel_type: 'VoiceChannel';
};

export type ChannelTypes = SavedMessagesChannel | DirectMessageChannel | GroupChannel | TextChannel | VoiceChannel;
