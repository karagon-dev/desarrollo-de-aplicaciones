import { useEffect, useState } from 'react';
import { orderService } from '../services';

export interface IEligibleReviewOrder {
  orderId: string;
  orderNumber: string;
}

export function useEligibleReviewOrders(userId?: string, productId?: string) {
  const [orders, setOrders] = useState<IEligibleReviewOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !productId) {
      setOrders([]);
      return;
    }

    const currentUserId = userId;
    const currentProductId = productId;
    let cancelled = false;

    async function loadEligibleOrders() {
      setLoading(true);

      try {
        const { data: userOrders } = await orderService.getByUser(currentUserId);
        const details = await Promise.all(
          userOrders.map(async (order) => {
            try {
              const { data } = await orderService.getDetail(order.id);
              return data;
            } catch {
              return null;
            }
          }),
        );

        if (cancelled) {
          return;
        }

        const eligible = details
          .filter((detail) => detail?.items.some((item) => item.productId === currentProductId))
          .map((detail) => ({
            orderId: detail!.id,
            orderNumber: detail!.orderNumber,
          }));

        setOrders(eligible);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadEligibleOrders();

    return () => {
      cancelled = true;
    };
  }, [userId, productId]);

  return { eligibleOrders: orders, loading };
}
