import {
	ActionRowBuilder,
	BaseInteraction,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	EmbedBuilder,
	PermissionFlagsBits,
} from "discord.js";
import Item from "../../../util/database/Item";
import User from "../../../util/database/User";
import SWAG from "swagcommands";
import { ErrorType } from "../../../util/database/Errors";
import Messages from "../../../util/config/Messages";
import Raffle from "../../../util/database/Raffle";
import Entry from "../../../util/database/Entry";
import Ticket from "../../../util/database/Ticket";

export default async (interaction: BaseInteraction, instance: SWAG) => {
	if (!interaction.isButton()) return;

	const { guild, user } = interaction;

	const args = interaction.customId.split("-");
	if (args[0] === "shop" || args[0] === "item") {
		const ticketId = Math.floor(Math.random() * 9000) + 10000;

		const item = await Item.getById(args[1]);
		if (!item)
			return interaction.reply({ content: "Item not found!", ephemeral: true });
		const i = new Item(item?.name!);
		const { price, name } = item!;

		const user = new User(interaction.user.id);
		const userData = await user.get();
		// if userDate is undefined, then balance is 0
		const balance = userData?.balance || 0;
		const raffle = new Raffle(i);
		const raffleData = await raffle.getByItem();

		if (!raffleData) {
			const bought = await user.buy(price);
			if (bought === ErrorType.NOT_ENOUGH_POINTS) {
				return interaction.reply({
					content: `You do not have enough ${Messages.CURRENCY} to buy **${name}**! \`(${balance} ${Messages.CURRENCY} / ${price} ${Messages.CURRENCY})\``,
					ephemeral: true,
				});
			}

			try {
				await guild?.channels
					.create({
						name: `ticket-${interaction.user.username}`,
						type: ChannelType.GuildText,
						parent: process.env.TICKET_CATEGORY,
						permissionOverwrites: [
							{
								id: process.env.EVERYONE as string,
								deny: [
									PermissionFlagsBits.ViewChannel,
									PermissionFlagsBits.SendMessages,
									PermissionFlagsBits.ReadMessageHistory,
								],
							},
							{
								id: interaction.user.id as string,
								allow: [
									PermissionFlagsBits.ViewChannel,
									PermissionFlagsBits.SendMessages,
									PermissionFlagsBits.ReadMessageHistory,
								],
							},
						],
					})
					.then(async (channel) => {
						const newTicket = await new Ticket(
							item!.id,
							channel.id,
							interaction.user.id,
							ticketId
						).create();

						const embed = new EmbedBuilder()
							.setTitle(
								`Ticket for ${interaction.user.username} - Item: ${item?.name}`
							)
							.setColor("#E8BCCA")
							.setAuthor({
								name: interaction.user.username,
								iconURL: interaction.user.displayAvatarURL(),
							})
							.setImage(item?.imageUrl!)
							.setTimestamp();

						const button = new ActionRowBuilder<ButtonBuilder>().setComponents(
							new ButtonBuilder()
								.setCustomId("close")
								.setLabel("Close Ticket")
								.setStyle(ButtonStyle.Primary)
								.setEmoji("❌")
						);

						channel.send({
							embeds: [embed],
							components: [button],
						});

						await interaction
							.reply({
								content: Messages.ITEM_PURCHASED(item?.name!, channel.id),
								ephemeral: true,
							})
							.catch((err: any) => {});

						return;
					});
			} catch (err) {
				return;
			}
		} else {
			// check if raffle ending time is the current date, hour and minute
			const raffleDate = new Date(raffleData!.endingAt);
			const currentDate = new Date();
			if (
				raffleDate.getDate() === currentDate.getDate() &&
				raffleDate.getHours() === currentDate.getHours() &&
				raffleDate.getMinutes() === currentDate.getMinutes()
			) {
				return interaction.reply({
					content: `The raffle for ${name} has already ended / is currently ending! Please try again in a few minutes!`,
					ephemeral: true,
				});
			}

			const entry = new Entry(interaction.user.id, raffleData!.id);
			const entryData = await entry.create();

			if (entryData.entries >= parseInt(process.env.MAX_ENTRIES!)) {
				return interaction.reply({
					content: `You have reached the maximum amount of entries for this raffle!`,
					ephemeral: true,
				});
			}

			const payed = await user.buy(price);
			if (payed === ErrorType.NOT_ENOUGH_POINTS) {
				return interaction.reply({
					content: `You do not have enough ${Messages.CURRENCY} to buy **${name}**! \`(${balance} ${Messages.CURRENCY} / ${price} ${Messages.CURRENCY})\``,
					ephemeral: true,
				});
			}

			const newEntry = await entry.addEntry();
			if (!newEntry)
				return interaction.reply({
					content: "Something went wrong! Please try again later!",
					ephemeral: true,
				});

			const embed = new EmbedBuilder()
				.setTitle(`You have entered the raffle for ${name}!`)

				.setColor("#E8BCCA")
				.setAuthor({
					name: interaction.user.username,
					iconURL: interaction.user.displayAvatarURL(),
				})
				.setImage(item?.imageUrl!)
				.setDescription(
					`You have entered the raffle for **${name}**! You have **${
						newEntry.entries
					}** entries in this raffle!\n\nThe raffle will end <t:${parseInt(
						`${raffleData!.endingAt.getTime() / 1000}`
					)}:R>`
				)
				.setTimestamp();

			return interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});
		}
	}
};
