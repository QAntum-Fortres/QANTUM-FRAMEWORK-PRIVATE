// [PURIFIED_BY_AETERNA: a2cbc8ea-5607-49bb-a758-b5a503c30c42]
// Suggestion: Review and entrench stable logic.
/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║  QAntum Prime v28.1 - EXCHANGE CONNECTORS                                 ║
 * ║  "Вратата към борсите" - Binance + Kraken + More                          ║
 * ║                                                                           ║
 * ║  🏦 Real exchange API integration with Fortress encryption                ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import { liveWalletManager } from './LiveWalletManager';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface ExchangeCredentials {
    apiKey: string;
    apiSecret: string;
    passphrase?: string;
}

export interface OrderParams {
    symbol: string;
    side: 'buy' | 'sell';
    type: 'market' | 'limit';
    quantity: number;
    price?: number;
    timeInForce?: 'GTC' | 'IOC' | 'FOK';
}

export interface Order {
    id: string;
    exchange: string;
    symbol: string;
    side: 'buy' | 'sell';
    type: 'market' | 'limit';
    status: 'new' | 'filled' | 'partially_filled' | 'cancelled' | 'rejected';
    quantity: number;
    filledQuantity: number;
    price: number;
    avgFillPrice: number;
    fee: number;
    feeCurrency: string;
    createdAt: number;
    updatedAt: number;
}

export interface Balance {
    asset: string;
    free: number;
    locked: number;
    total: number;
}

export interface Ticker {
    symbol: string;
    bid: number;
    ask: number;
    last: number;
    volume24h: number;
    timestamp: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// BINANCE CONNECTOR
// ═══════════════════════════════════════════════════════════════════════════

class BinanceConnector extends EventEmitter {
    private apiKey: string = '';
    private apiSecret: string = '';
    private baseUrl = 'https://api.binance.com';
    private isConfigured = false;

    configure(credentials: ExchangeCredentials): void {
        this.apiKey = credentials.apiKey;
        this.apiSecret = credentials.apiSecret;
        this.isConfigured = true;
        console.log('[Binance] ✅ Configured');
    }

    private sign(queryString: string): string {
        return crypto
            .createHmac('sha256', this.apiSecret)
            .update(queryString)
            .digest('hex');
    }

    private async request(
        endpoint: string,
        method: string = 'GET',
        params: Record<string, any> = {},
        signed: boolean = false
    ): Promise<any> {
        if (!this.isConfigured) throw new Error('Binance not configured');

        const headers: Record<string, string> = {
            'X-MBX-APIKEY': this.apiKey,
        };

        let url = `${this.baseUrl}${endpoint}`;
        let body: string | undefined;

        if (signed) {
            params.timestamp = Date.now();
            params.recvWindow = 5000;
        }

        let queryString = new URLSearchParams(params).toString();

        if (signed) {
            const signature = this.sign(queryString);
            queryString += `&signature=${signature}`;
        }

        if (method === 'GET' || method === 'DELETE') {
            url += `?${queryString}`;
        } else {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            body = queryString;
        }

        try {
            const response = await fetch(url, { method, headers, body });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || `Binance API error: ${response.status}`);
            }
            return data;
        } catch (error) {
            console.error('[Binance] API error:', error);
            throw error;
        }
    }

    async getTicker(symbol: string): Promise<Ticker> {
        const data = await this.request('/api/v3/ticker/bookTicker', 'GET', { symbol });

        return {
            symbol: data.symbol,
            bid: parseFloat(data.bidPrice),
            ask: parseFloat(data.askPrice),
            last: parseFloat(data.bidPrice),
            volume24h: 0,
            timestamp: Date.now(),
        };
    }

    async getBalances(): Promise<Balance[]> {
        const data = await this.request('/api/v3/account', 'GET', {}, true);

        return data.balances
            .filter((b: any) => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0)
            .map((b: any) => ({
                asset: b.asset,
                free: parseFloat(b.free),
                locked: parseFloat(b.locked),
                total: parseFloat(b.free) + parseFloat(b.locked),
            }));
    }

    async createOrder(params: OrderParams): Promise<Order> {
        const orderParams: Record<string, any> = {
            symbol: params.symbol,
            side: params.side.toUpperCase(),
            type: params.type.toUpperCase(),
            quantity: params.quantity.toString(),
        };

        if (params.type === 'limit') {
            orderParams.price = params.price!.toString();
            orderParams.timeInForce = params.timeInForce || 'GTC';
        }

        const data = await this.request('/api/v3/order', 'POST', orderParams, true);
        return this.mapOrder(data);
    }

    private mapOrder(data: any): Order {
        return {
            id: data.orderId.toString(),
            exchange: 'binance',
            symbol: data.symbol,
            side: data.side.toLowerCase() as 'buy' | 'sell',
            type: data.type.toLowerCase() as 'market' | 'limit',
            status: this.mapStatus(data.status),
            quantity: parseFloat(data.origQty),
            filledQuantity: parseFloat(data.executedQty),
            price: parseFloat(data.price),
            avgFillPrice: parseFloat(data.cummulativeQuoteQty) / parseFloat(data.executedQty) || 0,
            fee: 0,
            feeCurrency: '',
            createdAt: data.time || data.transactTime,
            updatedAt: data.updateTime || data.transactTime,
        };
    }

    private mapStatus(status: string): Order['status'] {
        const map: Record<string, Order['status']> = {
            'NEW': 'new',
            'FILLED': 'filled',
            'PARTIALLY_FILLED': 'partially_filled',
            'CANCELED': 'cancelled',
            'REJECTED': 'rejected',
            'EXPIRED': 'cancelled',
        };
        return map[status] || 'new';
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXCHANGE HUB - UNIFIED INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

export class ExchangeHub extends EventEmitter {
    private binance: BinanceConnector;
    private configuredExchanges: Set<string> = new Set();

    constructor() {
        super();
        this.binance = new BinanceConnector();
        console.log('[ExchangeHub] 🏦 Initialized');
    }

    async configureFromVault(exchangeId: string): Promise<boolean> {
        const credentials = liveWalletManager.getCredentials(exchangeId);
        if (!credentials) return false;

        return this.configure(exchangeId, {
            apiKey: credentials.apiKey,
            apiSecret: credentials.apiSecret,
            passphrase: credentials.passphrase,
        });
    }

    configure(exchangeId: string, credentials: ExchangeCredentials): boolean {
        if (exchangeId.toLowerCase() === 'binance') {
            this.binance.configure(credentials);
            this.configuredExchanges.add('binance');
            return true;
        }
        return false;
    }

    async getTicker(exchangeId: string, symbol: string): Promise<Ticker> {
        if (exchangeId.toLowerCase() === 'binance') return this.binance.getTicker(symbol);
        throw new Error(`Unknown exchange: ${exchangeId}`);
    }

    async getBalances(exchangeId: string): Promise<Balance[]> {
        if (exchangeId.toLowerCase() === 'binance') return this.binance.getBalances();
        throw new Error(`Unknown exchange: ${exchangeId}`);
    }

    async createOrder(exchangeId: string, params: OrderParams): Promise<Order> {
        if (exchangeId.toLowerCase() === 'binance') return this.binance.createOrder(params);
        throw new Error(`Unknown exchange: ${exchangeId}`);
    }
}

export default ExchangeHub;
