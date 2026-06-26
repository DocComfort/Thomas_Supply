"use client";
import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const dealerPortalUrl =
    process.env.NEXT_PUBLIC_DEALER_PORTAL_URL || "http://localhost:3010/login";
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/locations", label: "Locations" },
    { href: "/brands", label: "Brands" },
    { href: "/contact", label: "Contact" },
  ];
  return (
    <header className="site-header">
      <nav className="nav">
        <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label="Thomas Supply home">
          <img
            src="/logo.png"
            alt="Thomas Supply — Cooling, Heating, Refrigeration"
            height={48}
          />
        </Link>
        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span></span><span></span><span></span>
        </button>
        <ul className={`nav-links ${open ? "open" : ""}`}>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/locations" className="nav-cta" onClick={() => setOpen(false)}>
              Find a branch
            </Link>
          </li>
          <li>
            <a href={dealerPortalUrl} className="nav-cta nav-portal" onClick={() => setOpen(false)}>
              Dealer Portal
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
