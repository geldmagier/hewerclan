import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	PermissionFlagsBits,
} from "discord.js";
import { CommandObject, CommandType } from "swagcommands";
import { prisma } from "../..";
import User from "../../util/database/User";

export default {
	description: "Clear all user data",
	type: CommandType.SLASH,
	testOnly: true,
	guildOnly: true,
	ownerOnly: true,
	permissions: [PermissionFlagsBits.Administrator],

	options: [],

	callback: async ({ interaction, args, client }) => {
		const users = await User.getAll();

		const embed = new EmbedBuilder()
			.setColor("Red")
			.setTitle("Are you sure?")
			.setDescription(
				"This will delete all user data. This action cannot be undone."
			)
			.setTimestamp();

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId("clear-users-confirm")
				.setLabel("Confirm")
				.setStyle(ButtonStyle.Danger),
			new ButtonBuilder()

				.setCustomId("clear-users-cancel")
				.setLabel("Cancel")
				.setStyle(ButtonStyle.Primary)
		);

		await interaction?.reply({
			embeds: [embed],
			components: [row],
		});

		const filter = (i: any) => i.user.id === interaction?.user.id;
		const collector = interaction?.channel?.createMessageComponentCollector({
			filter,
			time: 10000,
		});

		collector?.on("collect", async (i) => {
			if (i.customId === "clear-users-confirm") {
				await i.deferUpdate();
				await i.editReply({
					embeds: [
						embed
							.setDescription("Deleting all user data..")
							.setTitle("Deleting..."),
					],
					components: [],
				});

				for (const user of users) {
					await prisma.ticket.deleteMany({
						where: {
							userId: user.id,
						},
					});

					await prisma.entry.deleteMany({
						where: {
							userId: user.id,
						},
					});

					await prisma.user.delete({
						where: {
							id: user.id,
						},
					});
				}

				await i.editReply({
					embeds: [
						embed
							.setDescription("All user data has been deleted.")
							.setTitle("Success"),
					],
					components: [],
				});
			} else if (i.customId === "clear-users-cancel") {
				await i.deferUpdate();
				await i.editReply({
					embeds: [
						embed
							.setDescription("The action has been cancelled.")
							.setTitle("Cancelled"),
					],
					components: [],
				});
			}
		});
	},
} as CommandObject;
