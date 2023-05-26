import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChannelType,
	Client,
	EmbedBuilder,
	PermissionFlagsBits,
	TextChannel,
} from "discord.js";
import SWAG from "swagcommands";
import { prisma } from "..";
import Messages from "../util/config/Messages";
import Item from "../util/database/Item";
import Raffle from "../util/database/Raffle";
import Ticket from "../util/database/Ticket";

export default async (instance: SWAG, client: Client) => {
	const doRaffles = async () => {
		const raffles = await Raffle.getAll();
		const guild = await client.guilds.fetch(process.env.SERVER_ID!);

		raffles.forEach(async (raffle) => {
			//check if raffle ending time is the current date, hour and minute
			const raffleDate = new Date(raffle.endingAt);
			const currentDate = new Date();
			if (
				raffleDate.getDate() === currentDate.getDate() &&
				raffleDate.getHours() === currentDate.getHours() &&
				raffleDate.getMinutes() === currentDate.getMinutes()
			) {
				const ticketId = Math.floor(Math.random() * 9000) + 10000;
				const item = await Item.getById(raffle.itemId);
				const i = new Item(item?.name!);
				const r = new Raffle(i, raffle.id);
				const raffleData = await r.get();

				const entries = await r.getEntries();
				const winner = await getWinner(entries);

				const wUser = await client.users.fetch(winner.userId);

				const embed = new EmbedBuilder()
					.setTitle(`Raffle Ended!`)
					.setDescription(
						`The raffle for ${item?.name} has ended! The winner is <@${winner.userId}>!`
					)
					.setTimestamp()
					.setColor("#E8BCCA")
					.setAuthor({
						name: wUser?.username + "#" + wUser?.discriminator,
						iconURL: wUser?.avatarURL()!,
					})
					.setImage(item?.imageUrl!);

				const raffleChannel = (await client.channels.cache.get(
					process.env.RAFFLE_CHANNEL!
				)) as TextChannel;

				raffleChannel?.send({ embeds: [embed] });

				try {
					await guild?.channels
						.create({
							name: `ticket-${wUser.username}`,
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
									id: wUser.id as string,
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
								wUser.id,
								ticketId
							).create();

							const embed = new EmbedBuilder()
								.setTitle(`Ticket for ${wUser.username} - Item: ${item?.name}`)
								.setColor("#E8BCCA")
								.setAuthor({
									name: wUser.username,
									iconURL: wUser.displayAvatarURL(),
								})
								.setImage(item?.imageUrl!)
								.setTimestamp();

							const button = new ActionRowBuilder<
								ButtonBuilder
							>().setComponents(
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

							await wUser
								.send({
									content: Messages.ITEM_PURCHASED(item?.name!, channel.id),
								})
								.catch((err) => {});

							await prisma.entry
								.deleteMany({
									where: {
										raffleId: raffleData?.id,
									},
								})
								.then(async () => {
									await prisma.raffle.delete({
										where: {
											id: raffleData?.id,
										},
									});
								});
						});
				} catch (err) {
					console.log(err);
				}
			} else {
				// kein raffle endet gerade
			}
		});

		//check again in 5 seconds
		setTimeout(doRaffles, 5000);
	};

	doRaffles();
};

async function getWinner(entries: any[]) {
	let winner = entries[Math.floor(Math.random() * entries.length)];
	return winner;
}
