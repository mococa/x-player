import { HTMLAttributes } from "nullstack";
import "./styles.scss";
import { BottomNavigator } from "_common/components/BottomNavigator";

interface Props extends HTMLAttributes<HTMLElement> {
  page_title: string;
  hide_bottomnav?: boolean;
}

export const MainTemplate = ({
  page_title,
  hide_bottomnav,
  children,
  ...props
}: Props) => (
  <main {...props} class="main-template">
    <h1># {page_title}</h1>

    {children}

    {!hide_bottomnav && <BottomNavigator />}
  </main>
);
