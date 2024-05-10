/* ---------- Styles ---------- */
import { HTMLAttributes } from "nullstack";
import "./styles.scss";

/* ---------- Interfaces ---------- */
interface Props extends HTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  input_type: "textarea" | "input";
  bind: string;
}

interface Bind {
  property: string | number;
  object: any;
}

export const Input = ({
  label,
  name,
  input_type,
  type,
  bind,
  ...props
}: Props) => {
  const b = bind as unknown as Bind;

  return (
    <label htmlFor={name} class="form-input" {...props}>
      <span>{label}</span>

      {input_type === "textarea" ? (
        <textarea
          name={name}
          bind={b}
          data-value={b?.object ? b.object[b.property] : ""}
        />
      ) : (
        <input
          name={name}
          bind={b}
          type={type}
          data-value={b?.object ? b.object[b.property] : ""}
        />
      )}
    </label>
  );
};
