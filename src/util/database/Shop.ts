import {
	ActionRowBuilder,
	Client,
	ColorResolvable,
	EmbedBuilder,
} from "discord.js";
import { prisma } from "../..";
import Messages from "../config/Messages";
import Item from "./Item";

export default class Shop {
	private _client: Client;

	constructor(client: Client) {
		this._client = client;
	}

	get client(): Client {
		return this._client;
	}

	public async getItems() {
		const items = await prisma.item.findMany({
			orderBy: {
				price: "asc",
			},
		});

		const list: Item[] = [];
		for (const item of items) {
			list.push(new Item(item.name, item.price, item.imageUrl));
		}

		return list;
	}

	public async getEmbed() {
		const items = await this.getItems();
		let itemListString = "";

		for (const item of items) {
			itemListString += ((await item.getString()) as string) + "\n";
		}

		const guild = await this.client.guilds.cache.get(process.env.SERVER_ID!);

		const embed = new EmbedBuilder()
			.setTitle(Messages.SHOP_EMBED_TITLE)
			.setDescription(Messages.SHOP_EMBED_DESCRIPTION + "\n\n" + itemListString)
			.setColor(Messages.SHOP_COLOR as ColorResolvable)
			.setImage(Messages.SHOP_IMAGE!)
			.setAuthor({
				name: guild?.name!,
				iconURL: guild?.iconURL()!,
			});

		const buttons: any[] = [];
		for (const item of items) {
			buttons.push(await item.getButton());
		}

		// die buttons in 5er gruppen aufteilen, damit sie nebeneinander angezeigt werden, und discord nicht meckert
		// hilfe das ist selbst mir zu kompliziert, ich weiß nicht mehr was ich hier mache. hilfe.
		const result = [...chunks(buttons, 5)];
		result.forEach((row) => {
			const mainRow = row[0];
			const otherRows = row.slice(1);
			const otherButtons = otherRows.map((row) => row.components[0]);
			mainRow.addComponents(otherButtons);

			//
			row.splice(1);
		});

		return {
			embeds: [embed],
			components: result.map((row) => {
				return {
					type: 1,
					components: row[0].components,
				};
			}),
		};
	}
}

function* chunks(array: any[], n: number) {
	// array in n große chunks aufteilen
	for (let i = 0; i < array.length; i += n) yield array.slice(i, i + n);
}
