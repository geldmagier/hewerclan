import {
	ApplicationCommandOptionType,
	EmbedBuilder,
	PermissionFlagsBits,
} from "discord.js";
import { Command, CommandObject, CommandType } from "swagcommands";
import Item from "../../util/database/Item";
import Raffle from "../../util/database/Raffle";

export default {
	description: "Manage the raffles",
	type: CommandType.SLASH,
	testOnly: true,
	guildOnly: true,

	permissions: [PermissionFlagsBits.Administrator],

	options: [
		{
			name: "start",
			description: "Start a raffle",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "item",
					description: "The item to raffle",
					type: ApplicationCommandOptionType.String,
					required: true,
					autocomplete: true,
				},
				{
					name: "duration",
					description: "The duration of the raffle (in minutes)",
					type: ApplicationCommandOptionType.Integer,
					required: true,
				},
			],
		},
	],

	autocomplete: async (command: Command, arg: string) => {
		if (arg === "item") {
			const items = await Item.getAll();
			return items.map((item) => item.name);
		}
	},

	callback: async ({ interaction, client }) => {
		const subcommand = interaction?.options.data[0];
		const args: string[] = interaction?.options.data![0].options!.map(
			(option) => option.value
		) as string[];

		if (subcommand?.name === "start") {
			const item = new Item(args[0]);
			const itemData = await item.get();


			if (!itemData)
				return {
					content: `Item \`${args[0]}\` not found.`,
					ephemeral: true,
				};

			const raffle = new Raffle(item);
			const raffleData = await raffle.getByItem();
			if (raffleData)
				return {
					content: `Raffle for \`${itemData.name}\` has already started.`,
					ephemeral: true,
				};

			const created = await raffle.create(parseInt(args[1]));
			if (!created)
				return {
					content: `Failed to create raffle for \`${itemData.name}\`.`,
					ephemeral: true,
				};

			const embed = new EmbedBuilder()
				.setColor("#E8BCCA")
				.setTitle("Raffle Started")
				.setDescription(`Raffle for \`${itemData.name}\` has started.`)
				.setFooter({
					text: `Ends in ${args[1]} minutes.`,
				})
				.setTimestamp()
				.setImage(itemData.imageUrl);

			return {
				embeds: [embed],
				ephemeral: true,
			};
		}
	},
} as CommandObject;
