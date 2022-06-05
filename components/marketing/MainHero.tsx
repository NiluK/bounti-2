import React from 'react';
import NextLink from 'next/link';
import {
  Box,
  Text,
  styled,
  darkTheme,
  Container,
  Flex,
  Paragraph,
  Image,
  Section,
  Link,
} from '@modulz/design-system';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';
import { MarketingButton } from './MarketingButton';
import {
  Carousel,
  CarouselSlideList,
  CarouselSlide,
  CarouselNext,
  CarouselPrevious,
} from './Carousel';
import { MainHeroDialog } from './MainHeroDialog';
import { MainHeroPopover } from './MainHeroPopover';
import { MainHeroDropdownMenu } from './MainHeroDropdownMenu';
import { MainHeroSlider } from './MainHeroSlider';
import { MainHeroTabs } from './MainHeroTabs';
import { MainHeroScrollArea } from './MainHeroScrollArea';
import { MainHeroAccordion } from './MainHeroAccordion';
import { MainHeroRadioGroup } from './MainHeroRadioGroup';
import { MainHeroToggleGroup } from './MainHeroToggleGroup';
import { MainHeroSwitch } from './MainHeroSwitch';
import { useComposedRefs } from '@radix-ui/react-compose-refs';

const DemoContainer = styled('div', {
  display: 'flex',
  position: 'relative',
  ai: 'center',
  jc: 'center',
  width: 300,
  height: 400,
  borderRadius: '$3',
  mb: '$2',

  // Content slightly above vertical center feels perfectly centred
  pb: '$3',

  // Can't select text because the carousel is draggable
  userSelect: 'none',
  cursor: 'default',

  '@bp1': {
    width: 400,
  },
});

