import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import { NextIntlClientProvider } from 'next-intl';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

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

// Mock the LanguageSwitcher component
jest.mock('@/components/LanguageSwitcher', () => {
  return () => <div data-testid="language-switcher-mock"></div>;
});

describe('Footer', () => {
  it('renders translated text in English', () => {
    const messages = {
      Footer: {
        copyright: '© 2025 Locally Loop',
        license: 'GPLv3 License',
        privacy: 'Privacy-first · Local-only',
        github: 'GitHub',
        licenseLink: 'License',
      },
    };

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <Footer />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('© 2025 Locally Loop')).toBeInTheDocument();
    expect(screen.getByText('GPLv3 License')).toBeInTheDocument();
    expect(screen.getByText('Privacy-first · Local-only')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('License')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher-mock')).toBeInTheDocument();
  });

  it('renders translated text in Turkish', () => {
    const messages = {
      Footer: {
        copyright: '© 2025 Locally Loop',
        license: 'GPLv3 Lisansı',
        privacy: 'Önce gizlilik · Yalnızca yerel',
        github: 'GitHub',
        licenseLink: 'Lisans',
      },
    };

    render(
      <NextIntlClientProvider locale="tr" messages={messages}>
        <Footer />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('© 2025 Locally Loop')).toBeInTheDocument();
    expect(screen.getByText('GPLv3 Lisansı')).toBeInTheDocument();
    expect(screen.getByText('Önce gizlilik · Yalnızca yerel')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Lisans')).toBeInTheDocument();
    expect(screen.getByTestId('language-switcher-mock')).toBeInTheDocument();
  });
});