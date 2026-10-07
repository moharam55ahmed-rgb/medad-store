import { Link } from "react-router-dom";
import { IconChevron } from "./Icons";

type Props = {
  title: string;
  kicker?: string;
  action?: string;
  href?: string;
};

export function SectionTitle({ title, kicker, action, href }: Props) {
  return (
    <div className="section-head">
      <div className="section-title">
        <h2>{title}</h2>
        {kicker ? <p>{kicker}</p> : null}
      </div>
      {action ? (
        <Link className="see-all" to={href ?? "/shop"}>
          {action}
          <IconChevron dir="left" />
        </Link>
      ) : null}
    </div>
  );
}
