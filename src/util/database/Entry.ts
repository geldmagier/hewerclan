import { prisma } from "../..";

export default class {
	private _userId: string;
	private _raffleId: string;

	constructor(userId: string, raffleId: string) {
		this._userId = userId;
		this._raffleId = raffleId;
	}

	public async create() {
		const entry = await this.get();
		if (entry) return entry;
		return await prisma.entry.create({
			data: {
				user: {
					connect: {
						id: this._userId,
					},
				},
				raffle: {
					connect: {
						id: this._raffleId,
					},
				},
			},
		});
	}

	public async get() {
		return await prisma.entry.findFirst({
			where: {
				userId: this._userId,
				raffleId: this._raffleId,
			},
		});
	}

	public async addEntry() {
		const entry = await this.get();
		if (!entry) return false;
		return await prisma.entry.update({
			where: {
				id: entry.id,
			},
			data: {
				entries: entry.entries + 1,
			},
		});
	}

	public static async getAll() {
		return await prisma.entry.findMany();
	}
}
