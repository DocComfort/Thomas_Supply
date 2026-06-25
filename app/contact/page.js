import { locations } from "@/app/data";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us — Thomas Supply Inc.",
  description:
    "Call your nearest Thomas Supply branch or send us a message. Six locations across South Louisiana and Southeast Texas.",
};

export default function Contact() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Contact us</h1>
          <p>Call your branch directly, or send a message and we&apos;ll get back to you.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: "start", gap: 48 }}>
            <div>
              <h2>Call a branch</h2>
              <p className="lead" style={{ marginBottom: 24 }}>
                For stock checks and orders, calling your local branch is fastest.
              </p>
              <div className="grid" style={{ gap: 14 }}>
                {locations.map((loc) => (
                  <div className="card loc-card" key={loc.name} style={{ padding: 18 }}>
                    {loc.comingSoon && <span className="pill">Coming soon</span>}
                    <h3 style={{ fontSize: "1.05rem", marginBottom: 4 }}>{loc.name}</h3>
                    {loc.phone ? (
                      <a className="phone" href={`tel:${loc.phone}`}>{loc.phone}</a>
                    ) : (
                      <span style={{ color: "var(--muted)" }}>Opening soon</span>
                    )}
                    <address style={{ marginTop: 4 }}>
                      {loc.street}, {loc.city}
                    </address>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2>Send a message</h2>
              <p className="lead" style={{ marginBottom: 24 }}>
                Fill out the form and we&apos;ll be in touch as soon as we can.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
