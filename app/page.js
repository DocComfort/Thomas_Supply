import Link from "next/link";
import { company, locations, fastPartsBrands, brandLogos, partnerLogos } from "@/app/data";
import BrandLogo from "@/components/BrandLogo";

export default function Home() {
  return (
    <>
      {/* HERO — leads with the contractor's job: get parts, locally, in stock */}
      <section className="hero">
        <div className="container">
          <span className="badge">🏆 {company.award}</span>
          <h1>HVAC parts &amp; equipment, in stock across South Louisiana &amp; Southeast Texas</h1>
          <p>
            Six branches stocking hundreds of OEM Fast Parts, KeepRite equipment,
            and the brands you count on — so the part you need is close by when
            the job can&apos;t wait.
          </p>
          <div className="hero-actions">
            <Link href="/locations" className="btn btn-primary">Find your nearest branch</Link>
            <a href="tel:337-433-4086" className="btn btn-ghost">Call Lake Charles: 337-433-4086</a>
          </div>
          <div className="hero-stats">
            <div><div className="num">6</div><div className="lbl">Branch locations</div></div>
            <div><div className="num">Since 1979</div><div className="lbl">Serving HVAC pros</div></div>
            <div><div className="num">35+ yrs</div><div className="lbl">ICP / KeepRite dealer</div></div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="section">
        <div className="container">
          <div className="grid grid-3">
            <div className="card">
              <h3>About us</h3>
              <p>
                Family-built since 1979 with one standard — be #1 in customer
                service. Decades of HVACR know-how behind every counter.
              </p>
              <Link href="/about" className="arrow">Learn more →</Link>
            </div>
            <div className="card">
              <h3>Our locations</h3>
              <p>
                Six branches serving air conditioning and refrigeration needs
                throughout South Louisiana and Southeast Texas.
              </p>
              <Link href="/locations" className="arrow">Find a branch →</Link>
            </div>
            <div className="card">
              <h3>Our brands</h3>
              <p>
                A huge selection of trusted brands — from compressors and motors
                to controls, filters, and refrigeration.
              </p>
              <Link href="/brands" className="arrow">Browse brands →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPMENT / VALUE */}
      <section className="section section-soft">
        <div className="container">
          <p className="eyebrow">Your #1 source for HVAC parts &amp; equipment</p>
          <div className="grid grid-2" style={{ alignItems: "start" }}>
            <div>
              <h2>The right product, ready when you need it</h2>
              <p className="lead">
                Your distributor should always have the part on the shelf. We
                stock deep so you spend less time chasing parts and more time on
                the job.
              </p>
              <img
                src="/photos/warehouse.svg"
                alt="In-stock HVAC parts and equipment"
                style={{ width: "100%", borderRadius: 12, marginTop: 22, border: "1px solid var(--line)" }}
              />
            </div>
            <div className="card">
              <h3>KeepRite equipment</h3>
              <p>
                A proud member of the Carrier family. As a dedicated ICP dealer
                for 35+ years, we stock up to 19 SEER variable-speed and
                communicating equipment.
              </p>
              <h3 style={{ marginTop: 22 }}>OEM Fast Parts</h3>
              <p>
                Hundreds of OEM Fast Parts in stock for: {fastPartsBrands.join(", ")}.
              </p>
              <div className="partner-row" style={{ marginTop: 18 }}>
                {partnerLogos.map((b) => (
                  <BrandLogo key={b.name} name={b.name} file={b.file} height={36} />
                ))}
              </div>
            </div>
          </div>

          <h3 style={{ marginTop: 48, marginBottom: 16 }}>Brands we stock</h3>
          <div className="logo-grid">
            {brandLogos.map((b) => (
              <BrandLogo key={b.name} name={b.name} file={b.file} />
            ))}
          </div>
          <p style={{ marginTop: 18 }}>
            <Link href="/brands" className="arrow">View the full brand directory →</Link>
          </p>
        </div>
      </section>

      {/* QUICK BRANCH STRIP */}
      <section className="section">
        <div className="container">
          <h2>HVAC parts and equipment near you</h2>
          <p className="lead" style={{ marginBottom: 32 }}>
            Six locations across South Louisiana and Southeast Texas. Call ahead
            and we&apos;ll confirm the part is on the shelf before you drive over.
          </p>
          <div className="grid grid-3">
            {locations.map((loc) => (
              <div className="card loc-card" key={loc.name}>
                {loc.comingSoon && <span className="pill">Coming soon</span>}
                <h3>{loc.city.split(",")[0]}</h3>
                {loc.phone && (
                  <a className="phone" href={`tel:${loc.phone}`}>{loc.phone}</a>
                )}
                <address>
                  {loc.street}<br />
                  {loc.city}
                </address>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — replaced circular questions with what contractors actually ask */}
      <section className="section section-soft">
        <div className="container" style={{ maxWidth: 820 }}>
          <h2 style={{ textAlign: "center" }}>Questions HVAC pros ask us</h2>
          <p className="lead" style={{ textAlign: "center", margin: "0 auto 36px" }}>
            The practical stuff, up front.
          </p>

          <details className="faq">
            <summary>What are your branch hours?</summary>
            <p>{company.hours} — hours can vary by branch, so check your local branch on the Locations page. <em>(Update this in app/data.js.)</em></p>
          </details>

          <details className="faq">
            <summary>Can you check if a part is in stock before I drive over?</summary>
            <p>Yes — call your nearest branch and we&apos;ll confirm availability and pull it for will-call pickup so it&apos;s ready when you arrive.</p>
          </details>

          <details className="faq">
            <summary>Do you carry OEM equipment and parts?</summary>
            <p>We stock hundreds of OEM Fast Parts for {fastPartsBrands.join(", ")}, plus KeepRite equipment up to 19 SEER and a full directory of HVACR brands.</p>
          </details>

          <details className="faq">
            <summary>Do I have to be an account holder to buy?</summary>
            <p>Reach out and our team will walk you through setting up an account and the benefits of working with Thomas Supply. <a href="/contact">Contact us</a> to get started.</p>
          </details>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="section cta-band">
        <div className="container">
          <h2>Need a part today?</h2>
          <p>Find your nearest branch and call ahead — we&apos;ll have it ready for pickup.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/locations" className="btn btn-primary">Find your branch</Link>
            <Link href="/contact" className="btn btn-ghost">Contact us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
