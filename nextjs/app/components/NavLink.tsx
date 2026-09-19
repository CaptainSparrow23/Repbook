"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

// The nav sits in a persistent layout, so Next only scrolls on navigation when
// the new page's top edge is off-screen, which ignores the sticky header.
// Scroll once the new route commits rather than on click: Next pushes the
// history entry first, so the browser keeps the old position for Back.
export default function NavLink(props: React.ComponentProps<typeof Link>) {
  const pathname = usePathname();
  const scrollPending = useRef(false);

  useLayoutEffect(() => {
    if (!scrollPending.current) return;
    scrollPending.current = false;
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Link
      {...props}
      onNavigate={() => {
        if (props.href === pathname) window.scrollTo(0, 0);
        else scrollPending.current = true;
      }}
    />
  );
}
