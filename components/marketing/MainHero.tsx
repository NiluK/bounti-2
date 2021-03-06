import React from 'react';
// @ts-nocheck

import NextLink from 'next/link';
import { styled, Paragraph, Image, Section, Box as RadixBox } from '@modulz/design-system';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { ArrowLeft } from 'tabler-icons-react';
import {
  Carousel,
  CarouselSlideList,
  CarouselSlide,
  CarouselNext,
  CarouselPrevious,
} from './Carousel';

import { useComposedRefs } from '@radix-ui/react-compose-refs';

import { Paper, createStyles, Text, Box, Button } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 1,
    marginTop: '2rem',
  },
  title: {
    color: '$hiContrast',
    WebkitBackgroundClip: 'text',
    // Use padding rather than margin, or otherwise some descenders
    // may be clipped with WebkitBackgroundClip: 'text'
    paddingBottom: '0.5rem',
    marginBottom: '0.5rem',
    // Same issue, letters may be clipped horizontally
    fontFamily: 'Krona One, sans-serif',
    fontWeight: 500,
    fontSize: 'min(max($7, 10vw), $8)',
    letterSpacing: 'max(min(-0.055em, 0.66vw), -0.07em)',
    '@media (min-width: 900px) and (min-height: 850px)': {
      fontSize: '60px',
      lineHeight: '1.16',
    },
  },
  highlight: {
    color: 'transparent',
    display: 'inline-block',
    WebkitBackgroundClip: 'text',
    backgroundImage: `linear-gradient(180deg, ${theme.colors.orange[8]}, ${theme.colors.red[8]})`,
    // Use padding rather than margin, or otherwise some descenders
    // may be clipped with WebkitBackgroundClip: 'text'
    fontWeight: 500,
    marginLeft: theme.spacing.sm,
    lineHeight: '1.6',
    fontFamily: 'Krona One, sans-serif',
    fontSize: '70px',
  },
}));

const StyledFocusArea = styled('div', {
  outline: 0,
  length: '0',
  borderRadius: '$3',
  '&:focus': {
    boxShadow: '0 0 0 2px $colors$blue8',
  },
  '&:focus:not(:focus-visible)': {
    boxShadow: 'none',
  },
});

const FocusArea = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof StyledFocusArea>>(
  ({ children, onKeyDown, ...props }, forwardedRef) => {
    const ownRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(ownRef, forwardedRef);

    return (
      <StyledFocusArea
        {...props}
        data-focus-area
        ref={composedRef}
        tabIndex={0}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          // Move focus inside the FocusArea when Enter or Spacebar is pressed
          if (
            event.target === event.currentTarget &&
            (event.key === 'Enter' || event.key === ' ')
          ) {
            // We are looking for something obviously focusable
            const tier1 =
              '[role="menu"], [role="dialog"] input, [role="dialog"] button, [tabindex="0"]';
            const tier2 = 'a, button, input, select, textarea';

            // Search for tier 1 and tier 2 elements, prioritising
            const elementToFocus = [
              event.currentTarget.querySelector<HTMLElement>(tier1),
              event.currentTarget.querySelector<HTMLElement>(tier2),
            ].filter((el) => Boolean(el))[0];

            if (elementToFocus) {
              event.preventDefault();
              elementToFocus.focus();
            }
          }

          // Move focus onto the FocusArea when Escape is pressed, unless the focus is currently inside a modal
          if (
            event.key === 'Escape' &&
            event.target instanceof HTMLElement &&
            event.target !== event.currentTarget &&
            event.target.closest('[role="dialog"], [role="menu"]') === null
          ) {
            event.currentTarget.focus();
          }
        }}
      >
        <div data-focus-area-entry />
        {children}
        <div data-focus-area-exit />
      </StyledFocusArea>
    );
  }
);

