import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import {
  Camera,
  Check,
  History,
  LineChart,
  NotebookPen,
  Sprout,
} from "lucide-react";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingMenu } from "@/components/landing/LandingMenu";
import { comfortaa } from "@/lib/fonts";
import styles from "./landing.module.scss";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Growndona — Tu cultivo, organizado",
  description:
    "Registrá plantas, seguí su evolución y mantené toda la información de tu cultivo en un solo lugar. Pago único, acceso de por vida.",
};

const FEATURES = [
  {
    icon: LineChart,
    title: "Seguimiento",
    text: "Parámetros, riegos y acciones al día, sin planillas.",
  },
  {
    icon: NotebookPen,
    title: "Registros",
    text: "Cada día del cultivo queda documentado en segundos.",
  },
  {
    icon: Camera,
    title: "Fotos",
    text: "La evolución visual de cada planta, siempre a mano.",
  },
  {
    icon: History,
    title: "Historial",
    text: "Todo el recorrido ordenado por día y por etapa.",
  },
];

const STEPS = [
  { title: "Creá tu cultivo", text: "Nombre, método y fecha de inicio." },
  { title: "Registrá cada día", text: "Parámetros, riegos, fotos y notas." },
  { title: "Mirá su evolución", text: "Gráficos e historial completo." },
];

const PRICE_BENEFITS = ["Acceso completo", "Sin suscripción", "Actualizaciones incluidas"];

