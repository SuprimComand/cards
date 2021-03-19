import { useCallback, useEffect, useState } from 'react';
import { Course, ValuteType } from '../pages/api/course';

export const useValutePrice = (price: number) => {
  const [result, setResult] = useState<number | string>(price || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const request = useCallback(async (priceParam?: number) => {
    try {
      setLoading(true);
      const valuteId = localStorage.getItem('valute');
      if (!valuteId) {
        setLoading(false);
        return;
      }
      let result: object = {};
      const course = localStorage.getItem('course');
      if (course) {
        result = JSON.parse(course);
      } else {
        const response = await Course.getCourses();
        result = (await response.json()).Valute;
      }
      const usd = result['USD'].Value;
      const valutes: ValuteType[] = Object.values(result);
      localStorage.setItem('course', JSON.stringify(result));
      const valute = valutes.find((item) => item.ID === valuteId);
      // const priceValue = priceParam || price;
      const res = (usd * (priceParam || price)) / valute.Value;
      setResult(res.toFixed(2));
      setLoading(false);
    } catch (err) {
      if (attempt < 3) {
        setAttempt(attempt + 1);
      } else {
        setError(String(err));
        setLoading(false);
      }
    }
  }, [result, setResult, attempt]);

  useEffect(() => {
    if (price) {
      request();
    }
  }, [attempt, price]);

  const refetch = useCallback((priceParam?: number) => {
      if (priceParam) {
        request(priceParam);
      } else if (price) {
      request();
    }
  }, [price]);

  return { data: result, loading, error, refetch };
};
