import axios from 'axios';
import { getStoredToken } from './tokenStorage';
import { emitBankingDataRefresh } from './refreshEvents';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.response?.data?.detail || error?.message || fallback;
}

function isDemoMode() {
  return import.meta.env.VITE_DEMO_MODE === 'true';
}

function mockJwt(email) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: email,
      fullName: email.split('@')[0],
      email,
      role: 'customer',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    })
  );
  const signature = btoa('mock-signature');
  return `${header}.${payload}.${signature}`;
}

/**
 * Login with email + password.
 * Returns { token: <JWT string>, user: { ... } }
 *
 * In demo mode (no backend), returns a mock signed JWT so the app is
 * fully functional without a server.
 */
export async function loginApi(email, password) {
  if (isDemoMode()) {
    await delay(900);

    if (!email || !password || password.length < 6) {
      throw new Error('Invalid email or password.');
    }

    return {
      token: mockJwt(email),
      user: {
        id: 1,
        fullName: email.split('@')[0],
        email,
        role: 'CUSTOMER',
      },
    };
  }

  try {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Login failed. Please try again.'), { cause: error });
  }
}

/**
 * Register a new user.
 * POST /api/auth/register
 * Body: { fullName, email, password, phone, address }
 * Returns { message, token?, user? }
 */
export async function registerApi({ fullName, email, password, phone, address }) {
  if (isDemoMode()) {
    await delay(1000);

    if (email === 'taken@mybank.com') {
      throw new Error('An account with this email already exists.');
    }

    return {
      message: 'Account created successfully! Please log in.',
      user: { fullName, email, phone, address },
    };
  }

  try {
    const { data } = await apiClient.post('/auth/register', {
      fullName,
      email,
      password,
      phone,
      address,
    });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Registration failed. Please try again.'), { cause: error });
  }
}

/**
 * Deposit money into the current account.
 * POST /api/deposit
 * Body: { amount }
 */
export async function depositApi(amount) {
  if (isDemoMode()) {
    await delay(700);

    if (!amount || Number(amount) <= 0) {
      throw new Error('Enter a valid deposit amount.');
    }

    return { message: 'Deposit successful.', amount: Number(amount) };
  }

  try {
    const { data } = await apiClient.post('/deposit', { amount: Number(amount) });
    emitBankingDataRefresh();
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Deposit failed. Please try again.'), { cause: error });
  }
}

/**
 * Withdraw money from the current account.
 * POST /api/withdraw
 * Body: { amount }
 */
export async function withdrawApi(amount) {
  if (isDemoMode()) {
    await delay(700);

    if (!amount || Number(amount) <= 0) {
      throw new Error('Enter a valid withdraw amount.');
    }

    return { message: 'Withdraw successful.', amount: Number(amount) };
  }

  try {
    const { data } = await apiClient.post('/withdraw', { amount: Number(amount) });
    emitBankingDataRefresh();
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Withdraw failed. Please try again.'), { cause: error });
  }
}

/**
 * Transfer money to another account.
 * POST /api/transfer
 * Body: { receiverAccountNumber, amount, remarks }
 */
export async function transferApi({ receiverAccountNumber, amount, remarks }) {
  if (isDemoMode()) {
    await delay(800);

    if (!receiverAccountNumber || !amount || Number(amount) <= 0) {
      throw new Error('Enter a valid transfer request.');
    }

    return {
      message: 'Transfer successful.',
      receiverAccountNumber,
      amount: Number(amount),
      remarks: remarks || '',
    };
  }

  try {
    const { data } = await apiClient.post('/transfer', {
      receiverAccountNumber,
      amount: Number(amount),
      remarks,
    });
    emitBankingDataRefresh();
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Transfer failed. Please try again.'), { cause: error });
  }
}

/**
 * Update the current user's profile.
 * POST /api/profile
 * Body: { fullName, email, phone, address }
 */
export async function updateProfileApi({ fullName, email, phone, address }) {
  if (isDemoMode()) {
    await delay(700);

    if (!fullName || !email) {
      throw new Error('Name and email are required.');
    }

    return {
      message: 'Profile updated successfully.',
      user: { fullName, email, phone, address },
    };
  }

  try {
    const { data } = await apiClient.post('/profile', { fullName, email, phone, address });
    return data;
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Profile update failed. Please try again.'), { cause: error });
  }
}
