"use client";

import { useState } from "react";
import { getInfluencerBySlug } from "@/lib/data";
import type { DiscountResult } from "@/lib/types";

interface DiscountSectionProps {
  slug: string;
  productPrices: Record<string, number>;
}

function validateCode(
  slug: string,
  code: string,
  productPrices: Record<string, number>
): DiscountResult {
  const store = getInfluencerBySlug(slug);
  if (!store)
    return { valid: false, message: "유효하지 않은 스토어입니다." };

  const discount = store.discountCodes.find(
    (d) => d.code === code.toUpperCase().trim()
  );
  if (!discount)
    return { valid: false, message: "유효하지 않은 할인코드입니다." };

  const discountedPrices: Record<string, number> = {};
  for (const [pid, price] of Object.entries(productPrices)) {
    if (discount.discountType === "percentage") {
      discountedPrices[pid] = Math.round(
        price * (1 - discount.discountValue / 100)
      );
    } else {
      discountedPrices[pid] = Math.max(0, price - discount.discountValue);
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

export function DiscountSection({ slug, productPrices }: DiscountSectionProps) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<DiscountResult | null>(null);

  const handleApply = () => {
    if (!code.trim()) return;
    const res = validateCode(slug, code, productPrices);
    setResult(res);

    if (res.valid && res.discountedPrices) {
      for (const [productId, discountedPrice] of Object.entries(
        res.discountedPrices
      )) {
        const el = document.querySelector(
          `[data-product-id="${productId}"]`
        );
        if (el) {
          el.textContent = `${discountedPrice.toLocaleString()}원`;
          el.classList.add("text-red-600");
        }
      }
    }
  };

  return (
    <section className="mx-4 mt-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-2">
          전용 할인코드
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="할인코드 입력"
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 uppercase tracking-wider"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleApply();
            }}
          />
          <button
            onClick={handleApply}
            disabled={code.trim().length === 0}
            className="bg-violet-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
          >
            적용
          </button>
        </div>
        {result && (
          <p
            className={`text-xs mt-2 ${result.valid ? "text-emerald-600" : "text-red-500"}`}
          >
            {result.message}
          </p>
        )}
      </div>
    </section>
  );
}
