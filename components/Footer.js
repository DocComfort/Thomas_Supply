import Link from "next/link";
import { company, locations } from "@/app/data";

export default function Footer() {
  const dealerPortalUrl =
    process.env.NEXT_PUBLIC_DEALER_PORTAL_URL || "http://localhost:3010/login";

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <img src="/logo-white.svg" alt="Thomas Supply" height={42} style={{ marginBottom: 14 }} />
            <p style={{ color: "#c7d6e6", maxWidth: "34ch" }}>
              Your local source for HVAC parts and equipment across South
              Louisiana and Southeast Texas since 1979.
            </p>
            <p style={{ marginTop: 14 }}>
              <a href={company.facebook} target="_blank" rel="noopener noreferrer">
                Follow us on Facebook →
              </a>
            </p>
          </div>
          <div>
            <h4>Company</h4>
            <p style={{ margin: "0 0 8px" }}><Link href="/about">About Us</Link></p>
            <p style={{ margin: "0 0 8px" }}><Link href="/locations">Locations</Link></p>
            <p style={{ margin: "0 0 8px" }}><Link href="/brands">Brands</Link></p>
            <p style={{ margin: "0 0 8px" }}><Link href="/contact">Contact</Link></p>
            <p style={{ margin: "0 0 8px" }}><a href={dealerPortalUrl}>Dealer Portal</a></p>
            <p style={{ margin: 0 }}><Link href="/legal/licenses">Open Source Licenses</Link></p>
          </div>
          <div>
            <h4>Branches</h4>
            <div className="footer-locs">
              {locations.map((loc) => (
                <div key={loc.name}>
                  <strong style={{ color: "#fff", display: "block", fontSize: ".88rem" }}>
                    {loc.city.split(",")[0]}
                  </strong>
                  {loc.phone ? (
                    <a href={`tel:${loc.phone}`}>{loc.phone}</a>
                  ) : (
                    <span style={{ color: "#9fb6cd" }}>Coming soon</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Thomas Supply Inc. All rights reserved.</span>
          <span>{company.award}</span>
        </div>
      </div>
    </footer>
  );
}
