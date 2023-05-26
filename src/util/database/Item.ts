import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} from "discord.js";
import { prisma } from "../..";
import Messages from "../config/Messages";
import Raffle from "./Raffle";
import Ticket from "./Ticket";

export default class Item {
	private _name: string;
	private _price: number;
	private _imageUrl: string;

	constructor(name: string, price?: number, imageUrl?: string) {
		this._name = name;
		this._price = price || 0;
		this._imageUrl = imageUrl || "";
	}

	get name(): string {
		return this._name;
	}

	get price(): number {
		return this._price;
	}

	get imageUrl(): string {
		return this._imageUrl;
	}

	public static async getAll() {
		return await prisma.item.findMany();
	}

	public async get() {
		return await prisma.item.findFirst({
			where: {
				name: this.name,
			},
		});
	}

	public async create() {
		if (await this.get()) return false;
		return await prisma.item.create({
			data: {
				name: this.name,
				price: this.price,
				imageUrl: this.imageUrl,
			},
		});
	}

	public static async getById(id: string) {
		return await prisma.item.findUnique({
			where: {
				id: id,
			},
		});
	}

	public async getEmbed() {
		const item = await this.get();
		if (!item) return null;

		const raffle = new Raffle(this);
		const raffleData = await raffle.get();

		let countdown = "";

		if (!raffleData)
			countdown = "No raffle is currently running for this item.";
		else
			countdown = `Raffle ends <t:${Math.floor(
				new Date(raffleData.endingAt).getTime() / 1000
			)}:R>`;

		const embed = new EmbedBuilder()
			.setTitle(Messages.ITEM_EMBED_TITLE(item.name))
			.setDescription(
				Messages.ITEM_EMBED_DESCRIPTION(item.name, item.price) +
					"\n\n" +
					countdown
			)
			.setColor("#E8BCCA")
			.setImage(item.imageUrl);

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Primary)
				.setCustomId("item-" + item.id)
				.setLabel(item.name)
		);

		return {
			embeds: [embed],
			components: [row],
		};
	}

	public async getString() {
		const item = await this.get();
		if (!item) return null;

		return `- **${item.name}** - \`${item.price} ${Messages.CURRENCY}\``;
	}

	public async getButton() {
		const item = await this.get();
		if (!item) return null;

		return new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Primary)
				.setCustomId("shop-" + item.id)
				.setLabel(item.name)
		);
	}

	public async delete() {
		const item = await this.get();
		if (!item) return null;
		const raffle = new Raffle(this);
		const raffleData = await raffle.get();

		if (raffleData) {
			await prisma.entry.deleteMany({
				where: {
					raffleId: raffleData?.id,
				},
			});

			await raffle.delete();
		}

		await prisma.ticket.deleteMany({
			where: {
				itemId: item.id,
			},
		});

		return await prisma.item.delete({
			where: {
				id: item?.id,
			},
		});
	}
}
