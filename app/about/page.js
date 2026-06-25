import Link from "next/link";

export const metadata = {
  title: "About Us — Thomas Supply Inc.",
  description:
    "Thomas Supply opened in 1979 in Lake Charles, Louisiana with one standard — to be #1 in customer service. Six branches across South Louisiana and Southeast Texas.",
};

export default function About() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>About Thomas Supply</h1>
          <p>Built on customer service since 1979.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 780 }}>
          <p className="lead">
            Thomas Supply opened in January of 1979 in Lake Charles, Louisiana
            with one standard — to be #1 in customer service. More than 40 years
            later, that&apos;s still the reputation we work to earn every day.
          </p>
          <p>
            We have six locations dedicated to serving your air conditioning and
            refrigeration needs throughout South Louisiana and Southeast Texas.
            As a wholesale distributor, Thomas Supply prides itself on
            distributing quality equipment, parts, and materials — and we&apos;ve
            been fortunate to team with some of the most knowledgeable and
            courteous contractors in the HVACR market.
          </p>
          <p>
            The Thomas Supply team is the industry standard for experience. Each
            of our six locations has over 60 years of combined experience behind
            the counter, and each of our six management teams has been in place
            at Thomas Supply for over 20 years.
          </p>

          <div className="grid grid-3" style={{ margin: "40px 0" }}>
            <div className="card"><div className="num" style={{ fontSize: "2rem", fontWeight: 800, color: "var(--navy)" }}>1979</div><div style={{ color: "var(--muted)" }}>Founded in Lake Charles</div></div>
            <div className="card"><div className="num" style={{ fontSize: "2rem", fontWeight: 800, color: "var(--navy)" }}>6</div><div style={{ color: "var(--muted)" }}>Branch locations</div></div>
            <div className="card"><div className="num" style={{ fontSize: "2rem", fontWeight: 800, color: "var(--navy)" }}>20+ yrs</div><div style={{ color: "var(--muted)" }}>Avg. management tenure</div></div>
          </div>

          <img
            src="/photos/storefront.svg"
            alt="Thomas Supply"
            style={{ width: "100%", borderRadius: 12, margin: "8px 0 36px", border: "1px solid var(--line)" }}
          />

          <h2>Proud of our Gulf Coast home</h2>
          <p>
            We&apos;re proud of our South Louisiana and Southeast Texas home. Our
            team enjoys hunting, fishing, mule riding, and college sports. Each
            October we host the Thomas Supply Fishing Rodeo for friends, family,
            and customers at Hebert&apos;s Landing on Calcasieu Lake — where the
            top prize is named in honor of our founder, Bill Thomas.
          </p>

          <div style={{ marginTop: 34 }}>
            <Link href="/contact" className="btn btn-primary">Get in touch</Link>
          </div>
        </div>
      </section>
    </>
  );
}
