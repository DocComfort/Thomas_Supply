import Link from "next/link";
import { brandDirectory, fastPartsBrands, brandLogos, partnerLogos } from "@/app/data";
import BrandLogo from "@/components/BrandLogo";

export const metadata = {
  title: "Our Brands — Thomas Supply Inc.",
  description:
    "Browse the full directory of HVAC and refrigeration brands stocked at Thomas Supply — from compressors and motors to controls, filters, and refrigeration.",
};

export default function Brands() {
  const letters = Object.keys(brandDirectory);
  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Our brands</h1>
          <p>A huge selection of trusted brands to fit every HVAC need.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card" style={{ marginBottom: 36, background: "var(--bg-soft)" }}>
            <h3 style={{ marginTop: 0 }}>OEM Fast Parts</h3>
            <p style={{ marginBottom: 0 }}>
              We stock hundreds of OEM Fast Parts for: {fastPartsBrands.join(", ")}.
            </p>
          </div>

          <h2 style={{ marginBottom: 16 }}>Featured brands</h2>
          <div className="logo-grid" style={{ marginBottom: 22 }}>
            {brandLogos.map((b) => (
              <BrandLogo key={b.name} name={b.name} file={b.file} />
            ))}
          </div>
          <div className="partner-row" style={{ marginBottom: 40 }}>
            {partnerLogos.map((b) => (
              <BrandLogo key={b.name} name={b.name} file={b.file} height={36} />
            ))}
          </div>

          <p className="eyebrow">Browse by letter</p>
          <div className="alpha-nav">
            {letters.map((L) => (
              <a key={L} href={`#${L}`}>{L}</a>
            ))}
          </div>

          {letters.map((L) => (
            <div className="letter-block" id={L} key={L}>
              <h3>{L}</h3>
              <ul className="brand-cols">
                {brandDirectory[L].map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ marginTop: 30 }}>
            <p className="lead" style={{ marginBottom: 18 }}>
              Don&apos;t see what you&apos;re looking for? We carry more than what&apos;s
              listed here — just ask.
            </p>
            <Link href="/contact" className="btn btn-primary">Ask about a brand</Link>
          </div>
        </div>
      </section>
    </>
  );
}