export default function LandingPage() {
  return (
    <div id="inicio" className={`${display.variable} ${styles.landing}`}>
      <LandingHeader />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroFrame}>
            <Image
              src="/banner.png"
              alt="Cultivo indoor en plena floración"
              fill
              preload
              sizes="(max-width: 1200px) 100vw, 1160px"
              className={styles.heroImage}
            />
            <div className={styles.heroOverlay} aria-hidden="true" />
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>Tu cultivo, organizado.</h1>
              <p className={styles.heroSubtitle}>
                Registrá plantas, seguí su evolución y mantené toda la
                información de tu cultivo en un solo lugar.
              </p>
              <div className={styles.heroActions}>
                <Link href="/register" className={styles.ctaLight}>
                  Pedir tu prueba gratuita
                </Link>
                <span className={styles.ctaSupportLight}>
                  Sin tarjetas, sin compromiso
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="funciones" className={styles.section}>
          <div className={styles.container}>
            <span className={styles.eyebrow}>Funciones</span>
            <h2 className={styles.sectionTitle}>
              Lo esencial, sin vueltas.
            </h2>
            <div className={styles.featureGrid}>
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className={styles.feature}>
                    <span className={styles.featureIcon}>
                      <Icon size={21} aria-hidden="true" />
                    </span>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureText}>{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="como-funciona" className={styles.productSection}>
          <div className={`${styles.container} ${styles.productGrid}`}>
            <div className={styles.productCopy}>
              <span className={styles.eyebrow}>Cómo funciona</span>
              <h2 className={styles.sectionTitle}>Cada planta, su historia.</h2>
              <p className={styles.productText}>
                Visualizá el progreso día a día, registrá datos importantes y
                llevá más control sobre tu cultivo.
              </p>
              <ol className={styles.steps}>
                {STEPS.map((step, index) => (
                  <li key={step.title} className={styles.step}>
                    <span className={styles.stepNumber}>{index + 1}</span>
                    <div>
                      <p className={styles.stepTitle}>{step.title}</p>
                      <p className={styles.stepText}>{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className={styles.mockupWrap} aria-hidden="true">
              <div className={styles.mockup}>
                <div className={styles.mockupHeader}>
                  <div>
                    <p className={styles.mockupName}>Cultivo Agosto</p>
                    <p className={styles.mockupMeta}>Interior · 9 plantas</p>
                  </div>
                  <span className={styles.mockupBadge}>Día 24 · Floración</span>
                </div>
                <div className={styles.mockupParams}>
                  <div className={styles.mockupParam}>
                    <span>Temp.</span>
                    <strong>24 °C</strong>
                  </div>
                  <div className={styles.mockupParam}>
                    <span>Hum.</span>
                    <strong>65 %</strong>
                  </div>
                  <div className={styles.mockupParam}>
                    <span>pH</span>
                    <strong>5.9</strong>
                  </div>
                  <div className={styles.mockupParam}>
                    <span>EC</span>
                    <strong>534</strong>
                  </div>
                </div>
                <div className={styles.mockupChart}>
                  {[38, 52, 44, 66, 58, 78, 70, 88].map((height, index) => (
                    <span key={index} style={{ height: `${height}%` }} />
                  ))}
                </div>
                <div className={styles.mockupEntries}>
                  <div className={styles.mockupEntry}>
                    <span className={styles.mockupDot} />
                    <p>Riego con nutrientes · 2 L por planta</p>
                  </div>
                  <div className={styles.mockupEntry}>
                    <span className={styles.mockupDot} />
                    <p>Defoliación ligera · 4 fotos</p>
                  </div>
                </div>
              </div>
              <div className={styles.mockupChip}>
                <Sprout size={16} aria-hidden="true" />
                Registro guardado
              </div>
            </div>
          </div>
        </section>

        <section id="precio" className={styles.priceSection}>
          <div className={`${styles.container} ${styles.priceInner}`}>
            <span className={styles.priceBadge}>Pago único</span>
            <h2 className={styles.priceTitle}>Acceso de por vida</h2>
            <p className={styles.priceAmount}>
              <span className={styles.priceCurrency}>USD</span>42
            </p>
            <p className={styles.priceNote}>Pagás una vez. Es tuyo para siempre.</p>
            <ul className={styles.priceBenefits}>
              {PRICE_BENEFITS.map((benefit) => (
                <li key={benefit}>
                  <Check size={16} aria-hidden="true" />
                  {benefit}
                </li>
              ))}
            </ul>
            <div className={styles.priceActions}>
              <Link href="/register" className={styles.ctaGreen}>
                Pedir tu prueba gratuita
              </Link>
              <span className={styles.ctaSupport}>Sin tarjetas, sin compromiso</span>
            </div>
          </div>
        </section>

        <section className={styles.finalSection}>
          <div className={styles.container}>
            <div className={styles.finalPanel}>
              <h2 className={styles.finalTitle}>
                Organizá tu cultivo. Empezá hoy.
              </h2>
              <div className={styles.heroActions}>
                <Link href="/register" className={styles.ctaLight}>
                  Pedir tu prueba gratuita
                </Link>
                <span className={styles.ctaSupportLight}>
                  Sin tarjetas, sin compromiso
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <div className={styles.footerBrand}>
            <Image
              src="/logo-ligth.png"
              alt="Growndona"
              width={30}
              height={30}
              className={styles.footerMark}
            />
            <span className={`${styles.footerName} ${comfortaa.className}`}>
              GROWNDONA
            </span>
          </div>
          <nav className={styles.footerLinks} aria-label="Enlaces del pie">
            <a href="#funciones">¿Para qué sirve?</a>
            <a href="#como-funciona">¿Cómo funciona?</a>
            <a href="#precio">¿Es gratis?</a>
            <Link href="/login">Iniciar sesión</Link>
          </nav>
          <div className={styles.footerLegalWrap}>
            <p className={styles.footerLegal}>
              © {new Date().getFullYear()} Growndona. Todos los derechos
              reservados.
            </p>
            <a
              href="https://www.grgsolutions.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.footerCredit}
            >
              desarrollado por
              <Image
                src="/logo-grg-negro.svg"
                alt="GRG Solutions"
                width={38}
                height={14}
              />
            </a>
          </div>
        </div>
      </footer>

      <LandingMenu />
    </div>
  );
}
