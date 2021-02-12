import styled from '@emotion/styled'

const HoverAnimationWrapper = styled('a')`
  /* Important required since chakra styles are added after this line */
  animation-play-state: paused !important;
  :hover {
    animation-play-state: running !important;
  }
`

export default HoverAnimationWrapper
