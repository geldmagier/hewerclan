import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { Command, CommandObject, CommandType } from "swagcommands";
import { prisma } from "../..";
import Item from "../../util/database/Item";
import Raffle from "../../util/database/Raffle";

export default {
	description: "Remove an Item from the shop",
	type: CommandType.SLASH,
	testOnly: true,
	guildOnly: true,

	permissions: [PermissionFlagsBits.Administrator],

	options: [
		{
			name: "item",
			description: "The item to remove",
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
		},
	],

	autocomplete: async (command: Command, arg: string) => {
		if (arg === "item") {
			const items = await Item.getAll();
			const names = items.map((item) => item.name);
			return names;
		}
	},

	callback: async ({ interaction, args, client }) => {
		const item = new Item(args[0]);
		const itemData = await item.get();

		if (!itemData)
			return {
				content: `Item \`${args[0]}\` not found.`,
				ephemeral: true,
			};

		try {
			const deleted = await item.delete();

			if (!deleted)
				return {
					content: `An error occured while deleting the item \`${args[0]}\``,
					ephemeral: true,
				};

			return {
				content: `Item \`${args[0]}\` deleted!`,
				ephemeral: true,
			};
		} catch (err) {
			console.log(err);
			return {
				content: `An error occured while deleting the item \`${args[0]}\``,
				ephemeral: true,
			};
		}
	},
} as CommandObject;
