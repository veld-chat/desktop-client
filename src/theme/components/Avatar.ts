import { isDark, mode, randomColor } from "@chakra-ui/theme-tools";
import themeSizes from "../foundations/sizes";

const parts = ["container", "excessLabel", "badge", "label"];

function baseStyleBadge(props: Record<string, any>) {
  return {
    transform: `unset`,
    borderRadius: "full",
    border: "2px solid",
    borderColor: mode("white", "background.darkSecondary")(props),
  };
}

function baseStyleExcessLabel(props: Record<string, any>) {
  return {
    bg: mode("gray.200", "whiteAlpha.400")(props),
  };
}

function baseStyleContainer(props: Record<string, any>) {
  const { name, theme } = props;
  const bg = name ? randomColor({ string: name }) : "gray.400";
  const isBgDark = isDark(bg)(theme);

  let color = "white";
  if (!isBgDark) color = "gray.800";

  const borderColor = mode("white", "dark.80")(props);

  return {
    bg,
    color,
    borderColor,
    verticalAlign: "top",
  };
}

const baseStyle = (props: Record<string, any>) => ({
  badge: baseStyleBadge(props),
  excessLabel: baseStyleExcessLabel(props),
  container: baseStyleContainer(props),
});

function getSize(size: string) {
  const themeSize = themeSizes[size];
  return {
    container: {
      width: size,
      height: size,
      fontSize: `calc(${themeSize ?? size} / 2.5)`,
    },
    excessLabel: {
      width: size,
      height: size,
    },
    label: {
      fontSize: `calc(${themeSize ?? size} / 2.5)`,
      lineHeight: size !== "100%" ? themeSize ?? size : undefined,
    },
  };
}

const sizes = {
  sm: getSize("24"),
  md: getSize("32"),
  lg: getSize("48"),
};

const defaultProps = {
  size: "md",
};

export default {
  parts,
  baseStyle,
  sizes,
  defaultProps,
};
