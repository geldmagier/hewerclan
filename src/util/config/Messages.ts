import "dotenv/config";

export default class Messages {
	public static ITEM_EMBED_TITLE(item: string) {
		return process.env.ITEM_EMBED_TITLE?.replace("{item}", item) || item;
	}

	public static ITEM_EMBED_DESCRIPTION(item: string, price: number) {
		return (
			process.env.ITEM_EMBED_DESCRIPTION?.replace("{item}", item).replace(
				"{price}",
				price.toString()
			) || `${item} - ${price} ${Messages.CURRENCY}`
		);
	}

	public static readonly SHOP_EMBED_TITLE =
		process.env.SHOP_EMBED_TITLE || "Shop";
	public static readonly SHOP_EMBED_DESCRIPTION =
		process.env.SHOP_EMBED_DESCRIPTION || "Hier kannst du dir Items kaufen!";

	public static readonly SHOP_IMAGE = process.env.SHOP_IMAGE || "";

	public static readonly SHOP_COLOR = process.env.SHOP_COLOR || "Random";

	public static readonly CURRENCY = process.env.CURRENCY_NAME || "Punkte";

	public static ITEM_PURCHASED(item: string, channelId: string) {
		return (
			process.env.ITEM_PURCHASED?.replace("{item}", item).replace(
				"{ticket}",
				`<#${channelId}>`
			) || `Du hast **${item}** gekauft! Hier ist dein Ticket: <#${channelId}>`
		);
	}

	public static readonly LEADERBOARD_TITLE =
		process.env.LEADERBOARD_TITLE || "Leaderboard";
	public static readonly LEADERBOARD_COLOR =
		process.env.LEADERBOARD_COLOR || "Random";

	public static readonly BALANCE_TITLE =
		process.env.BALANCE_TITLE ||
		"Looking to spend some " + Messages.CURRENCY + "?";

	public static readonly BALANCE_DESCRIPTION =
		process.env.BALANCE_DESCRIPTION ||
		"Check your balance with the button below!";

	public static readonly BALANCE_COLOR = process.env.BALANCE_COLOR || "Random";
}
