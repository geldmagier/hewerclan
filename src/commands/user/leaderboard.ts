import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ColorResolvable,
	EmbedBuilder,
} from "discord.js";
import { CommandObject, CommandType } from "swagcommands";
import Messages from "../../util/config/Messages";
import User from "../../util/database/User";

export default {
	description: "Show the leaderboard",
	type: CommandType.SLASH,
	testOnly: true,
	guildOnly: true,

	options: [],

	callback: async ({ interaction, args, client }) => {
		const users = await User.getTop();

		if (!users) return { content: "No users found", ephemeral: true };
		if (users.length === 0)
			return { content: "No users found", ephemeral: true };

		let leaderboard = "";

		// wenn weniger als 10 user in der db sind wird das "normale" leaderboard gesendet
		if (users.length <= 10) {
			for (const user of users) {
				const u = new User(user.id);
				const userData = await u.get();

				leaderboard += `**${users.indexOf(user) + 1}.** <@${user.id}> - **${
					userData?.balance
				}** ${Messages.CURRENCY}\n`;

				// limit the leaderboard to 2048 characters
				if (leaderboard.length >= 2000) break;
			}

			const embed = new EmbedBuilder()
				.setTitle(Messages.LEADERBOARD_TITLE)
				.setDescription(leaderboard)
				.setColor(Messages.LEADERBOARD_COLOR as ColorResolvable)
				.setTimestamp();

			return {
				embeds: [embed],
			};
		}

		const pages: EmbedBuilder[] = [];
		// teile die user in chunks von 10 auf
		const userChunks = [...chunks(users, 10)];

		// ein leaderboard für jeden chunk erstellen
		for (const chunk of userChunks) {
			leaderboard = "";
			for (const user of chunk) {
				const u = new User(user.id);
				const userData = await u.get();

				leaderboard += `**${users.indexOf(user) + 1}.** <@${user.id}> - **${
					userData?.balance
				}** ${Messages.CURRENCY}\n`;
			}

			const embed = new EmbedBuilder()
				.setTitle(Messages.LEADERBOARD_TITLE)
				.setDescription(leaderboard)
				.setColor(Messages.LEADERBOARD_COLOR as ColorResolvable)
				.setTimestamp()
				.setFooter({
					text: `Page ${pages.length + 1}/${userChunks.length}`,
				});

			pages.push(embed);
		}

		const row = getRow(0, pages);

		// die erste leaderboard page senden
		await interaction
			?.reply({
				embeds: [pages[0]],
				components: [row],
			})
			.catch((err) => {
				console.log(err);
			});

		// einen collector erstellen, der auf button clicks hört
		const filter = (i: any) => i.user.id === interaction?.user.id;

		const collector = await interaction?.channel?.createMessageComponentCollector(
			{
				filter,
				time: 60000,
			}
		);

		let currentPage = 0;

		collector?.on("collect", async (i) => {
			if (i.customId === "leaderboard-prev") {
				// wenn der user den prev button klickt, gehe zur vorherigen seite
				if (currentPage === 0) return;

				currentPage--;
				const nRow = getRow(currentPage, pages);

				await i.deferUpdate();
				await i.editReply({
					embeds: [pages[currentPage]],
					components: [nRow],
				});
			} else if (i.customId === "leaderboard-next") {
				// wenn der user den next button klickt, gehe zur nächsten seite
				if (currentPage === pages.length - 1) return;

				currentPage++;

				const nrow = getRow(currentPage, pages);

				await i.deferUpdate();
				await i.editReply({
					embeds: [pages[currentPage]],
					components: [nrow],
				});
			}
		});
	},
} as CommandObject;

function* chunks(array: any[], n: number) {
	// array in n große chunks aufteilen
	for (let i = 0; i < array.length; i += n) yield array.slice(i, i + n);
}

function getRow(currentPage: number, pages: EmbedBuilder[]) {
	// buttons ertellen
	const row = new ActionRowBuilder<ButtonBuilder>();
	const b1 = new ButtonBuilder()
		.setCustomId("leaderboard-prev")
		.setLabel("Previous")
		.setStyle(ButtonStyle.Primary);

	const b2 = new ButtonBuilder()
		.setCustomId("leaderboard-next")
		.setLabel("Next")
		.setStyle(ButtonStyle.Primary);

	// den jeweiligen button disablen, wenn es keinen vorherige/nächste seite gibt
	if (currentPage === 0) {
		b1.setDisabled(true);
	}
	if (currentPage === pages.length - 1) {
		b2.setDisabled(true);
	}

	row.addComponents(b1, b2);

	return row;
}
