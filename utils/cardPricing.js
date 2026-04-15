const DEFAULT_CARD_PRICE = 10;

const PRICE_BY_RARITY = Object.freeze({
  '◇': 20,
  '◇◇': 40,
  '◇◇◇': 100,
  '◇◇◇◇': 250,
  '☆': 500,
  '☆☆': 1200,
  '☆☆☆': 3000,
  'â—Š': 20,
  'â—Šâ—Š': 40,
  'â—Šâ—Šâ—Š': 100,
  'â—Šâ—Šâ—Šâ—Š': 250,
  'â˜†': 500,
  'â˜†â˜†': 1200,
  'â˜†â˜†â˜†': 3000,
  'Crown Rare': 6000,
});

const RARE_CARD_RARITIES = Object.freeze([
  '◇◇◇',
  '◇◇◇◇',
  '☆',
  '☆☆',
  '☆☆☆',
  'â—Šâ—Šâ—Š',
  'â—Šâ—Šâ—Šâ—Š',
  'â˜†',
  'â˜†â˜†',
  'â˜†â˜†â˜†',
  'Crown Rare',
]);

function getPriceForRarity(rarity) {
  return PRICE_BY_RARITY[rarity] || DEFAULT_CARD_PRICE;
}

function resolveCardPrice(card = {}) {
  const numericPrice = Number(card.price);
  if (card.price !== undefined && card.price !== null && card.price !== '' && Number.isFinite(numericPrice)) {
    return numericPrice;
  }

  return getPriceForRarity(card.rarity);
}

function isRareRewardRarity(rarity) {
  return RARE_CARD_RARITIES.includes(rarity);
}

module.exports = {
  DEFAULT_CARD_PRICE,
  PRICE_BY_RARITY,
  RARE_CARD_RARITIES,
  getPriceForRarity,
  isRareRewardRarity,
  resolveCardPrice,
};
