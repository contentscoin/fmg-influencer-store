"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type {
  InfluencerProfile,
  StoreProduct,
  ProductTier,
  DiscountResult,
  CartItem,
} from "@/lib/types";

const tierConfig: Record<
  ProductTier,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  signature: {
    label: "시그니처",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
    icon: "✦",
  },
  premium: {
    label: "프리미엄",
    color: "text-violet-700",
    bgColor: "bg-violet-50 border-violet-200",
    icon: "◆",
  },
  luckypack: {
    label: "럭키팩",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
    icon: "🍀",
  },
};

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

function validateCode(
  store: InfluencerProfile,
  code: string
): DiscountResult {
  const discount = store.discountCodes.find(
    (d) => d.code === code.toUpperCase().trim()
  );
  if (!discount)
    return { valid: false, message: "유효하지 않은 할인코드입니다." };

  const discountedPrices: Record<string, number> = {};
  for (const product of store.products) {
    if (discount.discountType === "percentage") {
      discountedPrices[product.id] = Math.round(
        product.price * (1 - discount.discountValue / 100)
      );
    } else {
      discountedPrices[product.id] = Math.max(
        0,
        product.price - discount.discountValue
      );
    }
  }

  const message =
    discount.discountType === "percentage"
      ? `${discount.discountValue}% 할인이 적용됩니다.`
      : `${discount.discountValue.toLocaleString()}원 할인이 적용됩니다.`;

  return {
    valid: true,
    message,
    discountType: discount.discountType,
    discountValue: discount.discountValue,
    discountedPrices,
  };
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

interface StoreClientProps {
  store: InfluencerProfile;
}

export function StoreClient({ store }: StoreClientProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [discountResult, setDiscountResult] = useState<DiscountResult | null>(
    null
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [printNames, setPrintNames] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const discountedPrices = discountResult?.valid
    ? discountResult.discountedPrices
    : undefined;

  const handleApplyDiscount = useCallback(() => {
    if (!discountCode.trim()) return;
    setDiscountResult(validateCode(store, discountCode));
  }, [discountCode, store]);

  const handleClearDiscount = useCallback(() => {
    setDiscountCode("");
    setDiscountResult(null);
  }, []);

  const getPrice = useCallback(
    (productId: string, originalPrice: number) => {
      return discountedPrices?.[productId] ?? originalPrice;
    },
    [discountedPrices]
  );

  const addToCart = useCallback(
    (productId: string) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === productId);
        if (existing) {
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        const printName = printNames[productId];
        return [...prev, { productId, quantity: 1, printName }];
      });
    },
    [printNames]
  );

  const updateCartQuantity = useCallback(
    (productId: string, delta: number) => {
      setCart((prev) => {
        return prev
          .map((item) => {
            if (item.productId !== productId) return item;
            const newQty = item.quantity + delta;
            return newQty <= 0 ? null : { ...item, quantity: newQty };
          })
          .filter((item): item is CartItem => item !== null);
      });
    },
    []
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const cartTotal = cart.reduce((sum, item) => {
    const product = store.products.find((p) => p.id === item.productId);
    if (!product) return sum;
    return sum + getPrice(product.id, product.price) * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const text = `${store.name} 전용 골프볼 스토어`;
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [store.name]);

  const grouped = groupByTier(store.products);

  return (
    <>
      {/* Profile Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-violet-900 text-white px-6 py-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl font-bold text-white/60 ring-2 ring-white/10">
            {store.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{store.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-white/70">
              {store.platform && (
                <span className="flex items-center gap-1">
                  <PlatformIcon platform={store.platform} />
                  {platformLabel[store.platform] ?? store.platform}
                </span>
              )}
              {store.followers > 0 && (
                <span>팔로워 {formatFollowers(store.followers)}</span>
              )}
            </div>
          </div>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="공유하기"
          >
            {copied ? (
              <span className="text-sm text-emerald-300">✓</span>
            ) : (
              <svg
                className="w-5 h-5 text-white/80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            )}
          </button>
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
            className="inline-flex items-center gap-1 mt-3 text-sm text-violet-300 hover:text-violet-200 transition-colors"
          >
            채널 바로가기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </section>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1.5 text-gray-500">
          <span className="font-semibold text-gray-900">
            {store.products.length}
          </span>
          상품
        </div>
        <div className="flex items-center gap-1.5 text-gray-500">
          <span className="font-semibold text-gray-900">
            {store.discountCodes.length > 0 ? "활성" : "없음"}
          </span>
          할인코드
        </div>
        {store.products.some((p) => p.isPrintable) && (
          <div className="flex items-center gap-1.5 text-violet-600">
            <span className="text-xs">✎</span>
            커스텀 인쇄 가능
          </div>
        )}
      </div>

      {/* Discount Code Section */}
      {store.discountCodes.length > 0 && (
        <section className="mx-4 mt-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">🏷️</span>
              <h3 className="text-sm font-bold text-gray-900">전용 할인코드</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="할인코드 입력"
                className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 uppercase tracking-wider"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleApplyDiscount();
                }}
              />
              {discountResult?.valid ? (
                <button
                  onClick={handleClearDiscount}
                  className="bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-300 active:scale-[0.98] transition-all"
                >
                  해제
                </button>
              ) : (
                <button
                  onClick={handleApplyDiscount}
                  disabled={discountCode.trim().length === 0}
                  className="bg-violet-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                >
                  적용
                </button>
              )}
            </div>
            {discountResult && (
              <div
                className={`flex items-center gap-1.5 text-xs mt-2 ${
                  discountResult.valid ? "text-emerald-600" : "text-red-500"
                }`}
              >
                <span>{discountResult.valid ? "✓" : "✕"}</span>
                {discountResult.message}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Products by Tier */}
      {(["signature", "premium", "luckypack"] as const).map((tier) => {
        const products = grouped[tier];
        if (!products || products.length === 0) return null;
        const config = tierConfig[tier];

        return (
          <section key={tier} className="px-4 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{config.icon}</span>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-md border ${config.bgColor} ${config.color}`}
              >
                {config.label}
              </span>
              <span className="text-xs text-gray-400">
                {products.length}개
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  discountedPrice={discountedPrices?.[product.id]}
                  cartItem={cart.find((c) => c.productId === product.id)}
                  printName={printNames[product.id] ?? ""}
                  onPrintNameChange={(name) =>
                    setPrintNames((prev) => ({ ...prev, [product.id]: name }))
                  }
                  onAddToCart={() => addToCart(product.id)}
                  onUpdateQuantity={(delta) =>
                    updateCartQuantity(product.id, delta)
                  }
                  onRemoveFromCart={() => removeFromCart(product.id)}
                />
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

      {/* Spacer for bottom bar */}
      <div className="h-28" />

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-20">
        <div className="max-w-lg mx-auto px-4 py-3">
          {cartCount > 0 ? (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-gray-500">
                  {cartCount}개 상품 선택
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {cartTotal.toLocaleString()}원
                </p>
              </div>
              <button className="bg-violet-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-violet-700 active:scale-[0.98] transition-all shadow-lg shadow-violet-200">
                구매하기
              </button>
            </div>
          ) : (
            <button
              disabled
              className="w-full bg-gray-200 text-gray-400 font-bold py-3.5 rounded-xl cursor-not-allowed"
            >
              상품을 선택해주세요
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function ProductCard({
  product,
  discountedPrice,
  cartItem,
  printName,
  onPrintNameChange,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
}: {
  product: StoreProduct;
  discountedPrice?: number;
  cartItem?: CartItem;
  printName: string;
  onPrintNameChange: (name: string) => void;
  onAddToCart: () => void;
  onUpdateQuantity: (delta: number) => void;
  onRemoveFromCart: () => void;
}) {
  const config = tierConfig[product.tier];
  const currentPrice = discountedPrice ?? product.price;
  const discountPercent = product.originalPrice
    ? Math.round((1 - currentPrice / product.originalPrice) * 100)
    : discountedPrice
      ? Math.round((1 - discountedPrice / product.price) * 100)
      : 0;
  const isInCart = !!cartItem;
  const isOutOfStock = product.stock === 0;

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all ${
        isInCart ? "border-violet-300 shadow-violet-100" : "border-gray-100"
      }`}
    >
      <div className="flex">
        {/* Product Image */}
        <div className="relative w-32 h-32 bg-gray-50 flex-shrink-0 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="128px"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xs font-bold">품절</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${config.bgColor} ${config.color}`}
            >
              {config.label}
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
              {discountPercent > 0 && (
                <span className="text-xs text-red-500 font-bold mr-1">
                  {discountPercent}%
                </span>
              )}
              <span
                className={`font-bold ${discountedPrice ? "text-red-600" : "text-gray-900"}`}
              >
                {currentPrice.toLocaleString()}원
              </span>
              {(product.originalPrice || discountedPrice) && (
                <span className="text-xs text-gray-400 line-through ml-1">
                  {(discountedPrice
                    ? product.price
                    : product.originalPrice!
                  ).toLocaleString()}
                  원
                </span>
              )}
            </div>
            {product.isPrintable && (
              <span className="text-[10px] bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded border border-violet-100">
                ✎ 인쇄
              </span>
            )}
          </div>
          {product.stock < 10 && product.stock > 0 && (
            <span className="text-[10px] text-orange-500 mt-1 font-medium">
              잔여 {product.stock}개
            </span>
          )}
        </div>
      </div>

      {/* Print Option */}
      {product.isPrintable && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50/50">
          <p className="text-xs text-gray-500 mb-1.5">
            구매자 이름 + 인플루언서 사인을 골프볼에 인쇄합니다
          </p>
          <input
            type="text"
            value={printName}
            onChange={(e) => onPrintNameChange(e.target.value)}
            placeholder="인쇄할 이름 입력 (선택)"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400"
            aria-label={`${product.name} 인쇄 이름`}
          />
        </div>
      )}

      {/* Cart Controls */}
      <div className="border-t border-gray-100 px-4 py-3">
        {isInCart ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-1 py-1">
              <button
                onClick={() => onUpdateQuantity(-1)}
                className="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
              >
                −
              </button>
              <span className="text-sm font-bold text-gray-900 min-w-[1.5rem] text-center">
                {cartItem.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(1)}
                className="w-8 h-8 rounded-md bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
              >
                +
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">
                {(currentPrice * cartItem.quantity).toLocaleString()}원
              </span>
              <button
                onClick={onRemoveFromCart}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={onAddToCart}
            disabled={isOutOfStock}
            className="w-full bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-800 active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            {isOutOfStock ? "품절" : "담기"}
          </button>
        )}
      </div>
    </div>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "youtube":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    default:
      return null;
  }
}
