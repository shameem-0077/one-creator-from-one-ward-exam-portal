"use client";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
// import Lottie from "lottie-react";
import loadingAnimation from "../../../public/assets/loader/loader.json";

type ButtonSize = "sm" | "md" | "lg" | "xl" | "2xl";
type ButtonState = "default" | "focused" | "disabled";
type ButtonType =
  | "primary"
  | "secondary"
  | "tertiary"
  | "link-gray"
  | "link-color";
                                                                                  
type CommonButtonProps = {
  size?: ButtonSize;
  state?: ButtonState;
  className?: string;
  loading?: boolean;
};

type DefaultButtonProps = CommonButtonProps & {
  icon: "default";
  buttonType?: ButtonType;
  text: string;
  iconImg?: string;
  iconPlacement?: "start" | "end";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "submit" | "button" | "reset";
} & (
    | { iconImg: string; iconPlacement: "start" | "end" }
    | { iconImg?: never; iconPlacement?: never }
  );

type DotLeadingButtonProps = CommonButtonProps & {
  icon: "dot-leading";
  buttonType?: ButtonType;
  text: string;
  iconImg?: never;
  iconPlacement?: never;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "submit" | "button" | "reset";
};

type IconOnlyButtonProps = CommonButtonProps & {
  icon: "only";
  buttonType: "primary" | "secondary" | "tertiary";
  text?: never;
  iconImg: string;
  iconPlacement?: never;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "submit" | "button" | "reset";
};

type ButtonProps =
  | DefaultButtonProps
  | DotLeadingButtonProps
  | IconOnlyButtonProps;

const STYLES = {
  dot: {
    sizes: {
      sm: "w-[6px] h-[6px]",
      md: "w-[6px] h-[6px]",
      lg: "w-[8px] h-[8px]",
      xl: "w-[8px] h-[8px]",
      "2xl": "w-[10px] h-[10px]",
    },
    colors: {
      primary: "bg-[var(--color-primary-text)]",
      default: "bg-[var(--color-link-color)]",
      disabled: "bg-[var(--color-disabled-text)]",
    },
  },
  size: {
    sm: "py-[8px] px-[12px] text-[14px]",
    md: "py-[10px] px-[14px] text-[14px]",
    lg: "py-[10px] px-[16px] text-[16px]",
    xl: "py-[12px] px-[18px] text-[16px]",
    "2xl": "py-[16px] px-[22px] text-[18px]",
  },
  iconOnly: {
    sm: "p-[8px]",
    md: "p-[10px]",
    lg: "p-[12px]",
    xl: "p-[14px]",
    "2xl": "p-[16px]",
  },
  variant: {
    base: {
      primary: "text-[var(--color-primary-text)] border-[1px]",
      secondary:
        "text-[var(--color-secondary-text)] border-[1px] border-[var(--color-secondary-border)]",
      tertiary:
        "text-[var(--color-tertiary-text)] border-[1px] border-[var(--color-tertiary-border)]",
      "link-gray": "text-[var(--color-link-gray)]",
      "link-color": "text-[var(--color-link-color)]",
    },
    disabled: {
      primary: "text-[var(--color-disabled-text)] border-[1px]",
      secondary:
        "text-[var(--color-disabled-text)] border-[1px] border-[var(--color-disabled-border)]",
      tertiary:
        "text-[var(--color-disabled-text)] border-[1px] border-[var(--color-disabled-border)]",
      "link-gray": "text-[var(--color-disabled-text)]",
      "link-color": "text-[var(--color-disabled-text)]",
    },
    state: {
      primary: {
        default:
          "bg-[var(--color-primary-bg)] border-[var(--color-primary-border)]",
        hover:
          "bg-[var(--color-primary-focused-bg)] border-[var(--color-primary-focused-border)] shadow-custom",
        focused:
          "bg-[var(--color-primary-focused-bg)] border-[var(--color-primary-focused-border)]",
        disabled:
          "bg-[var(--color-disabled-bg)] border-[var(--color-disabled-border)] cursor-not-allowed shadow-custom",
      },
      secondary: {
        default: "bg-[var(--color-secondary-bg)]",
        hover: "bg-[var(--color-secondary-focused-bg)] shadow-custom",
        focused: "bg-[var(--color-secondary-focused-bg)]",
        disabled:
          "bg-[var(--color-secondary-bg)] cursor-not-allowed shadow-custom",
      },
      tertiary: {
        default: "bg-[var(--color-tertiary-bg)]",
        hover: "bg-[var(--color-tertiary-focused-bg)] shadow-custom",
        focused: "bg-[var(--color-tertiary-focused-bg)]",
        disabled:
          "bg-[var(--color-tertiary-bg)] cursor-not-allowed shadow-custom",
      },
      "link-gray": {
        default: "",
        hover: "",
        focused: "",
        disabled: "cursor-not-allowed",
      },
      "link-color": {
        default: "",
        hover: "",
        focused: "",
        disabled: "cursor-not-allowed",
      },
    },
  },
};

