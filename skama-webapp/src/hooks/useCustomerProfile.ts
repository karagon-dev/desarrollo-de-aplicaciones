import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import type { IClientProfileDto, IUpsertClientProfileRequest } from '../types';
import { clientService } from '../services';
import { getApiErrorMessage } from '../utils';

interface IUseCustomerProfileResult {
  profile: IClientProfileDto | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  isNewProfile: boolean;
  refetch: () => Promise<void>;
  saveProfile: (data: IUpsertClientProfileRequest) => Promise<void>;
}

export function useCustomerProfile(userId?: string): IUseCustomerProfileResult {
  const [profile, setProfile] = useState<IClientProfileDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNewProfile, setIsNewProfile] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      setIsNewProfile(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await clientService.getProfile(userId);
      setProfile(data);
      setIsNewProfile(false);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setProfile(null);
        setIsNewProfile(true);
        setError(null);
      } else {
        setProfile(null);
        setError(getApiErrorMessage(err, 'No se pudo cargar el perfil.'));
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const saveProfile = useCallback(
    async (data: IUpsertClientProfileRequest) => {
      if (!userId) {
        throw new Error('Usuario no autenticado.');
      }

      setSaving(true);
      setError(null);

      try {
        await clientService.upsertProfile(userId, data);
        await refetch();
      } catch (err) {
        const message = getApiErrorMessage(err, 'No se pudo guardar el perfil.');
        setError(message);
        throw new Error(message);
      } finally {
        setSaving(false);
      }
    },
    [userId, refetch],
  );

  return {
    profile,
    loading,
    saving,
    error,
    isNewProfile,
    refetch,
    saveProfile,
  };
}
