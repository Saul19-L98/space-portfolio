import { HiddenIndex } from "@/components/ui/HiddenIndex";
import { IntroCard } from "@/components/ui/IntroCard";

export default function GalaxyPage() {
  return (
    <>
      <HiddenIndex />
      <div className="pointer-events-auto fixed left-3 top-28 z-30 hidden max-w-sm sm:left-5 sm:top-32 md:block">
        <IntroCard />
      </div>
    </>
  );
}
