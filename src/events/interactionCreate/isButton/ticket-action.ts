import {
	BaseInteraction,
	EmbedBuilder,
	GuildMember,
	PermissionFlagsBits,
} from "discord.js";
import SWAG from "swagcommands";
import Ticket from "../../../util/database/Ticket";
import Item from "../../../util/database/Item";

export default async (interaction: BaseInteraction, instance: SWAG) => {
	if (!interaction.isButton()) return;
	const { member } = interaction as { member: GuildMember };

	if (interaction.customId === "close") {
		// check ob der user admin ist
		if (!member.permissions.has(PermissionFlagsBits.Administrator))
			return interaction.reply({
				content: "You can't close this ticket!",
				ephemeral: true,
			});

		const t = await Ticket.getByChannelId(interaction.channelId);

		if (!t)
			return interaction.reply({
				content:
					"Something went wrong, the item for this ticket may have been deleted!",
				ephemeral: true,
			});

		const ticket = new Ticket(t.itemId, t.channelId, t.userId, parseInt(t.id));
		const item = await Item.getById(t.itemId);

		if (t.closed === true)
			return interaction.reply({
				content: "This ticket is already being deleted...",
				ephemeral: true,
			});

		await ticket.close();

		const deletingEmbed = new EmbedBuilder()
			.setTitle("Closing Ticket...")
			.setDescription("This ticket will be closed in 10 seconds...")
			.setColor("Red")
			.setFooter({
				text: member?.user.tag,
				iconURL: member?.displayAvatarURL(),
			})
			.setTimestamp();

		interaction.channel?.send({ embeds: [deletingEmbed] });

		setTimeout(() => {
			interaction.channel?.delete();
		}, 10000);
	}
};
