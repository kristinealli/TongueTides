const express = require("express");
const router = express.Router();
const { data } = require("../data/flashcardData.json");
const { cards } = data;

const viewedCards = new Set();

router.get("/", (req, res) => {
	if (viewedCards.size === cards.length) {
		viewedCards.clear(); // Reset the set if all cards have been viewed
	}

	let flashcardId;
	do {
		flashcardId = Math.floor(Math.random() * cards.length);
	} while (viewedCards.has(flashcardId));

	viewedCards.add(flashcardId);
	res.redirect(`/cards/${flashcardId}`);
});

router.get("/:id", (req, res) => {
	const { side } = req.query;
	const { id } = req.params;

	if (!side) {
		return res.redirect(`/cards/${id}?side=english`);
	}
	const name = req.cookies.username;
	const text = cards[id][side];
	const { hint } = cards[id];

	const templateData = { id, text, name, side };

	// Only include hint if it exists
	if (hint && side === "english") {
		templateData.hint = hint;
	}

	if (side === "english") {
		templateData.sideToShow = "anishinaabemowin";
		templateData.sideToShowDisplay = "Anishinaabemowin";
	} else if (side === "anishinaabemowin") {
		templateData.sideToShow = "english";
		templateData.sideToShowDisplay = "English";
	}

	res.render("card", templateData);
});

module.exports = router;