export const MainHero = ({ games = [] }) => {
  const lastUsedFocusArea = React.useRef<HTMLElement>(null);
  const isRoving = React.useRef(false);

  console.log('games', games);

  const { classes, cx } = useStyles();

  React.useEffect(() => {
    lastUsedFocusArea.current = document.querySelector('[data-focus-area]');
  }, []);

  const onFocusAreaFocus = React.useCallback((event: React.FocusEvent<HTMLElement>) => {
    lastUsedFocusArea.current = event.currentTarget;
  }, []);

  // We are implementing a simple roving tab index with some tweaks
  const onFocusAreaKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const allAreas = Array.from(document.querySelectorAll<HTMLElement>('[data-focus-area]'));
        const thisIndex = allAreas.findIndex((el) => el === event.currentTarget);
        const nextIndex = Math.min(thisIndex + 1, allAreas.length - 1);
        const nextDemo = allAreas[nextIndex];
        isRoving.current = true;
        nextDemo.focus();
        (nextDemo as any).scrollIntoViewIfNeeded?.(true);
        lastUsedFocusArea.current = nextDemo;
        isRoving.current = false;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const allAreas = Array.from(document.querySelectorAll<HTMLElement>('[data-focus-area]'));
        const thisIndex = allAreas.findIndex((el) => el === event.currentTarget);
        const prevIndex = Math.max(thisIndex - 1, 0); // thisIndex - 1 >= 0 ? thisIndex - 1 : allAreas.length - 1;
        const prevDemo = allAreas[prevIndex];
        isRoving.current = true;
        prevDemo.focus();
        (prevDemo as any).scrollIntoViewIfNeeded?.(true);
        lastUsedFocusArea.current = prevDemo;
        isRoving.current = false;
      }

      // Tab key press moves focus to the next element after the carousel
      if (event.key === 'Tab' && event.shiftKey === false) {
        const selector = 'a, button, input, select, textarea, [data-focus-area-exit]';
        const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
          (element) => element.tabIndex !== -1 || element.hasAttribute('data-focus-area-exit')
        );

        // Find last exit guard
        elements.reverse();
        const lastExit = elements.find((el) => el.matches('[data-focus-area-exit]'));
        elements.reverse();
        const lastExitIndex = elements.indexOf(lastExit);
        const nextElement = elements[lastExitIndex + 1];

        if (nextElement) {
          event.preventDefault();
          nextElement.focus();
        }
      }

      // Shift + Tab key press moves focus to the previous element before the carousel
      if (event.key === 'Tab' && event.shiftKey) {
        const selector = 'a, button, input, select, textarea, [data-focus-area-entry]';
        const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
          (element) => element.tabIndex !== -1 || element.hasAttribute('data-focus-area-entry')
        );

        // Find first entry guard
        const firstEntry = elements.find((el) => el.matches('[data-focus-area-entry]'));
        const firstEntryIndex = elements.indexOf(firstEntry);
        const prevElement = elements[firstEntryIndex - 1];

        if (prevElement) {
          event.preventDefault();
          prevElement.focus();
        }
      }
    }
  }, []);

  React.useEffect(() => {
    const tabListener = (event: KeyboardEvent) => {
      // Catch that Tab that lands into carousel contents from
      // elsewhere, and redirect focus to the nearest focus area
      if (
        event.key === 'Tab' &&
        event.shiftKey === false &&
        event.target instanceof HTMLElement &&
        !event.target.hasAttribute('data-focus-area')
      ) {
        const selector = 'a, button, input, select, textarea, [data-focus-area-entry]';
        const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
          (element) =>
            element.tabIndex !== -1 ||
            element === event.target ||
            element.hasAttribute('data-focus-area-entry')
        );

        // Find first entry guard
        const firstEntryIndex = elements.findIndex((el) =>
          el.hasAttribute('data-focus-area-entry')
        );

        if (elements.indexOf(event.target) + 1 === firstEntryIndex) {
          event.preventDefault();
          lastUsedFocusArea.current?.focus();
        }
      }

      // Catch that Shift + Tab that lands into carousel contents from
      // elsewhere, and redirect focus to the nearest focus area
      if (
        event.key === 'Tab' &&
        event.shiftKey &&
        event.target instanceof HTMLElement &&
        !event.target.hasAttribute('data-focus-area')
      ) {
        const selector = 'a, button, input, select, textarea, [data-focus-area-exit]';
        const elements = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
          (element) =>
            element.tabIndex !== -1 ||
            element === event.target ||
            element.hasAttribute('data-focus-area-exit')
        );

        // Find last exit guard
        elements.reverse();
        const lastExit = elements.find((el) => el.hasAttribute('data-focus-area-exit'));
        elements.reverse();
        const lastExitIndex = elements.indexOf(lastExit);

        if (elements.indexOf(event.target) - 1 === lastExitIndex) {
          event.preventDefault();
          lastUsedFocusArea.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', tabListener);
    return () => document.removeEventListener('keydown', tabListener);
  }, []);

  const slides = games?.map((val) => {
    const { name, slug, summary, featured_image } = val;
    return (
      <Paper mr={'md'} shadow={'xs'} p="md">
        <CarouselSlide>
          <FocusArea
            aria-label="Dialog component demo"
            onKeyDown={onFocusAreaKeyDown}
            onFocus={onFocusAreaFocus}
          >
            <NextLink href={`/games/${slug}`} passHref>
              <Image
                css={{
                  objectFit: 'cover',
                  width: '500px',
                  maxWidth: '90vw',
                  height: '100%',
                  aspectRatio: 16 / 9,
                  pb: '$4',
                  borderRadius: '5px',
                  paddingBottom: '2px',
                  marginBottom: '$4',
                }}
                src={featured_image}
              />
            </NextLink>
          </FocusArea>
          <NextLink href={`/games/${slug}`} passHref>
            <Text weight="bold" size="lg" component="h3">
              {name}
            </Text>
          </NextLink>
          <GrabBox>
            <Text component="p" size="sm">
              {summary}
            </Text>
          </GrabBox>
        </CarouselSlide>
      </Paper>
    );
  });

  return (
    <div className={classes.root}>
      <Text component="h1" className={classes.title}>
        Play games,
        <br />
        get
        <Text component="span" className={classes.highlight}>
          Bounti.
        </Text>
        <br />
      </Text>
      <Box sx={{ maxWidth: 470, marginBottom: '25px' }}>
        <Text size="xl" component="p">
          Get paid for completing bounties and promoting video games. Help beta test and influence
          upcoming games.
        </Text>
      </Box>
      <Box sx={{ marginBottom: '50px' }}>
        <NextLink href="/signup" passHref>
          <Button color="orange">
            Start Earning <ArrowRightIcon />
          </Button>
        </NextLink>
      </Box>

      <RadixBox css={{ position: 'relative' }}>
        <Carousel>
          <CarouselSlideList
            sx={{
              display: 'grid',
              gridAutoFlow: 'column',
              gridAutoColumns: 'min-content',
              overflowX: 'auto',
              overflowY: 'hidden',
              py: '$1',
              WebkitOverflowScrolling: 'touch',
              // Gap between slides
              $$gap: '$space$5',
              // calculate the left padding to apply to the scrolling list
              // so that the carousel starts aligned with the container component
              // the "1145" and "$5" values comes from the <Container /> component
              // hide scrollbar
              MsOverflowStyle: 'none',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },

              // Can't have nice grid gap because Safari butchers scroll padding with it
              '& > *': {
                pr: '$$gap',
              },
            }}
          >
            {slides}
          </CarouselSlideList>

          <RadixBox
            css={{
              position: 'absolute',
              top: 'calc(50% - $7)',
              left: '15px',
            }}
          >
            <CarouselPrevious
              aria-label="Show previous demo"
              tabIndex={-1}
              as={CarouselArrowButton}
            >
              <ArrowLeftIcon />
            </CarouselPrevious>
          </RadixBox>
          <RadixBox
            css={{
              position: 'absolute',
              top: 'calc(50% - $7)',
              right: '15px',
            }}
          >
            <CarouselNext aria-label="Show next demo" tabIndex={-1} as={CarouselArrowButton}>
              <ArrowRightIcon />
            </CarouselNext>
          </RadixBox>
        </Carousel>
      </RadixBox>
    </div>
  );
};

