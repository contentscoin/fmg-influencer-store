import type { InfluencerProfile } from "./types";

/**
 * 인플루언서 스토어 샘플 데이터
 * 추후 Supabase API로 교체 가능
 */
export const INFLUENCERS: Record<string, InfluencerProfile> = {
  "golf-queen": {
    slug: "golf-queen",
    name: "골프여왕 지은",
    profileImage: undefined,
    introduction:
      "10만 구독자 골프 유튜버. 매주 라운딩 브이로그와 골프볼 리뷰를 공유합니다. 럭키볼 앰베서더로 활동 중!",
    snsUrl: "https://youtube.com/@golf-queen",
    platform: "youtube",
    followers: 102000,
    products: [
      {
        id: "gq-sig-12",
        tier: "signature",
        name: "골프여왕 시그니처 골프볼 (12구)",
        description:
          "골프여왕 지은의 시그니처 디자인이 프린팅된 프리미엄 골프볼. 우레탄 커버, 투어급 스핀 컨트롤.",
        price: 89000,
        originalPrice: 110000,
        imageUrl: "/images/ball-signature.png",
        isPrintable: true,
        stock: 50,
      },
      {
        id: "gq-pre-24",
        tier: "premium",
        name: "프리미엄 골프볼 세트 (24구)",
        description:
          "고급 우레탄 커버 골프볼 대용량 패키지. 구매자 이름 + 골프여왕 사인 인쇄 가능.",
        price: 159000,
        originalPrice: 198000,
        imageUrl: "/images/ball-premium.png",
        isPrintable: true,
        stock: 30,
      },
      {
        id: "gq-lucky-6",
        tier: "luckypack",
        name: "럭키팩 골프볼 (6구)",
        description:
          "랜덤 디자인 골프볼 서프라이즈 패키지. 매달 다른 디자인을 만나보세요!",
        price: 39000,
        imageUrl: "/images/ball-luckypack.png",
        isPrintable: false,
        stock: 100,
      },
    ],
    discountCodes: [
      { code: "QUEEN10", discountType: "percentage", discountValue: 10 },
    ],
  },
  "pro-swing": {
    slug: "pro-swing",
    name: "프로스윙 민수",
    profileImage: undefined,
    introduction:
      "KPGA 출신 골프 레슨 프로. 인스타그램에서 스윙 분석과 장비 리뷰를 공유합니다.",
    snsUrl: "https://instagram.com/proswing_ms",
    platform: "instagram",
    followers: 58000,
    products: [
      {
        id: "ps-sig-12",
        tier: "signature",
        name: "프로스윙 시그니처 볼 (12구)",
        description:
          "프로스윙 민수의 로고가 새겨진 프리미엄 3피스 골프볼. 부드러운 타감과 정교한 컨트롤.",
        price: 79000,
        originalPrice: 99000,
        imageUrl: "/images/ball-signature.png",
        isPrintable: true,
        stock: 40,
      },
      {
        id: "ps-lucky-6",
        tier: "luckypack",
        name: "럭키팩 골프볼 (6구)",
        description:
          "프로가 엄선한 랜덤 골프볼 패키지. 다양한 브랜드와 디자인을 경험하세요.",
        price: 35000,
        imageUrl: "/images/ball-luckypack.png",
        isPrintable: false,
        stock: 80,
      },
    ],
    discountCodes: [
      { code: "SWING15", discountType: "percentage", discountValue: 15 },
    ],
  },
};

export function getInfluencerBySlug(
  slug: string
): InfluencerProfile | undefined {
  return INFLUENCERS[slug];
}

export function getAllSlugs(): string[] {
  return Object.keys(INFLUENCERS);
}
