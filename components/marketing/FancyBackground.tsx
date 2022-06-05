import React from 'react';
import { Box, darkTheme } from '@modulz/design-system';

export const FancyBackground: React.FC = ({ children }) => {
  return (
    <Box css={{ position: 'relative', zIndex: 0 }}>
      <Box
        css={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          bc: '$slate1',
          zIndex: -1,
          overflow: 'hidden',
        }}
      >
        <Box
          css={{
            width: '100vw',
            minWidth: 1500,
            left: '50%',
            transform: 'translateX(-50%)',
            position: 'absolute',
            top: 0,
            bottom: 0,
            // Safari transparency bug workaround
            $$transparent: '#FDFCFD00',
            [`.${darkTheme} &`]: {
              $$transparent: '#16161800',
            },
          }}
        />
      </Box>
      {children}
    </Box>
  );
};
