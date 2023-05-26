import { ApplicationCommandOptionType, PermissionFlagsBits } from "discord.js";
import { CommandObject, CommandType } from "swagcommands";
import Messages from "../../util/config/Messages";
import User from "../../util/database/User";

export default {
	description: "Subtract points from a user",
	type: CommandType.SLASH,
	testOnly: true,
	guildOnly: true,

	permissions: [PermissionFlagsBits.Administrator],

	options: [
		{
			name: "user",
			description: "The user to subtract points from",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "amount",
			description: "The amount of points to subtract",
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
	],

	callback: async ({ interaction, args, client }) => {
		const user = new User(args[0]);
		const userData = await user.get();
		const amount = parseInt(args[1]);
		if (isNaN(amount))
			return {
				content: "The amount must be a number",
				ephemeral: true,
			};

		if (amount < 0)
			return {
				content: "The amount must be a positive number",
				ephemeral: true,
			};

		if (amount > userData?.balance!)
			return {
				content: `You can't subtract more than ${userData?.balance!} ${
					Messages.CURRENCY
				} from <@${args[0]}>`,
				ephemeral: true,
			};

		await user.subtract(amount).catch((err) => {
			console.error(err);
			return {
				content: "An error occurred while subtracting points",
				ephemeral: true,
			};
		});

		return {
			content: `You subtracted \`${amount}\` ${Messages.CURRENCY} from <@${args[0]}> 's balance.`,
			ephemeral: true,
		};
	},
} as CommandObject;
