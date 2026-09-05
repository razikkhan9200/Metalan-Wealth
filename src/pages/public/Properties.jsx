/* pages/public/Properties.jsx: application source file. See README.md for the folder responsibility. */
import Container from "../../components/ui/Container";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";
export default function Properties() {
  return (
    <section className="min-h-[70vh] py-24">
      <Container>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Metalan Wealth
        </p>
        <Heading className="mt-3 text-5xl">Property Opportunities</Heading>
        <Text className="mt-6 max-w-2xl text-lg leading-8" color="muted">
          Explore the public property section. Private investment actions remain
          protected.
        </Text>
      </Container>
    </section>
  );
}
