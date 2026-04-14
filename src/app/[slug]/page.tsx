import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getInfluencerBySlug, getAllSlugs } from "@/lib/data";
import type { StoreProduct, ProductTier } from "@/lib/types";
import { DiscountSection } from "./DiscountSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = getInfluencerBySlug(slug);
  if (!store) return { title: "인플루언서 스토어 | FMG" };
  return {
    title: `${store.name} 전용 스토어 | FMG`,
    description:
      store.introduction ?? `${store.name}의 시그니처 골프볼을 만나보세요`,
  };
}

const tierConfig: Record<
  ProductTier,
  { label: string; color: string; bgColor: string }
> = {
  signature: {
    label: "시그니처",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
  },
  premium: {
    label: "프리미엄",
    color: "text-violet-700",
    bgColor: "bg-violet-50 border-violet-200",
  },
  luckypack: {
    label: "럭키팩",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
};

const platformLabel: Record<string, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  blog: "Blog",
};

export default async function InfluencerStorePage({ params }: PageProps) {
  const { slug } = await params;
  const store = getInfluencerBySlug(slug);

  if (!store) notFound();

  const grouped = groupByTier(store.products);
  const productPrices: Record<string, number> = {};
  for (const p of store.products) {
    productPrices[p.id] = p.price;
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center gap-4 border-b sticky top-0 z-10">
        <Link href="/" className="text-xl">
          ←
        </Link>
        <h1 className="text-lg font-bold text-gray-900">
          {store.name} 스토어
        </h1>
      </header>

      {/* Profile Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-violet-900 text-white px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white/60">
            {store.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{store.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-white/70">
              {store.platform && (
                <span>{platformLabel[store.platform] ?? store.platform}</span>
              )}
              {store.followers > 0 && (
                <span>팔로워 {formatFollowers(store.followers)}</span>
              )}
            </div>
          </div>
        </div>

        {store.introduction && (
          <p className="text-sm text-white/80 leading-relaxed">
            {store.introduction}
          </p>
        )}

        {store.snsUrl && (
          <a
            href={store.snsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 text-sm text-violet-300 hover:text-violet-200 underline"
          >
            채널 바로가기 →
          </a>
        )}
      </section>

      {/* Discount Code Section */}
      <DiscountSection slug={slug} productPrices={productPrices} />

      {/* Products by Tier */}
      {(["signature", "premium", "luckypack"] as const).map((tier) => {
        const products = grouped[tier];
        if (!products || products.length === 0) return null;

        return (
          <section key={tier} className="px-4 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`text-xs font-bold px-2 py-1 rounded-md border ${tierConfig[tier].bgColor} ${tierConfig[tier].color}`}
              >
                {tierConfig[tier].label}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}

      {store.products.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">🏌️</p>
          <p>아직 등록된 상품이 없습니다</p>
        </div>
      )}
    </main>
  );
}

function ProductCard({ product }: { product: StoreProduct }) {
  const config = tierConfig[product.tier];
  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="flex">
        <div className="relative w-32 h-32 bg-gray-100 flex-shrink-0 flex items-center justify-center">
          <span className="text-4xl">⛳</span>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${config.bgColor} ${config.color}`}
            >
              {tierConfig[product.tier].label}
            </span>
            <h4 className="font-bold text-gray-900 text-sm mt-1 leading-tight">
              {product.name}
            </h4>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="flex items-end justify-between mt-2">
            <div>
              {product.originalPrice && discountPercent > 0 && (
                <span className="text-xs text-red-500 font-bold mr-1">
                  {discountPercent}%
                </span>
              )}
              <span
                className="font-bold text-gray-900"
                data-product-id={product.id}
              >
                {product.price.toLocaleString()}원
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through ml-1">
                  {product.originalPrice.toLocaleString()}원
                </span>
              )}
            </div>
            {product.isPrintable && (
              <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                인쇄 가능
              </span>
            )}
          </div>
          {product.stock < 10 && product.stock > 0 && (
            <span className="text-[10px] text-yellow-600 mt-1">
              잔여 {product.stock}개
            </span>
          )}
        </div>
      </div>

      {product.isPrintable && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
          <p className="text-xs text-gray-500 mb-1">
            구매자 이름 + 인플루언서 사인을 골프볼에 인쇄할 수 있습니다
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="인쇄할 이름 입력"
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
              aria-label={`${product.name} 인쇄 이름`}
            />
            <button
              type="button"
              className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-transform"
            >
              담기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function groupByTier(products: StoreProduct[]) {
  const result: Record<ProductTier, StoreProduct[]> = {
    signature: [],
    premium: [],
    luckypack: [],
  };
  for (const p of products) {
    if (result[p.tier]) {
      result[p.tier].push(p);
    }
  }
  return result;
}

function formatFollowers(count: number): string {
  if (count >= 10000) return `${(count / 10000).toFixed(1)}만`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}천`;
  return count.toLocaleString();
}
