import { Typography, TypographyProps } from '@mui/material'
import { forwardRef } from 'react'

function createTypographyComponent(variant: TypographyProps['variant']) {
  return forwardRef<HTMLElement, Omit<TypographyProps, 'variant'>>(
    (props, ref) => <Typography variant={variant} ref={ref} {...props} />,
  )
}

export const Body1 = createTypographyComponent('body1')
export const Body2 = createTypographyComponent('body2')
export const H1 = createTypographyComponent('h1')
export const H2 = createTypographyComponent('h2')
export const H3 = createTypographyComponent('h3')
export const H4 = createTypographyComponent('h4')
export const H5 = createTypographyComponent('h5')
export const H6 = createTypographyComponent('h6')
export const Subtitle1 = createTypographyComponent('subtitle1')
export const Subtitle2 = createTypographyComponent('subtitle2')
export const Caption = createTypographyComponent('caption')
export const Overline = createTypographyComponent('overline')
