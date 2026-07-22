import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ILoginRequest, IRegisterRequest, IUserSession } from '../types';
import { authService } from '../services';
import { getApiErrorMessage } from '../utils';
import { ROLES } from '../constants/roles';

const AUTH_STORAGE_KEY = 'skama-auth-session';

interface IAuthContextValue {
  user: IUserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (data: ILoginRequest) => Promise<void>;
  register: (data: IRegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContextValue | null>(null);

function readStoredSession(): IUserSession | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as IUserSession;
    if (!parsed.userId || !parsed.email) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function persistSession(user: IUserSession | null): void {
  if (user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

interface IAuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<IUserSession | null>(() => readStoredSession());
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (data: ILoginRequest) => {
    setIsLoading(true);
    try {
      const { data: response } = await authService.login(data);
      const session: IUserSession = {
        userId: response.userId,
        email: response.email,
        roleId: response.roleId,
        roleName: response.roleName,
        isActive: response.isActive,
      };
      setUser(session);
      persistSession(session);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Sign in failed.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: IRegisterRequest) => {
    setIsLoading(true);
    try {
      await authService.register(data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'Registration could not be completed.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persistSession(null);
  }, []);

  const value = useMemo<IAuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.roleId === ROLES.ADMIN,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): IAuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