const CarouselArrowButton = styled('button', {
  unset: 'all',
  outline: 0,
  margin: 0,
  border: 0,
  padding: 0,
  length: 0,
  display: 'flex',
  position: 'relative',
  zIndex: 1,
  ai: 'center',
  jc: 'center',
  bc: '$panel',
  br: '$round',
  width: '$7',
  height: '$7',
  color: '$hiContrast',

  boxShadow: '$colors$blackA11 0px 2px 12px -5px, $colors$blackA5 0px 1px 3px',
  willChange: 'transform, box-shadow, opacity',
  transition: 'all 100ms',

  '@hover': {
    '&:hover': {
      boxShadow: '$colors$blackA10 0px 3px 16px -5px, $colors$blackA5 0px 1px 3px',
      transform: 'translateY(-1px)',

      // Fix a bug when hovering at button edges would cause the button to jitter because of transform
      '&::before': {
        content: '',
        inset: -2,
        br: '$round',
        position: 'absolute',
      },
    },
  },
  '&:focus': {
    boxShadow: `
      $colors$blackA10 0px 3px 16px -5px,
      $colors$blackA5 0px 1px 3px,
      $colors$blue8 0 0 0 2px
    `,
    transform: 'translateY(-1px)',
  },
  '&:focus:not(:focus-visible)': {
    boxShadow: '$colors$blackA11 0px 2px 12px -5px, $colors$blackA5 0px 1px 3px',
  },
  '&:active:not(:focus)': {
    boxShadow: '$colors$blackA11 0px 2px 12px -5px, $colors$blackA5 0px 1px 3px',
  },
  '&:active': {
    transform: 'none',
    transition: 'opacity 100ms',
  },
  '&:disabled': {
    opacity: 0,
  },
  '@media (hover: none) and (pointer: coarse)': {
    display: 'none',
  },
});

const GrabBox = styled('div', {
  cursor: 'grab',
  '&:active': { cursor: 'grabbing' },
  length: 0,

  // Fill in spaces between slides
  mr: '-$$gap',
  pr: '$$gap',
});
