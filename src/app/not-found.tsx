import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/tag";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <Eyebrow>404</Eyebrow>
      <h1 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.01em] text-text sm:text-4xl">
        This part doesn&apos;t exist.
      </h1>
      <p className="mt-3 max-w-sm text-balance leading-relaxed text-text-muted">
        The page you&apos;re looking for isn&apos;t here. It might have moved, or never existed.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <LinkButton href="/">
          Back to home <ArrowRight className="h-4 w-4" />
        </LinkButton>
        <LinkButton href="/hardware" variant="secondary">
          Browse hardware
        </LinkButton>
      </div>
      <Link href="/plan" className="mt-6 text-[13px] text-text-faint hover:text-text-muted">
        Or just tell us what you&apos;re building →
      </Link>
    </div>
  );
}
