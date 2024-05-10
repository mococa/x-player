import { HTMLAttributes } from "nullstack";
import "./styles.scss";
import { Assets } from "_Assets";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  icon?: boolean;
  secondary?: boolean;
  loading?: boolean;
}

export const Button = ({
  icon,
  secondary,
  children,
  class: className,
  loading,
  ...props
}: Props) => (
  <button
    class={[
      "button",
      icon && "icon",
      secondary && "secondary",
      String(className || ""),
    ].filter(Boolean)}
    disabled={loading || props.disabled}
    data-loading={loading ? "true" : "false"}
    {...props}
  >
    <div class="loader">
      <Assets.Loader />
    </div>

    {children}
  </button>
);
