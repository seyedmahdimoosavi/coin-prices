/**
 * Convert CoinGecko response to simplified DTO
 */
function mapToDto(raw) {
  if (!raw) return null;

  const market = raw.market_data ?? {};

  // Find the first available platform (Ethereum, Tron, BSC, Polygon, ...)
  const platform =
    Object.values(raw.detail_platforms ?? {}).find(Boolean) ?? {};

  return {
    // Basic
    name: raw.name ?? null,
    symbol: raw.symbol ?? null,
    asset_platform_id: raw.asset_platform_id ?? null,
    market_cap_rank: raw.market_cap_rank ?? null,
    genesis_date: raw.genesis_date ?? null,
    last_updated: raw.last_updated ?? null,
    block_time_in_minutes: raw.block_time_in_minutes ?? null,
    image: raw.image ?? null,

    // Supply
    total_supply: market.total_supply ?? null,
    max_supply: market.max_supply ?? null,
    circulating_supply: market.circulating_supply ?? null,

    // Contract
    contract_address: platform.contract_address ?? null,
    decimal_place: platform.decimal_place ?? null,

    // Market
    market_cap: market.market_cap?.usd ?? null,
    current_price: market.current_price?.usd ?? null,
    fully_diluted_valuation:
      market.fully_diluted_valuation?.usd ?? null,
    total_volume: market.total_volume?.usd ?? null,

    // Prices
    high_24h: market.high_24h?.usd ?? null,
    low_24h: market.low_24h?.usd ?? null,

    // Changes
    price_change_24h: market.price_change_24h ?? null,
    price_change_percentage_24h:
      market.price_change_percentage_24h ?? null,

    market_cap_change_24h:
      market.market_cap_change_24h ?? null,

    market_cap_change_percentage_24h:
      market.market_cap_change_percentage_24h ?? null,

    price_change_24h_in_currency:
      market.price_change_24h_in_currency?.usd ?? null,

    market_cap_change_24h_in_currency:
      market.market_cap_change_24h_in_currency?.usd ?? null,

    // ATH / ATL
    ath: market.ath?.usd ?? null,
    ath_date: market.ath_date?.usd ?? null,

    atl: market.atl?.usd ?? null,
    atl_date: market.atl_date?.usd ?? null,

    // External Links
    links: raw.links ?? {},
  };
}

module.exports = { mapToDto };