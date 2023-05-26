import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { CommandObject, CommandType } from "swagcommands";
import Messages from "../../util/config/Messages";
import User from "../../util/database/User";

export default {
	description: "Add points to a user",
	type: CommandType.SLASH,
	testOnly: true,

	guildOnly: true,
	permissions: [PermissionFlagsBits.Administrator],

	options: [
		{
			name: "user",
			description: "The user you want to add points to",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "amount",
			description: "The amount of points you want to add",
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
	],

	callback: async ({ interaction, args, client }) => {
		const user = new User(args[0]);
		const amount = parseInt(args[1]);
		if (isNaN(amount))
			return {
				content: "The amount must be a number",
				ephemeral: true,
			};
		await user.add(amount).catch((err) => {
			console.error(err);
			return {
				content: "An error occurred while adding points",
				ephemeral: true,
			};
		});

		return {
			content: `You added \`${amount}\` ${Messages.CURRENCY} to <@${args[0]}> 's balance.`,
		};
	},
} as CommandObject;
