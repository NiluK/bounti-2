import { Box, darkTheme, styled } from '@modulz/design-system';
import React from 'react';
import { Button } from '@mantine/core';

type MarketingButtonProps = {
  as: any;
  icon?: React.ComponentType<any>;
} & React.ComponentProps<typeof StyledButton>;

export const MarketingButton = React.forwardRef<HTMLButtonElement, MarketingButtonProps>(
  ({ children, icon: Icon, ...props }, forwardedRef) => {
    return (
      <Button ref={forwardedRef} {...props}>
        {children}
        {Icon && (
          <Box as="span" css={{ ml: 8, mr: -3 }}>
            <Icon />
          </Box>
        )}
      </Button>
    );
  }
);
