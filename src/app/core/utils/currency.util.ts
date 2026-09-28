import { APP_CONFIG } from '../constants/config';

/**
 * Centralized Indian Rupee (INR) Currency Formatter
 * 
 * Examples:
 * formatInr(999) => "₹999"
 * formatInr(2499) => "₹2,499"
 * formatInr(124999) => "₹1,24,999"
 * formatInr(2845000) => "₹28,45,000"
 */
export function formatInr(amount: number, includeDecimals = false): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${APP_CONFIG.currency.symbol}0`;
  }

  const rounded = includeDecimals ? amount : Math.round(amount);
  const formatted = rounded.toLocaleString('en-IN', {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  });

  return `${APP_CONFIG.currency.symbol}${formatted}`;
}

/**
 * Compact Indian Currency Formatter for Analytics & Reports
 * 
 * Examples:
 * formatIndianCompact(500) => "₹500"
 * formatIndianCompact(25000) => "₹25K"
 * formatIndianCompact(2845000) => "₹28.45 Lakh"
 * formatIndianCompact(15000000) => "₹1.50 Crore"
 */
export function formatIndianCompact(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${APP_CONFIG.currency.symbol}0`;
  }

  const symbol = APP_CONFIG.currency.symbol;

  if (amount >= 10000000) {
    const crores = (amount / 10000000).toFixed(2).replace(/\.00$/, '');
    return `${symbol}${crores} Crore`;
  }
  if (amount >= 100000) {
    const lakhs = (amount / 100000).toFixed(2).replace(/\.00$/, '');
    return `${symbol}${lakhs} Lakh`;
  }
  if (amount >= 1000) {
    const k = (amount / 1000).toFixed(1).replace(/\.0$/, '');
    return `${symbol}${k}K`;
  }

  return `${symbol}${amount}`;
}
