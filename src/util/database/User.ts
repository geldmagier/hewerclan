import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../";
import { ErrorType } from "./Errors";

export default class User {
	private _id: string;

	constructor(id: string) {
		this._id = id;
	}

	get id(): string {
		return this._id;
	}

	public async get() {
		return await prisma.user.findUnique({
			where: {
				id: this.id,
			},
		});
	}

	public static async getAll() {
		return await prisma.user.findMany();
	}

	public async create() {
		if (await this.get()) return await this.get();

		return await prisma.user.create({
			data: {
				id: this.id,
			},
		});
	}

	public async buy(amount: number) {
		let user = await this.create();

		if (user!.balance < amount) return ErrorType.NOT_ENOUGH_POINTS;

		return await prisma.user.update({
			where: {
				id: this.id,
			},
			data: {
				balance: user!.balance - amount,
			},
		});
	}

	public async add(amount: number) {
		let user = await this.create();

		return await prisma.user.update({
			where: {
				id: this.id,
			},
			data: {
				balance: user!.balance + amount,
			},
		});
	}

	public async subtract(amount: number) {
		let user = await this.create();

		return await prisma.user.update({
			where: {
				id: this.id,
			},
			data: {
				balance: user!.balance - amount,
			},
		});
	}

	public static async getTopTen() {
		return await prisma.user.findMany({
			take: 10,
			orderBy: {
				balance: "desc",
			},
		});
	}

	public static async getTop() {
		return await prisma.user.findMany({
			orderBy: {
				balance: "desc",
			},
		});
	}
}
