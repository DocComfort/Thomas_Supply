import Link from "next/link";
import { locations, company } from "@/app/data";

export const metadata = {
  title: "Our Locations — Thomas Supply Inc.",
  description:
    "Six Thomas Supply branches across South Louisiana and Southeast Texas: Lake Charles, Alexandria, Lafayette, Beaumont, and Baton Rouge.",
};

export default function Locations() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Our locations</h1>
          <p>Six branches serving South Louisiana &amp; Southeast Texas.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="lead" style={{ marginBottom: 32 }}>
            Call ahead and we&apos;ll confirm your part is in stock and pull it for
            will-call pickup. Typical hours: {company.hours}.
          </p>
          <div className="grid grid-3">
            {locations.map((loc) => (
              <div className="card loc-card" key={loc.name}>
                {loc.comingSoon && <span className="pill">Coming soon</span>}
                <h3>{loc.name}</h3>
                {loc.phone ? (
                  <a className="phone" href={`tel:${loc.phone}`}>{loc.phone}</a>
                ) : (
                  <span className="phone" style={{ color: "var(--muted)" }}>Opening soon</span>
                )}
                <address style={{ marginTop: 8 }}>
                  {loc.street}<br />
                  {loc.city}
                </address>
                <p style={{ marginTop: 14, marginBottom: 0 }}>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      loc.street + ", " + loc.city
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="arrow"
                  >
                    Get directions →
                  </a>
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40 }}>
            <Link href="/contact" className="btn btn-outline">Send us a message</Link>
          </div>
        </div>
      </section>
    </>
  );
}
