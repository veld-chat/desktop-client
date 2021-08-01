export default {
  // The styles all button have in common
  baseStyle: {
    fontWeight: "bold",
    borderRadius: "base", // <-- border radius is same for all variants and sizes
    height: "0px",
    minHeight: "0px",
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "paragraph.small",
      px: "20", // <-- px is short for paddingLeft and paddingRight
      py: "4", // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: "paragraph.medium",
      px: "20", // <-- these values are tokens from the design system
      py: "4", // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  variants: {
    primary: {
      bg: "accent",
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
  },
};