const Loader = () => (
  <Lottie
    animationData={loadingAnimation}
    loop={true}
    style={{ transform: "scale(1)", width: "100%", height: "100%" }}
    aria-label="Loading animation"
  />
);

const Button: React.FC<ButtonProps> = React.memo(
  ({
    size = "lg",
    buttonType = "primary",
    icon = "default",
    state = "default",
    text,
    className,
    onClick,
    iconImg,
    iconPlacement,
    loading = false,
    type = "button",
  }: ButtonProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const currentState =
      state === "disabled" ? "disabled" : isHovered ? "hover" : state;

    const buttonClasses = useMemo(() => {
      const isLink = buttonType === "link-color" || buttonType === "link-gray";
      const isDisabled = state === "disabled";

      const sizeClass =
        icon === "only"
          ? STYLES.iconOnly[size]
          : !isLink
          ? STYLES.size[size]
          : "";

      return cn(
        "flex items-center justify-center cursor-pointer rounded-[10px] font-semibold",
        sizeClass,
        isDisabled
          ? STYLES.variant.disabled[buttonType]
          : STYLES.variant.base[buttonType],
        STYLES.variant.state[buttonType][currentState],
        {
          "gap-[4px]": (size === "sm" || size === "md") && icon !== "only",
          "gap-[6px]": (size === "lg" || size === "xl") && icon !== "only",
          "gap-[10px]": size === "2xl" && icon !== "only",
        },
        className
      );
    }, [size, buttonType, icon, currentState, state, className]);

    const Icon = iconImg ? (
      <div className="w-[20px] h-[20px]">
        <img src={iconImg} alt="button-icon" />
      </div>
    ) : null;

    const Dot = (
      <div
        className={cn(
          "rounded-full",
          STYLES.dot.sizes[size],
          state === "disabled"
            ? STYLES.dot.colors.disabled
            : buttonType === "primary"
            ? STYLES.dot.colors.primary
            : STYLES.dot.colors.default
        )}
      />
    );

    const buttonProps = {
      className: cn(buttonClasses, "relative"),
      disabled: state === "disabled" || loading,
      onClick: state !== "disabled" && !loading ? onClick : undefined,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      "aria-label": icon === "only" ? text || "Button" : undefined,
      type: type,
    };

    const renderContent = () => {
      if (icon === "only") {
        return (
          <>
            <span className={cn({ invisible: loading })}>{Icon}</span>
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Loader />
              </span>
            )}
          </>
        );
      }

      if (icon === "dot-leading") {
        return (
          <>
            <span className={cn({ invisible: loading })}>{Dot}</span>
            <span className={cn({ invisible: loading })}>{text}</span>
            {loading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Loader />
              </span>
            )}
          </>
        );
      }

      return (
        <>
          <span className={cn({ invisible: loading })}>
            {iconPlacement === "start" && Icon}
          </span>
          <span className={cn({ invisible: loading })}>{text}</span>
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader />
            </span>
          )}
          <span className={cn({ invisible: loading })}>
            {iconPlacement === "end" && Icon}
          </span>
        </>
      );
    };

    return <button {...buttonProps}>{renderContent()}</button>;
  }
);

export default Button;
