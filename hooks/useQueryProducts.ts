import { useCallback, useEffect, useState } from 'react';
import { ProductApi, ProductType } from '../pages/api/product';

export const useQueryProducts = (limit?: number) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const request = useCallback(
    async (limitRequest?: number) => {
      try {
        setLoading(true);
        const response = await ProductApi.getAllProducts(limitRequest || limit);
        const result = await response.json();
        setProducts(result);
        setLoading(false);
      } catch (err) {
        if (attempt < 3) {
          setAttempt(attempt + 1);
        } else {
          setError(String(err));
          setLoading(false);
        }
      }
    },
    [products, setProducts, attempt],
  );

  useEffect(() => {
    request();
  }, [attempt]);

  const refetch = useCallback(
    (limit?: number) => {
      setAttempt(0);
      request(limit);
    },
    [setAttempt, limit],
  );

  return { data: products, loading, error, refetch };
};
