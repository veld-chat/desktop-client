import { spacing } from "./spacing";

const largeSizes = {
  max: "max-content",
  min: "min-content",
  full: "100%",
};

const sizes = {
  ...spacing,
  ...largeSizes,
};

/**
 * @deprecated
 * You can derive the Sizes type from the DefaultChakraTheme
 *
 * type Sizes = DefaultChakraTheme['sizes']
 */
export type Sizes = typeof spacing & typeof largeSizes;

export default sizes;
