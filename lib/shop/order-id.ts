/** Client-facing shop order reference (ord_*) — not the fulfillment_orders UUID. */
export function createShopOrderId(): string {
  return `ord_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
