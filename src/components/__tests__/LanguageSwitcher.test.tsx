import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '../LanguageSwitcher';
import { NextIntlClientProvider } from 'next-intl';
import { useAppSettings } from '@/app/store/appPreferences';

const mockRefresh = jest.fn();

// Mock the useRouter hook at the top level
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

// Mock the useAppSettings hook
jest.mock('@/app/store/appPreferences', () => ({
  useAppSettings: jest.fn(),
}));

// Mock the sfx module
jest.mock('@/lib/sfx', () => ({
  useSfx: () => ({
    playClick: jest.fn(),
    playPop: jest.fn(),
    playType: jest.fn(),
    playWhoosh: jest.fn(),
    playWrite: jest.fn(),
    playError: jest.fn(),
    playSuccess: jest.fn(),
    playNotification: jest.fn(),
    playAlert: jest.fn(),
    playBackground: jest.fn(),
    stopBackground: jest.fn(),
    setVolume: jest.fn(),
  }),
  useHoverClickSounds: () => ({
    onMouseEnter: jest.fn(),
    onClick: jest.fn(),
  }),
}));

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    // Reset the mock before each test
    (useAppSettings as jest.Mock).mockReturnValue({
      locale: 'en',
      setLocale: jest.fn(),
    });
    mockRefresh.mockClear(); // Clear mock calls before each test
  });

  it('renders the language switcher with the current locale', () => {
    render(
      <NextIntlClientProvider locale="en">
        <LanguageSwitcher />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('calls setLocale and router.refresh when a new option is selected', () => {
    const mockSetLocale = jest.fn();

    (useAppSettings as jest.Mock).mockReturnValue({
      locale: 'en',
      setLocale: mockSetLocale,
    });

    render(
      <NextIntlClientProvider locale="en">
        <LanguageSwitcher />
      </NextIntlClientProvider>
    );

    const selectTrigger = screen.getByRole('combobox');
    fireEvent.click(selectTrigger); // Open the select dropdown

    const turkishOption = screen.getByText('Türkçe'); // This text is in the SelectItem
    fireEvent.click(turkishOption);

    expect(mockSetLocale).toHaveBeenCalledWith('tr');
    expect(mockRefresh).toHaveBeenCalled();
  });
});
