import { ApplicationCommandOptionType } from "discord.js";
import { CommandObject, CommandType } from "swagcommands";
import Item from "../../util/database/Item";

export default {
	description: "Add an Item to the shop",
	type: CommandType.SLASH,
	testOnly: true,

	options: [
		{
			name: "name",
			description: "The name of the item",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "price",
			description: "The price of the item",
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
		{
			name: "image",
			description: "The image of the item",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
	],

	callback: async ({ interaction, args, client }) => {
		const name = args[0];
		const price = args[1];
		const image = args[2];

		const item = new Item(name, parseInt(price), image);
		const created = await item.create();
		if (!created)
			return {
				content: `An item with the name \`${name}\` already exists!`,
				ephemeral: true,
			};

		const embed = await item.getEmbed();
		embed?.embeds[0].setTitle(`Item \`${name}\` created!`);
		return {
			embeds: [embed?.embeds[0]],
			ephemeral: true,
		};
	},
} as CommandObject;
