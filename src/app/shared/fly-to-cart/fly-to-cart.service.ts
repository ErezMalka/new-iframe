import { Injectable } from '@angular/core';

export interface FlyToCartOptions {
  /** Animation duration in milliseconds */
  duration?: number;
  /** Final scale of the flying element before reaching the cart */
  endScale?: number;
  /** How many degrees to rotate during the flight */
  rotateDeg?: number;
  /** Whether to bounce the cart at the end */
  bounceCart?: boolean;
  /** Vertical lift of the parabola peak (in px) */
  arcHeight?: number;
}

/**
 * FlyToCartService
 * Creates an Amazon-style 'fly to cart' animation: clones a product image and
 * animates it along a parabolic path to the cart icon, then bounces the cart.
 *
 * Pure vanilla DOM + CSS - no external dependencies.
 */
@Injectable({ providedIn: 'root' })
export class FlyToCartService {
  private styleInjected = false;

  /**
   * Flies a product image from a source element to the cart element.
   */
  public fly(
    sourceEl: HTMLElement,
    cartSelector: string = '.side-cart',
    imageUrl?: string,
    options: FlyToCartOptions = {}
  ): Promise<void> {
    return new Promise(resolve => {
      try {
        this.injectStylesOnce();

        const cart = document.querySelector(cartSelector) as HTMLElement | null;
        if (!sourceEl || !cart) { resolve(); return; }

        const opts = {
          duration: 850,
          endScale: 0.18,
          rotateDeg: 540,
          bounceCart: true,
          arcHeight: 140,
          ...options,
        };

        const srcImg = (sourceEl.tagName === 'IMG'
          ? sourceEl as HTMLImageElement
          : sourceEl.querySelector('img')) as HTMLImageElement | null;

        const url = imageUrl || (srcImg && srcImg.src);
        if (!url) { resolve(); return; }

        const startRect = (srcImg || sourceEl).getBoundingClientRect();
        const endRect = cart.getBoundingClientRect();

        const startX = startRect.left;
        const startY = startRect.top;
        const startW = Math.min(startRect.width, 220);
        const startH = Math.min(startRect.height, 220);

        const endX = endRect.left + endRect.width / 2 - startW / 2;
        const endY = endRect.top + endRect.height / 2 - startH / 2;

        const flyer = document.createElement('img');
        flyer.src = url;
        flyer.alt = '';
        flyer.className = 'fly-to-cart-ghost';
        flyer.style.left = startX + 'px';
        flyer.style.top = startY + 'px';
        flyer.style.width = startW + 'px';
        flyer.style.height = startH + 'px';
        flyer.style.setProperty('--end-x', (endX - startX) + 'px');
        flyer.style.setProperty('--end-y', (endY - startY) + 'px');
        flyer.style.setProperty('--arc-y', '-' + opts.arcHeight + 'px');
        flyer.style.setProperty('--end-scale', String(opts.endScale));
        flyer.style.setProperty('--rotate', opts.rotateDeg + 'deg');
        flyer.style.setProperty('--duration', opts.duration + 'ms');

        document.body.appendChild(flyer);

        requestAnimationFrame(() => {
          flyer.classList.add('fly-to-cart-go');
        });

        let finished = false;
        const cleanup = () => {
          if (finished) return;
          finished = true;
          flyer.remove();
          if (opts.bounceCart) {
            cart.classList.remove('fly-to-cart-bounce');
            void cart.offsetWidth;
            cart.classList.add('fly-to-cart-bounce');
            setTimeout(() => cart.classList.remove('fly-to-cart-bounce'), 650);
          }
          resolve();
        };

        flyer.addEventListener('animationend', cleanup, { once: true });
        setTimeout(cleanup, opts.duration + 300);
      } catch (e) {
        console.warn('[FlyToCart] failed:', e);
        resolve();
      }
    });
  }

  private injectStylesOnce(): void {
    if (this.styleInjected) return;
    if (document.head.querySelector('style[data-fly-to-cart]')) {
      this.styleInjected = true;
      return;
    }
    this.styleInjected = true;

    const css = `
      .fly-to-cart-ghost {
        position: fixed;
        z-index: 99999;
        pointer-events: none;
        border-radius: 12px;
        object-fit: cover;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        opacity: 0;
        transform: translate(0, 0) scale(1) rotate(0deg);
        will-change: transform, opacity;
      }
      .fly-to-cart-ghost.fly-to-cart-go {
        animation: flyToCart var(--duration, 850ms) cubic-bezier(0.5, -0.2, 0.7, 1) forwards;
      }
      @keyframes flyToCart {
        0% {
          opacity: 0;
          transform: translate(0, 0) scale(1) rotate(0deg);
        }
        12% { opacity: 1; }
        55% {
          opacity: 1;
          transform:
            translate(calc(var(--end-x) * 0.55), calc(var(--end-y) * 0.55 + var(--arc-y)))
            scale(calc((1 + var(--end-scale)) / 2))
            rotate(calc(var(--rotate) * 0.55));
        }
        100% {
          opacity: 0.55;
          transform:
            translate(var(--end-x), var(--end-y))
            scale(var(--end-scale))
            rotate(var(--rotate));
        }
      }
      .fly-to-cart-bounce {
        animation: cartBounce 0.65s cubic-bezier(0.36, 0, 0.66, -0.56) !important;
      }
      @keyframes cartBounce {
        0%   { transform: scale(1); }
        25%  { transform: scale(1.08); }
        50%  { transform: scale(0.96); }
        75%  { transform: scale(1.04); }
        100% { transform: scale(1); }
      }
      @media (prefers-reduced-motion: reduce) {
        .fly-to-cart-ghost.fly-to-cart-go,
        .fly-to-cart-bounce {
          animation-duration: 0.01ms !important;
        }
      }
    `;
    const style = document.createElement('style');
    style.setAttribute('data-fly-to-cart', '');
    style.textContent = css;
    document.head.appendChild(style);
  }
}
