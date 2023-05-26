import { ApplicationCommandOptionType } from "discord.js";
import { Command, CommandObject, CommandType } from "swagcommands";
import Item from "../../util/database/Item";

export default {
	description: "Show a specific Item",
	type: CommandType.SLASH,
	testOnly: true,

	options: [
		{
			name: "name",
			description: "The name of the item",
			type: ApplicationCommandOptionType.String,
			required: true,
			autocomplete: true,
		},
	],

	autocomplete: async (command: Command, arg: string) => {
		if (arg === "name") {
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
		return item.getEmbed();
	},
} as CommandObject;
