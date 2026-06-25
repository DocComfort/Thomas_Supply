import data from "./licenses.generated.json";
import { LICENSE_TEXTS } from "./license-texts";

export const metadata = {
  title: "Open Source Licenses — Thomas Supply Inc.",
  description:
    "Open source software and license attributions for the Thomas Supply website and dealer portal.",
};

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export default function LicensesPage() {
  return (
    <>
      <section className="page-head">
        <div className="container">
          <h1>Open Source Licenses</h1>
          <p>The open source software that helps power Thomas Supply.</p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 860 }}>
          <p className="lead">
            Our website and dealer portal are built with the help of open
            source software. We&apos;re grateful to the developers and
            communities behind these projects. The libraries we distribute are
            listed below, grouped by their license.
          </p>

          <p className="license-meta">
            Last updated {formatDate(data.generatedAt)} &middot;{" "}
            {data.totalPackages} packages &middot; {data.licenseCount} license
            types &middot; {data.scope}
          </p>

          {data.groups.map((group) => {
            const info = LICENSE_TEXTS[group.license] || null;
            const heading = info?.name || group.license;
            const body = info?.text || info?.summary || null;
            return (
              <details className="faq license-group" key={group.license}>
                <summary>
                  {heading}
                  <span className="license-count">{group.count}</span>
                </summary>

                <ul className="license-pkgs">
                  {group.packages.map((p) => (
                    <li key={`${p.name}@${p.version}`}>
                      <code>{p.name}</code>
                      <span className="license-ver">{p.version}</span>
                    </li>
                  ))}
                </ul>

                {body ? <pre className="license-text">{body}</pre> : null}

                {info?.url ? (
                  <p className="license-link">
                    Full license text:{" "}
                    <a href={info.url} target="_blank" rel="noopener noreferrer">
                      {info.url}
                    </a>
                  </p>
                ) : null}
              </details>
            );
          })}

          <p className="license-note">
            This page is generated from the project&apos;s dependency lockfile;
            license identifiers follow the{" "}
            <a
              href="https://spdx.org/licenses/"
              target="_blank"
              rel="noopener noreferrer"
            >
              SPDX
            </a>{" "}
            standard. Copyright for each package remains with its respective
            authors. If you believe an attribution is missing or incorrect,
            please <a href="/contact">get in touch</a>.
          </p>
        </div>
      </section>
    </>
  );
}
