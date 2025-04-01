import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDeviceType(): {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
} {
  const isMobileQuery = useMediaQuery({ maxWidth: 767 });
  const isTabletQuery = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktopQuery = useMediaQuery({ minWidth: 1024 });
  
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  
  useEffect(() => {
    if (isMobileQuery) setDeviceType('mobile');
    else if (isTabletQuery) setDeviceType('tablet');
    else setDeviceType('desktop');
  }, [isMobileQuery, isTabletQuery, isDesktopQuery]);
  
  return {
    deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
  };
}
