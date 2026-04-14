import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getInfluencerBySlug, getAllSlugs } from "@/lib/data";
import { StoreClient } from "./StoreClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = getInfluencerBySlug(slug);
  if (!store) return { title: "인플루언서 스토어 | FMG" };
  return {
    title: `${store.name} 전용 스토어 | FMG`,
    description:
      store.introduction ?? `${store.name}의 시그니처 골프볼을 만나보세요`,
    openGraph: {
      title: `${store.name} 전용 골프볼 스토어`,
      description:
        store.introduction ?? `${store.name}의 시그니처 골프볼을 만나보세요`,
      type: "website",
    },
  };
}

export default async function InfluencerStorePage({ params }: PageProps) {
  const { slug } = await params;
  const store = getInfluencerBySlug(slug);

  if (!store) notFound();

  return (
    <main className="min-h-screen bg-gray-50 max-w-lg mx-auto">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center gap-3 border-b sticky top-0 z-30">
        <Link
          href="/"
          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="text-base font-bold text-gray-900 flex-1">
          {store.name} 스토어
        </h1>
        <span className="text-xs text-gray-400 font-medium">FMG</span>
      </header>

      <StoreClient store={store} />
    </main>
  );
}
