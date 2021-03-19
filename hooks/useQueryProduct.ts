import { useCallback, useEffect, useState } from 'react';
import { ProductApi, ProductType } from '../pages/api/product';

export const useQueryProduct = (id: number | string) => {
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const request = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ProductApi.getProductById(id);
      const result = await response.json();
      setProduct(result);
      setLoading(false);
    } catch (err) {
      if (attempt < 3) {
        setAttempt(attempt + 1);
      } else {
        setError(String(err));
        setLoading(false);
      }
    }
  }, [product, setProduct, attempt, id]);

  useEffect(() => {
    if (id) {
      request();
    }
  }, [attempt, id]);

  const refetch = useCallback(() => {
    if (id) {
      request();
    }
  }, [id]);

  return { data: product, loading, error, refetch };
};