const StyledFocusArea = styled('div', {
  outline: 0,
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

export const MainHero = () => {
  const lastUsedFocusArea = React.useRef<HTMLElement>(null);
  const isRoving = React.useRef(false);

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

  return (
    <Section
      css={{
        paddingTop: '$4',
        // Starting at 850px viewport height, grow the padding top from $5 until it's $9.
        '@media (min-width: 900px) and (min-height: 850px)': {
          paddingTop: 'min($9, calc($5 + 0.35 * (100vh - 850px)))',
        },
      }}
    >
      <Container size="3">
        <Box css={{ mb: '$6' }}>
          <Text
            as="h1"
            size={{ '@initial': 8, '@bp1': 9 }}
            css={{
              color: '$hiContrast',
              WebkitBackgroundClip: 'text',
              // Use padding rather than margin, or otherwise some descenders
              // may be clipped with WebkitBackgroundClip: 'text'
              pb: '$4',
              // Same issue, letters may be clipped horizontally
              px: '$2',
              mx: '-$2',
              fontFamily: 'Krona One, sans-serif',
              fontWeight: 500,
              fontSize: 'min(max($7, 10vw), $8)',
              letterSpacing: 'max(min(-0.055em, 0.66vw), -0.07em)',
              '@media (min-width: 900px) and (min-height: 850px)': {
                fontSize: '60px',
                lineHeight: '1.16',
              },
            }}
          >
            Play games,
            <br />
            get
            <Text
              as="span"
              size={{ '@initial': 8, '@bp1': 9 }}
              css={{
                color: 'transparent',
                display: 'inline-block',
                WebkitBackgroundClip: 'text',
                backgroundImage: 'linear-gradient(180deg, $orange10, $red10)',
                // Use padding rather than margin, or otherwise some descenders
                // may be clipped with WebkitBackgroundClip: 'text'
                fontWeight: 500,
                ml: '$2',
                lineHeight: '1.6',
                fontSize: 'min(max($7, 10vw), $8)',
                letterSpacing: 'max(min(-0.055em, 0.66vw), -0.07em)',
                '@media (min-width: 900px) and (min-height: 850px)': {
                  fontSize: '70px',
                  lineHeight: '1.16',
                  ml: '$4',
                },
              }}
            >
              Bounti.
            </Text>
            <br />
          </Text>
          <Box css={{ maxWidth: 470, mb: '$5' }}>
            <Paragraph size="2" as="p">
              Get paid for completing bounties and promoting video games. Help beta test and
              influence upcoming games.
            </Paragraph>
          </Box>
          <NextLink href="/docs/primitives/overview/getting-started" passHref>
            <MarketingButton as="a" icon={ArrowRightIcon}>
              Start Earning
            </MarketingButton>
          </NextLink>
        </Box>
      </Container>

      <Box css={{ position: 'relative' }}>
        <Carousel>
          <CarouselSlideList
            css={{
              display: 'grid',
              gridAutoFlow: 'column',
              gridAutoColumns: 'min-content',
              ox: 'auto',
              oy: 'hidden',
              py: '$1',
              WebkitOverflowScrolling: 'touch',

              // Gap between slides
              $$gap: '$space$5',

              // calculate the left padding to apply to the scrolling list
              // so that the carousel starts aligned with the container component
              // the "1145" and "$5" values comes from the <Container /> component
              '$$scroll-padding': 'max($$gap, calc((100% - 1145px) / 2 + $$gap))',
              pl: '$$scroll-padding',

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
            <CarouselSlide>
              <FocusArea
                aria-label="Dialog component demo"
                onKeyDown={onFocusAreaKeyDown}
                onFocus={onFocusAreaFocus}
              >
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
                  src="https://lockpick.games/wp-content/uploads/2022/02/Game-Covers-01-1.png"
                />
              </FocusArea>
              <GrabBox>
                <Text as="h3" size="3" css={{ fontWeight: 500, lineHeight: '25px' }}>
                  Marble Mansion
                </Text>
                <Text as="p" size="3" variant="gray" css={{ lineHeight: '23px' }}>
                  A classic adventure game covering questions and subject matter from the NSW
                  Selective Schools preparation tests. It follows the engaging storyline of a new
                  student at Marblatts School of Magic and incorporates turn-based strategy game
                  play.
                </Text>
              </GrabBox>
            </CarouselSlide>
            <CarouselSlide>
              <FocusArea
                aria-label="Dialog component demo"
                onKeyDown={onFocusAreaKeyDown}
                onFocus={onFocusAreaFocus}
              >
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
                  src="https://images.squarespace-cdn.com/content/v1/5b08e7d2620b85adeb56fa76/1646361682714-KF48CFU7PPAZK9H33KF6/Screenshot-01.png?format=2500w"
                />
              </FocusArea>
              <GrabBox>
                <Text as="h3" size="3" css={{ fontWeight: 500, lineHeight: '25px' }}>
                  Krut: The Mythic Wings
                </Text>
                <Text as="p" size="3" variant="gray" css={{ lineHeight: '23px' }}>
                  In a world full of mystical creatures and magic, the ruthless army of the Ogre
                  invaded the land of the Garuda race. The Garuda army was defeated and the capital
                  city was eventually fallen. Upon the destruction and despair, a badly wounded
                  warrior found himself on a mysterious enchanted island called Himmaphan.
                </Text>
              </GrabBox>
            </CarouselSlide>
            <CarouselSlide>
              <FocusArea
                aria-label="Dialog component demo"
                onKeyDown={onFocusAreaKeyDown}
                onFocus={onFocusAreaFocus}
              >
                <Image
                  css={{
                    objectFit: 'cover',
                    width: '500px',
                    maxWidth: '90vw',
                    objectPosition: 'top center',
                    height: '100%',
                    aspectRatio: 16 / 9,
                    pb: '$4',
                    borderRadius: '5px',
                    paddingBottom: '2px',
                    marginBottom: '$4',
                  }}
                  src="https://miro.medium.com/max/1400/1*eax0YZCqUYchI7f7Lp7now.jpeg"
                />
              </FocusArea>
              <GrabBox>
                <Text as="h3" size="3" css={{ fontWeight: 500, lineHeight: '25px' }}>
                  Zed Run
                </Text>
                <Text as="p" size="3" variant="gray" css={{ lineHeight: '23px' }}>
                  The future of digital racehorse ownership is here. Race your way to the top and
                  build your legacy today.
                </Text>
              </GrabBox>
            </CarouselSlide>
            <CarouselSlide>
              <FocusArea
                aria-label="Dialog component demo"
                onKeyDown={onFocusAreaKeyDown}
                onFocus={onFocusAreaFocus}
              >
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
                  src="https://pbs.twimg.com/media/EG_2kLTWkAABbQ8.jpg"
                />
              </FocusArea>
              <GrabBox>
                <Text as="h3" size="3" css={{ fontWeight: 500, lineHeight: '25px' }}>
                  Ember Sword
                </Text>
                <Text as="p" size="3" variant="gray" css={{ lineHeight: '23px' }}>
                  Ember Sword is a modern Free-to-Play MMORPG with a player-driven economy, a
                  classless combat system, and scarce, tradable cosmetic collectibles
                </Text>
              </GrabBox>
            </CarouselSlide>
          </CarouselSlideList>

          <Box
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
          </Box>
          <Box
            css={{
              position: 'absolute',
              top: 'calc(50% - $7)',
              right: '15px',
            }}
          >
            <CarouselNext aria-label="Show next demo" tabIndex={-1} as={CarouselArrowButton}>
              <ArrowRightIcon />
            </CarouselNext>
          </Box>
        </Carousel>
      </Box>
    </Section>
  );
};

const CarouselArrowButton = styled('button', {
  unset: 'all',
  outline: 0,
  margin: 0,
  border: 0,
  padding: 0,

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

  // Fill in spaces between slides
  mr: '-$$gap',
  pr: '$$gap',
});
