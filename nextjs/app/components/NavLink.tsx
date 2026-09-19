"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

// The nav sits in a persistent layout, so Next only scrolls on navigation when
// the new page's top edge is off-screen, which ignores the sticky header.
// Scroll once the new route commits rather than on click: Next pushes the
// history entry first, so the browser keeps the old position for Back.
// Shared across links so a later click or Back/Forward cancels an earlier one.
let pendingHref: string | null = null;

export default function NavLink(
  props: React.ComponentProps<typeof Link> & { href: string },
) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pendingHref === pathname) window.scrollTo(0, 0);
    pendingHref = null;
  }, [pathname]);

  useEffect(() => {
    const cancel = () => {
      pendingHref = null;
    };
    window.addEventListener("popstate", cancel);
    return () => window.removeEventListener("popstate", cancel);
  }, []);

  return (
    <Link
      {...props}
      onNavigate={() => {
        if (props.href === pathname) {
          pendingHref = null;
          window.scrollTo(0, 0);
        } else {
          pendingHref = props.href;
        }
      }}
    />
  );
}
