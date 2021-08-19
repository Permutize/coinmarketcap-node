import { strict as assert } from 'assert';
import Axios from 'axios';
import qs from 'qs';
import { Currency } from './pojo/currency';
import { Metrics } from './pojo/metrics';

const BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

export default class CoinMarketCap {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async get(path: string, params: string): Promise<unknown> {
    const response = await Axios.get(`${BASE_URL}${path}?${params}`, {
      headers: {
        'X-CMC_PRO_API_KEY': this.apiKey,
        Accept: 'application/json',
        'Accept-Charset': 'utf-8',
        'Accept-Encoding': 'deflate, gzip',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
      },
    });

    assert.equal(response.status, 200);
    assert.equal(response.data.status.error_code, 0);

    return response.data.data;
  }

  public async fetchCryptocurrencyMap(
    params: {
      listing_status?: 'active' | 'inactive';
      start?: number;
      limit?: number;
      sort?: 'id' | 'cmc_rank';
      symbol?: string | Array<string>;
      aux?:
        | string
        | Array<
            'platform' | 'first_historical_data' | 'last_historical_data' | 'is_active' | 'status'
          >;
    } = {
      start: 1,
      limit: 5000,
    },
  ): Promise<Currency[]> {
    const path = '/cryptocurrency/map';

    if (params.symbol) {
      if (Array.isArray(params.symbol)) {
        params.symbol = params.symbol.join(','); // eslint-disable-line no-param-reassign
      }
    }

    if (params.aux) {
      if (Array.isArray(params.aux)) {
        params.aux = params.aux.join(','); // eslint-disable-line no-param-reassign
      }
    }

    return this.get(path, qs.stringify(params)) as Promise<Currency[]>;
  }

  public async listingsLatest(
    params: {
      start: number;
      limit: number;
      volume_24h_min?: number;
      convert: string | Array<'USD' | 'USDT' | 'BTC' | 'ETH' | 'XRP' | 'BCH' | 'LTC'>;
      convert_id?: string | number[];
      sort:
        | 'name'
        | 'symbol'
        | 'date_added'
        | 'market_cap'
        | 'market_cap_strict'
        | 'price'
        | 'circulating_supply'
        | 'total_supply'
        | 'max_supply'
        | 'num_market_pairs'
        | 'volume_24h'
        | 'percent_change_1h'
        | 'percent_change_24h'
        | 'percent_change_7d'
        | 'market_cap_by_total_supply_strict'
        | 'volume_7d'
        | 'volume_30d';
      sort_dir: 'desc' | 'asc';
      cryptocurrency_type: 'all' | 'coins' | 'tokens';
      aux?:
        | string
        | Array<
            | 'num_market_pairs'
            | 'cmc_rank'
            | 'date_added'
            | 'tags'
            | 'platform'
            | 'max_supply'
            | 'circulating_supply'
            | 'total_supply'
            | 'market_cap_by_total_supply'
            | 'volume_24h_reported'
            | 'volume_7d'
            | 'volume_7d_reported'
            | 'volume_30d'
            | 'volume_30d_reported'
          >;
    } = {
      start: 1,
      limit: 100,
      convert: ['USD'],
      sort: 'market_cap',
      sort_dir: 'desc',
      cryptocurrency_type: 'all',
    },
  ): Promise<Currency[]> {
    const path = '/cryptocurrency/listings/latest';

    if (Array.isArray(params.convert)) {
      params.convert = params.convert.join(','); // eslint-disable-line no-param-reassign
    }
    if (params.convert_id) {
      if (Array.isArray(params.convert_id)) {
        params.convert_id = params.convert_id.join(','); // eslint-disable-line no-param-reassign
      }
    }
    if (params.aux) {
      if (Array.isArray(params.aux)) {
        params.aux = params.aux.join(','); // eslint-disable-line no-param-reassign
      }
    }

    return this.get(path, qs.stringify(params)) as Promise<Currency[]>;
  }

  public async quotesLatest(
    params: {
      id?: string | number[];
      symbol?: string | string[];
      convert: string | Array<'USD' | 'USDT' | 'BTC' | 'ETH' | 'XRP' | 'BCH' | 'LTC'>;
      convert_id?: string | number[];
      aux?:
        | string
        | Array<
            | 'num_market_pairs'
            | 'cmc_rank'
            | 'date_added'
            | 'tags'
            | 'platform'
            | 'max_supply'
            | 'circulating_supply'
            | 'total_supply'
            | 'market_cap_by_total_supply'
            | 'volume_24h_reported'
            | 'volume_7d'
            | 'volume_7d_reported'
            | 'volume_30d'
            | 'volume_30d_reported'
          >;
      skip_invalid?: boolean;
    } = {
      symbol: ['BTC', 'ETH', 'USDT'],
      convert: ['USD'],
    },
  ): Promise<{ [key: string]: Currency }> {
    if (!params.id && !params.symbol) {
      throw new Error('At least one "id" or "symbol" is required');
    }
    if (params.id && params.symbol) {
      throw new Error('ID and symbol cannot be passed in at the same time.');
    }

    const path = '/cryptocurrency/quotes/latest';

    if (params.id) {
      if (Array.isArray(params.id)) {
        params.id = params.id.join(','); // eslint-disable-line no-param-reassign
      }
    }
    if (params.symbol) {
      if (Array.isArray(params.symbol)) {
        params.symbol = params.symbol.join(','); // eslint-disable-line no-param-reassign
      }
    }
    if (Array.isArray(params.convert)) {
      params.convert = params.convert.join(','); // eslint-disable-line no-param-reassign
    }
    if (params.convert_id) {
      if (Array.isArray(params.convert_id)) {
        params.convert_id = params.convert_id.join(','); // eslint-disable-line no-param-reassign
      }
    }
    if (params.aux) {
      if (Array.isArray(params.aux)) {
        params.aux = params.aux.join(','); // eslint-disable-line no-param-reassign
      }
    }

    return this.get(path, qs.stringify(params)) as Promise<{ [key: string]: Currency }>;
  }

  public async fetchLatestGlobalMetrics(params: {
    convert?: string | string[];
    convert_id?: string | number[];
  }): Promise<Metrics> {
    const path = '/global-metrics/quotes/latest';

    if (params.convert) {
      if (Array.isArray(params.convert)) {
        params.convert = params.convert.join(','); // eslint-disable-line no-param-reassign
      }
    }

    if (params.convert_id) {
      if (Array.isArray(params.convert_id)) {
        params.convert_id = params.convert_id.join(','); // eslint-disable-line no-param-reassign
      }
    }

    return this.get(path, qs.stringify(params)) as Promise<Metrics>;
  }
}
