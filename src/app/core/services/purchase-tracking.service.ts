import { Injectable } from '@angular/core';
import { AppConfig } from '../../app.config';
import { environment } from '../../../environments/environment';

/**
 * Sends the 'purchase' event only once an order was really placed - after the payment
 * was approved (Pelecard, Tranzila, cash, Cibus, 10bis...) and the server returned the
 * order number, which is used as the transaction_id.
 *
 * The order screen keeps the cart data here (setPendingPurchase) when it sends the order
 * to payment, and the payment result screen calls trackPurchase with the order id.
 */
@Injectable({
  providedIn: 'root'
})
export class PurchaseTrackingService {

  private pendingPurchase: any = null;

  public setPendingPurchase(purchase: any) {
    this.pendingPurchase = purchase;
  }

  public trackPurchase(orderId: any) {
    const purchase = this.pendingPurchase;
    // Cleared right away, so the same order is never reported twice
    this.pendingPurchase = null;
    if (!purchase) {
      return;
    }

    try {
      const w = window as any;
      w.dataLayer = w.dataLayer || [];

      const hasOrderId = orderId !== undefined && orderId !== null && orderId !== '';
      const transactionId = hasOrderId ? String(orderId) : this.generateTransactionId();
      const currency = environment.country === 'us' ? 'USD' : 'ILS';
      const value = Math.round((Number(purchase.value) || 0) * 100) / 100;

      // For GTM containers and for the pixels of initEventTracking (home screen),
      // which listen to the dataLayer
      w.dataLayer.push({
        ...purchase,
        'event': 'purchase',
        'transaction_id': transactionId,
        'value': value,
        'currency': currency
      });

      // When initEventTracking did not set up gtag (no GA4 id in the branch tracking params)
      // nothing above reaches GA4. The franchise may still load a Google tag (G-XXXX) through
      // the "Google Tag Manager" setting - that tag ignores plain dataLayer events and handles
      // gtag() commands only, so the event is sent to it directly
      if (typeof w.gtag !== 'function' && this.isGoogleTagId(this.configuredTagId())) {
        const gtag: (...args: any[]) => void = function () {
          w.dataLayer.push(arguments);
        };
        const eventParams: any = {
          transaction_id: transactionId,
          value: value,
          currency: currency,
          items: purchase.items || []
        };
        if (purchase.coupon) {
          eventParams.coupon = purchase.coupon;
        }
        gtag('event', 'purchase', eventParams);
      }
    } catch (error) {
      // Tracking must never break the order flow
    }
  }

  private configuredTagId(): string {
    const settings = AppConfig.configSettings;
    return settings && settings.googleTagManager ? ('' + settings.googleTagManager).trim() : '';
  }

  // G-XXXX (GA4) or AW-XXXX (Google Ads) - a Google tag, not a GTM container (GTM-XXXX)
  private isGoogleTagId(tagId: string): boolean {
    return /^(G|AW)-/i.test(tagId);
  }

  private generateTransactionId(): string {
    return 'bite-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
  }
}
