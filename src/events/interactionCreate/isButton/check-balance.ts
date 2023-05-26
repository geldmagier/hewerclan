import { BaseInteraction, EmbedBuilder } from "discord.js";
import SWAG from "swagcommands";
import Messages from "../../../util/config/Messages";
import User from "../../../util/database/User";

export default async (interaction: BaseInteraction, instance: SWAG) => {
	if (!interaction.isButton()) return;
	if (interaction.customId !== "check-balance") return;
	const user = new User(interaction?.user.id!);
	const userData = await user.get();

	if (!userData || userData.balance === 0) {
		return interaction.reply({
			content: `You don't have any ${Messages.CURRENCY} right now.`,
			ephemeral: true,
		});
	}

	const embed = new EmbedBuilder()
		.setTitle(`${interaction?.user.username}'s Balance`)
		.setDescription(`You have **${userData.balance} ${Messages.CURRENCY}**.`)
		.setColor("Random")
		.setTimestamp()
		.setImage(interaction?.user.displayAvatarURL()!);

	interaction.reply({ embeds: [embed], ephemeral: true });
};
