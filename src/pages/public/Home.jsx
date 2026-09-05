/* pages/public/Home.jsx: application source file. See README.md for the folder responsibility. */
import {
  ArrowRight,
  Building2,
  Coins,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
import Card from "../../components/ui/Card";
import Scene from "../../components/Scene";
import { ROUTES } from "../../constants/routes";

/** Landing page. Navbar/Footer are supplied by PublicLayout. */
export default function Home() {
  return (
    <div>
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-80">
          <Scene />
        </div>
        <Container className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center py-20">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
              A connected wealth ecosystem
            </span>
            <h1 className="mt-7 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Build, access and manage wealth through one ecosystem.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Explore digital access to property opportunities, structured
              funds, exchange services and a connected wallet experience.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to={ROUTES.LOGIN}>
                <Button size="lg">Login to Dashboard</Button>
              </Link>
              <Link to={ROUTES.HOW_IT_WORKS}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  How It Works <ArrowRight size={17} />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
      <section className="border-b border-slate-200 bg-white">
        <Container className="grid gap-4 py-8 sm:grid-cols-3">
          {[
            [ShieldCheck, "Secure-first architecture"],
            [Globe2, "Built for global access"],
            [Coins, "Connected digital ecosystem"],
          ].map(([Icon, label]) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4"
            >
              <Icon size={20} />
              <span className="text-sm font-semibold">{label}</span>
            </div>
          ))}
        </Container>
      </section>
      <section className="py-24">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            About Metalan Wealth
          </p>
          <Heading className="mt-3 text-4xl sm:text-5xl">
            One platform, multiple wealth pathways.
          </Heading>
          <Text className="mt-5 max-w-2xl text-lg leading-8" color="muted">
            Metalan Wealth brings key wealth-oriented services into a structured
            digital experience designed for clarity, accessibility and scalable
            product integration.
          </Text>
        </Container>
      </section>
      <section className="bg-slate-50 py-24">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Ecosystem
          </p>
          <Heading className="mt-3 text-4xl">Explore the platform</Heading>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Properties", Building2, ROUTES.PROPERTIES],
              ["Funds", Coins, ROUTES.FUNDS],
              ["Exchange", ArrowRight, ROUTES.EXCHANGE],
              ["Wallet", ShieldCheck, ROUTES.LOGIN],
            ].map(([title, Icon, href]) => (
              <Link key={title} to={href}>
                <Card className="h-full transition hover:-translate-y-1 hover:shadow-lg">
                  <Icon size={25} />
                  <h3 className="mt-7 text-xl font-semibold">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Discover this area of the Metalan Wealth ecosystem.
                  </p>
                  <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">
                    Explore <ArrowRight size={16} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>
      <section className="py-24">
        <Container>
          <div className="rounded-3xl bg-slate-950 px-7 py-14 text-center text-white sm:px-14">
            <h2 className="text-4xl font-semibold sm:text-5xl">
              Ready to enter your wealth dashboard?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-slate-300">
              Login to access your private Metalan Wealth experience.
            </p>
            <Link to={ROUTES.LOGIN} className="mt-8 inline-block">
              <Button size="lg">Login</Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
