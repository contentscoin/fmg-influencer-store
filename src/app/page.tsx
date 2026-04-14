import Link from "next/link";
import { getAllSlugs, INFLUENCERS } from "@/lib/data";
import type { InfluencerProfile } from "@/lib/types";

const platformLabel: Record<string, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  blog: "Blog",
};

function formatFollowers(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}만`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}천`;
  return count.toLocaleString();
}

function getMinPrice(inf: InfluencerProfile): number {
  if (inf.products.length === 0) return 0;
  return Math.min(...inf.products.map((p) => p.price));
}

export default function HomePage() {
  const slugs = getAllSlugs();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <header className="bg-gradient-to-br from-gray-900 via-gray-800 to-violet-900 text-white px-6 py-12 text-center">
        <div className="max-w-lg mx-auto">
          <p className="text-violet-300 text-xs font-semibold tracking-widest mb-3">
            FMG INFLUENCER STORE
          </p>
          <h1 className="text-3xl font-bold mb-3">
            인플루언서 전용 골프볼 스토어
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            좋아하는 인플루언서의 시그니처 골프볼을 만나보세요.
            <br />
            전용 할인코드로 특별한 가격에 구매할 수 있습니다.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="text-center">
              <p className="text-xl font-bold text-white">{slugs.length}</p>
              <p className="text-white/50 text-xs">인플루언서</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-xl font-bold text-white">
                {slugs.reduce(
                  (sum, s) => sum + INFLUENCERS[s].products.length,
                  0
                )}
              </p>
              <p className="text-white/50 text-xs">상품</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-xl font-bold text-violet-300">✎</p>
              <p className="text-white/50 text-xs">커스텀 인쇄</p>
            </div>
          </div>
        </div>
      </header>

      {/* Store List */}
      <section className="max-w-lg mx-auto px-4 py-6">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
          스토어 둘러보기
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {slugs.map((slug) => {
            const inf = INFLUENCERS[slug];
            const minPrice = getMinPrice(inf);
            const hasDiscount = inf.discountCodes.length > 0;

            return (
              <Link
                key={slug}
                href={`/${slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-violet-100 transition-all group"
              >
                {/* Gradient Banner */}
                <div className="h-20 bg-gradient-to-r from-gray-800 to-violet-800 relative">
                  <div className="absolute -bottom-6 left-5">
                    <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-xl font-bold text-violet-600 ring-2 ring-white">
                      {inf.name.charAt(0)}
                    </div>
                  </div>
                  {hasDiscount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      할인코드 적용 가능
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="pt-8 pb-4 px-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors">
                        {inf.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                        {inf.platform && (
                          <span>
                            {platformLabel[inf.platform] ?? inf.platform}
                          </span>
                        )}
                        <span>
                          팔로워 {formatFollowers(inf.followers)}
                        </span>
                      </p>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-300 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all mt-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>

                  {inf.introduction && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                      {inf.introduction}
                    </p>
                  )}

                  {/* Product summary */}
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-500">
                      상품 {inf.products.length}종
                    </span>
                    {minPrice > 0 && (
                      <>
                        <span className="text-gray-200">|</span>
                        <span className="text-xs text-gray-500">
                          {minPrice.toLocaleString()}원~
                        </span>
                      </>
                    )}
                    {inf.products.some((p) => p.isPrintable) && (
                      <>
                        <span className="text-gray-200">|</span>
                        <span className="text-xs text-violet-500">
                          커스텀 인쇄
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white/40 text-center py-8 mt-8">
        <p className="text-xs font-semibold text-white/60 tracking-wider mb-1">
          FMG
        </p>
        <p className="text-[10px]">골퍼-기업 매칭 골프 마케팅 플랫폼</p>
        <p className="text-[10px] mt-2">
          © {new Date().getFullYear()} FMG. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
