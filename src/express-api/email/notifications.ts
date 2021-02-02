import { resolveSubsocialApi } from '../../connections/subsocial';
import messages from './emailMessages';
import { getAccountContent, createHrefForPost, createHrefForAccount, createHrefForSpace, getFormatDate } from './utils';
import { EventsName } from '@subsocial/types';
import { Activity } from '../telegramWS';
import { PostId, SpaceId } from '@subsocial/types/substrate/interfaces';
import { NotificationTemplateProp } from './types';

export const createNotifsEmailMessage = async (activity: Activity): Promise<NotificationTemplateProp> => {
	const { account, event, space_id, post_id, date, following_id, comment_id } = activity
	const eventName = event as EventsName

	const msg = messages.notifications[activity.event as EventsName]

	switch (eventName) {
		case 'AccountFollowed': return getAccountPreview(account, following_id, msg, date)
		case 'SpaceFollowed': return getSpacePreview(account, space_id, msg, date)
		case 'SpaceCreated': return getSpacePreview(account, space_id, msg, date)
		case 'CommentCreated': return getCommentPreview(account, comment_id, msg, date)
		case 'CommentReplyCreated': return getCommentPreview(account, comment_id, msg, date)
		case 'PostShared': return getPostPreview(account, post_id, msg, date)
		case 'CommentShared': return getCommentPreview(account, comment_id, msg, date)
		case 'PostReactionCreated': return getPostPreview(account, post_id, msg, date)
		case 'CommentReactionCreated': return getCommentPreview(account, comment_id, msg, date)
		case 'PostCreated': return getPostPreview(account, post_id, msg, date)
		default: return undefined
	}
}

const getAccountPreview = async (account: string, following_id: string, message: string, date: string): Promise<NotificationTemplateProp> => {
	const actionDate = getFormatDate(date)

	const { name: followingName, avatar } = await getAccountContent(following_id)
	const followingUrl = createHrefForAccount(following_id)

	const { name: accountName } = await getAccountContent(account)
	const accountUrl = createHrefForAccount(account)

	return {
		date: actionDate,
		performerAccountUrl: followingUrl,
		performerAccountName: followingName,
		avatar,
		message,
		relatedEntityUrl: accountUrl,
		relatedEntityName: accountName
	}
}

const getSpacePreview = async (account: string, spaceId: string, message: string, date: string): Promise<NotificationTemplateProp | undefined> => {
	const subsocial = await resolveSubsocialApi()

	const actionDate = getFormatDate(date)

	const space = await subsocial.findSpace({ id: spaceId as unknown as SpaceId })
	const content = space.content.name

	const { name: accountName, avatar } = await getAccountContent(account)
	const accountUrl = createHrefForAccount(account)

	const spaceUrl = createHrefForSpace(spaceId.toString())

	return {
		date: actionDate,
		performerAccountUrl: accountUrl,
		performerAccountName: accountName,
		avatar,
		message,
		relatedEntityUrl: spaceUrl,
		relatedEntityName: content
	}

}

const getCommentPreview = async (account: string, commentId: string, message: string, date: string): Promise<NotificationTemplateProp | undefined> => {
	const subsocial = await resolveSubsocialApi()
	const actionDate = getFormatDate(date)

	const postDetails = await subsocial.findPostWithSomeDetails({ id: commentId as unknown as PostId, withSpace: true })
	const postId = postDetails.post.struct.id
	const spaceId = postDetails.space.struct.id
	const content = postDetails.ext.post.content.body

	const { name: accountName, avatar } = await getAccountContent(account)

	const postUrl = createHrefForPost(spaceId.toString(), postId.toString())
	const accountUrl = createHrefForAccount(account)

	return {
		date: actionDate,
		performerAccountUrl: accountUrl,
		performerAccountName: accountName,
		avatar,
		message,
		relatedEntityUrl: postUrl,
		relatedEntityName: content
	}

}

const getPostPreview = async (account: string, postId: string, message: string, date: string): Promise<NotificationTemplateProp | undefined> => {
	const subsocial = await resolveSubsocialApi()

	const actionDate = getFormatDate(date)

	const post = await subsocial.findPost({ id: postId as unknown as PostId })
	const spaceId = post.struct.space_id
	const content = post.content.body

	const { name: accountName, avatar } = await getAccountContent(account)

	const postUrl = createHrefForPost(spaceId.toString(), postId.toString())
	const accountUrl = createHrefForAccount(account)

	return {
		date: actionDate,
		performerAccountUrl: accountUrl,
		performerAccountName: accountName,
		avatar,
		message,
		relatedEntityUrl: postUrl,
		relatedEntityName: content
	}
}

