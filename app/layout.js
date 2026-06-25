import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Thomas Supply Inc. — HVAC Parts & Equipment | South Louisiana & SE Texas",
  description:
    "Your local source for HVAC parts and equipment. Six branches across South Louisiana and Southeast Texas stocking OEM Fast Parts, KeepRite equipment, and the brands you trust. Serving HVAC pros since 1979.",
  metadataBase: new URL("https://thomassupply.net"),
  openGraph: {
    title: "Thomas Supply Inc. — HVAC Parts & Equipment",
    description:
      "Six branches across South Louisiana and Southeast Texas. OEM Fast Parts, KeepRite equipment, and the brands you trust. Serving HVAC pros since 1979.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="utilbar">
          <div className="container">
            <span>Serving HVAC pros across South Louisiana & Southeast Texas</span>
            <span>
              <a href="tel:337-433-4086">Lake Charles: 337-433-4086</a>
            </span>
          </div>
        </div>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
