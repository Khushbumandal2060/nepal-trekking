import Link from "next/link";

export default function Footer() {
    return (
        <footer>
            <div className="wrap">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <p className="footer-logo">
                            Trekking <span>Nepal</span>
                        </p>
                        <p style={{ maxWidth: 300 }}>
                            A Kathmandu-based trekking company running
                            fixed-departure and custom treks exclusively inside
                            Nepal since 2013.
                        </p>
                    </div>
                    <nav aria-label="Explore">
                        <h4>Explore</h4>
                        <Link href="/treks">All Treks</Link>
                        <Link href="/about">About Us</Link>
                        <Link href="/contact">Contact</Link>
                    </nav>
                    <nav aria-label="Regions" className="footer-regions">
                        <h4>Regions</h4>
                        <Link href="/treks?region=khumbu">Khumbu (Everest)</Link>
                        <Link href="/treks?region=annapurna">Annapurna</Link>
                        <Link href="/treks?region=manaslu">Manaslu</Link>
                        <Link href="/treks?region=langtang">Langtang</Link>
                        <Link href="/treks?region=mustang">Mustang</Link>
                        <Link href="/treks?region=kanchenjunga">Kanchenjunga</Link>
                        <Link href="/treks?region=dolpo">Dolpo</Link>
                        <Link href="/treks?region=makalu">Makalu</Link>
                        <Link href="/treks?region=dhaulagiri">Dhaulagiri</Link>
                        <Link href="/treks?region=karnali">Karnali & Far West</Link>
                        <Link href="/treks?region=ganesh">Ganesh Himal</Link>
                    </nav>
                    <div>
                        <h4>Get in Touch</h4>
                        <p>Thamel, Kathmandu, Nepal</p>
                        <p>hello@trekkingnepal.example</p>
                        <p>Sun&ndash;Fri, 9:00&ndash;18:00 NPT</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span>
                        &copy; 2026 Trekking Nepal. Sample site &mdash; not a real
                        business.
                    </span>
                    <span>Design by Contour Studio</span>
                </div>
            </div>
        </footer>
    );
}
