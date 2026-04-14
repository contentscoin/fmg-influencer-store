import Link from "next/link";
import { getAllSlugs, INFLUENCERS } from "@/lib/data";

export default function HomePage() {
  const slugs = getAllSlugs();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-gray-900 via-gray-800 to-violet-900 text-white px-6 py-12 text-center">
        <h1 className="text-3xl font-bold mb-2">FMG 인플루언서 스토어</h1>
        <p className="text-white/70 text-sm">
          좋아하는 인플루언서의 시그니처 골프볼을 만나보세요
        </p>
      </header>

      <section className="max-w-lg mx-auto px-4 py-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          인플루언서 스토어
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {slugs.map((slug) => {
            const inf = INFLUENCERS[slug];
            return (
              <Link
                key={slug}
                href={`/${slug}`}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center text-xl font-bold text-violet-600 flex-shrink-0">
                    {inf.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{inf.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {inf.platform &&
                        `${inf.platform.charAt(0).toUpperCase()}${inf.platform.slice(1)}`}{" "}
                      · 팔로워{" "}
                      {inf.followers >= 10000
                        ? `${(inf.followers / 10000).toFixed(1)}만`
                        : inf.followers.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {inf.introduction}
                    </p>
                  </div>
                  <span className="text-gray-400 text-lg">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
