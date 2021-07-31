import { getColor, mode, transparentize } from "@chakra-ui/theme-tools"

const baseStyle = {
  px: "4",
  py: "2",
  textTransform: "uppercase",
  fontSize: "xs",
  borderRadius: "sm",
  fontWeight: "bold",
}

function variantSolid(props: Record<string, any>) {
  const { colorScheme: c, theme } = props
  const dark = transparentize(`${c}.500`, 0.6)(theme)
  return {
    bg: mode(`${c}.500`, dark)(props),
    color: mode(`white`, `whiteAlpha.800`)(props),
  }
}

const variants = {
  solid: variantSolid,
}

const defaultProps = {
  variant: "subtle",
  colorScheme: "gray",
}

export default {
  baseStyle,
  variants,
  defaultProps,
}