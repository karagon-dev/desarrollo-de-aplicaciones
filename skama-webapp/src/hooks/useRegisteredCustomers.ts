import { useCallback, useEffect, useState } from 'react';
import type { IDateRangeParams, IUserDto } from '../types';
import { authService } from '../services';
import { getApiErrorMessage, sortByText } from '../utils';

const CUSTOMER_ROLE_ID = 2;

interface IUseRegisteredCustomersResult {
  customers: IUserDto[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function isRegisteredWithinDateRange(customer: IUserDto, params: IDateRangeParams): boolean {
  const registrationDate = customer.createdAt.slice(0, 10);

  return (
    (!params.startDate || registrationDate >= params.startDate) &&
    (!params.endDate || registrationDate <= params.endDate)
  );
}

export function useRegisteredCustomers(
  params: IDateRangeParams,
  refreshIntervalMs = 30000,
): IUseRegisteredCustomersResult {
  const [customers, setCustomers] = useState<IUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { startDate, endDate } = params;

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await authService.listUsers({
        roleId: CUSTOMER_ROLE_ID,
        includeInactive: false,
      });
      const filteredCustomers = data.filter((customer) =>
        isRegisteredWithinDateRange(customer, { startDate, endDate }),
      );
      setCustomers(sortByText(filteredCustomers, (customer) => customer.email));
    } catch (err) {
      setCustomers([]);
      setError(getApiErrorMessage(err, 'No se pudieron cargar los clientes registrados.'));
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  useEffect(() => {
    if (refreshIntervalMs <= 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      void refetch();
    }, refreshIntervalMs);

    return () => window.clearInterval(intervalId);
  }, [refetch, refreshIntervalMs]);

  return { customers, loading, error, refetch };
}
