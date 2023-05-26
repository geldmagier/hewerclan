import { prisma } from "../..";
import Item from "./Item";

export default class Raffle {
	private _item: Item;
	private _id: string | undefined;
	constructor(item: Item, id?: string) {
		this._item = item;
		this._id = id;
	}

	public get item() {
		return this._item;
	}

	public async getItem() {
		return await this.item.get();
	}

	public async getByItem() {
		const itemData = await this.item.get();
		return await prisma.raffle.findFirst({
			where: {
				itemId: itemData?.id,
			},
		});
	}

	public async create(m: number) {
		// the time in m minutes
		const endingTime = new Date();
		endingTime.setMinutes(endingTime.getMinutes() + m);

		// raffle ends the same day at 23:59:59
		const newRaffle = await prisma.raffle.create({
			data: {
				item: {
					connect: {
						id: (await this.item.get())?.id,
					},
				},
				endingAt: endingTime,
			},
		});

		this._id = newRaffle.id;

		return newRaffle;
	}

	public async getRaffle(minutes?: number) {
		const raffle = await this.get();
		if (raffle) return false;
	}

	public async get() {
		return await prisma.raffle.findFirst({
			where: {
				id: this._id,
			},
		});
	}

	public static async getAll() {
		return await prisma.raffle.findMany();
	}

	public async getEntries() {
		return await prisma.entry.findMany({
			where: {
				raffleId: this._id,
			},
		});
	}

	public async delete() {
		const raffle = await this.get();
		if (!raffle) return false;
		return await prisma.raffle.deleteMany({
			where: {
				id: raffle.id,
			},
		});
	}
}
