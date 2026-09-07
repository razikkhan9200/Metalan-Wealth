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
import Hero from "../../sections/home/Hero";
import Tokenization from "../../sections/home/Tokenization";
import { ROUTES } from "../../constants/routes";
import Funds from "../../sections/home/Funds";
import PlatformFeatures from "../../sections/home/PlatformFeatures";
import Testimonials from "../../sections/home/Testimonials";
// import FaixEcosystem from "../../sections/home/FaixEcosystem";
import PlatformMetrics from "../../sections/home/PlatformMetrics";

export default function Home() {
  return (
    <div>
      <Hero />
      <Tokenization />
      <Funds />
      <PlatformFeatures />
      <Testimonials />
      <PlatformMetrics />
      {/* <FaixEcosystem /> */}
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

          <Heading className="mt-3 text-4xl">
            Explore the platform
          </Heading>

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

                  <h3 className="mt-7 text-xl font-semibold">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Discover this area of the Metalan Wealth ecosystem.
                  </p>

                  <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">
                    Explore
                    <ArrowRight size={16} />
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