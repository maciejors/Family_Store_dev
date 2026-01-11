import '@testing-library/jest-dom';

jest.mock('@/lib/notifications/onesignal');

jest.mock('@/lib/supabase/auth');
jest.mock('@/lib/supabase/database/apps');
jest.mock('@/lib/supabase/database/brands');
