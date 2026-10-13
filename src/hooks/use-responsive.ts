import { useWindowDimensions } from 'react-native';

import { MaxContentWidth } from '@/constants/theme';

export type DeviceClass = 'phone' | 'tablet' | 'desktop';

/**
 * Responsive layout helper.
 *
 * `width`/`height` come from useWindowDimensions so the app reacts to
 * rotation, split-screen, and web resizes.
 *
 * `contentWidth` is the width content should actually occupy: the full
 * width on phones, capped at MaxContentWidth on wide screens so lines
 * and cards never stretch to unreadable lengths.
 *
 * `inset` is the horizontal padding content should get, scaled with the
 * screen so a 7" tablet breathes more than a 4" phone.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const device: DeviceClass = width < 500 ? 'phone' : width < 1024 ? 'tablet' : 'desktop';
  const isPhone = device === 'phone';

  const contentWidth = Math.min(width, MaxContentWidth);
  const inset = isPhone ? 16 : device === 'tablet' ? 24 : 32;

  return {
    width,
    height,
    device,
    isPhone,
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    contentWidth,
    inset,
  };
}
