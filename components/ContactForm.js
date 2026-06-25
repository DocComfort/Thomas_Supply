"use client";
import { useState } from "react";

const STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL","IN",
  "KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ",
  "NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA",
  "WI","WV","WY",
];

const EMPTY = {
  name: "", email: "", phone: "", address: "", city: "", state: "LA",
  message: "", company: "", // company = honeypot
};

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("sent");
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="card" role="status" style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: "2.4rem", lineHeight: 1 }}>✅</div>
        <h3 style={{ marginTop: 14 }}>Thanks — we got your message</h3>
        <p style={{ color: "var(--muted)", margin: "0 auto 20px", maxWidth: "40ch" }}>
          A team member will be in touch soon. Need something today? Call your
          nearest branch and we&apos;ll help right away.
        </p>
        <button className="btn btn-outline" onClick={() => setStatus("idle")}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="card" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        {/* Honeypot — hidden from real users */}
        <input
          type="text" name="company" value={form.company} onChange={update}
          tabIndex={-1} autoComplete="off"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
          aria-hidden="true"
        />
        <div className="full">
          <label htmlFor="name">Name *</label>
          <input id="name" name="name" type="text" value={form.name} onChange={update} required />
        </div>
        <div>
          <label htmlFor="email">Email address *</label>
          <input id="email" name="email" type="email" value={form.email} onChange={update} required />
        </div>
        <div>
          <label htmlFor="phone">Phone</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={update} />
        </div>
        <div className="full">
          <label htmlFor="address">Address</label>
          <input id="address" name="address" type="text" value={form.address} onChange={update} />
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input id="city" name="city" type="text" value={form.city} onChange={update} />
        </div>
        <div>
          <label htmlFor="state">State</label>
          <select id="state" name="state" value={form.state} onChange={update}>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="full">
          <label htmlFor="message">Message *</label>
          <textarea id="message" name="message" value={form.message} onChange={update} required />
        </div>

        {status === "error" && (
          <div className="full" role="alert" style={{ color: "#b42318", fontWeight: 600 }}>
            {error}
          </div>
        )}

        <div className="full">
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send message"}
          </button>
        </div>
      </div>
    </form>
  );
}
