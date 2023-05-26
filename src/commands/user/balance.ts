import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ColorResolvable,
	EmbedBuilder,
	PermissionFlagsBits,
} from "discord.js";
import { CommandObject, CommandType } from "swagcommands";
import Messages from "../../util/config/Messages";

export default {
	description: "Send the balance button",
	type: CommandType.SLASH,
	testOnly: true,
	guildOnly: true,

	options: [],

	permissions: [PermissionFlagsBits.Administrator],

	callback: async ({ interaction, args, client }) => {
		const button = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setLabel("Check Balance")
				.setStyle(ButtonStyle.Secondary)
				.setCustomId("check-balance")
		);

		const embed = new EmbedBuilder()
			.setTitle(Messages.BALANCE_TITLE)
			.setDescription(Messages.BALANCE_DESCRIPTION)
			.setColor(Messages.BALANCE_COLOR as ColorResolvable);

		return {
			embeds: [embed],
			components: [button],
		};
	},
} as CommandObject;
