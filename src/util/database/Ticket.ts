import { prisma } from "../..";
import { ErrorType } from "./Errors";

export default class Ticket {
	private _itemId: string;
	private _channelId: string;
	private _userId: string;
	private _ticketId: number;

	constructor(
		itemId: string,
		channelId: string,
		userId: string,
		ticketId: number
	) {
		this._itemId = itemId;
		this._channelId = channelId;
		this._userId = userId;
		this._ticketId = ticketId;
	}

	get itemId(): string {
		return this._itemId;
	}

	get channelId(): string {
		return this._channelId;
	}

	get userId(): string {
		return this._userId;
	}

	get ticketId(): string {
		return this._ticketId.toString();
	}

	public async get() {
		return await prisma.ticket.findFirst({
			where: {
				id: this.ticketId,
				itemId: this.itemId,
				channelId: this.channelId,
				userId: this.userId,
			},
		});
	}

	public async create() {
		return await prisma.ticket.create({
			data: {
				id: this.ticketId,
				itemId: this.itemId,
				channelId: this.channelId,
				userId: this.userId,
			},
		});
	}

	public static async getByChannelId(channelId: string) {
		return await prisma.ticket.findFirst({
			where: {
				channelId: channelId,
			},
		});
	}

	public async close() {
		const ticket = await this.get();
		if (!ticket) return ErrorType.TICKET_NOT_FOUND;

		return await prisma.ticket.update({
			where: {
				id: ticket.id,
			},
			data: {
				closed: true,
			},
		});
	}
}
