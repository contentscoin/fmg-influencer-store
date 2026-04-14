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
      "10만 구독자 골프 유튜버. 매주 라운딩 브이로그와 골프볼 리뷰를 공유합니다. FMG 럭키볼 앰베서더로 활동 중!",
    snsUrl: "https://youtube.com/@golf-queen",
    platform: "youtube",
    followers: 102000,
    products: [
      {
        id: "gq-sig-12",
        tier: "signature",
        name: "골프여왕 시그니처 럭키볼 (12구)",
        description:
          "골프여왕 지은 × FMG 콜라보 시그니처 럭키볼. 홀인원 축하금이 포함된 프리미엄 골프볼.",
        price: 89000,
        originalPrice: 110000,
        imageUrl: "/images/luckyball-box-en.png",
        isPrintable: true,
        stock: 50,
      },
      {
        id: "gq-pre-24",
        tier: "premium",
        name: "FMG 럭키볼 프리미엄 세트 (24구)",
        description:
          "홀인원 축하금 주는 FMG Luckyball 대용량 패키지. 구매자 이름 + 골프여왕 사인 인쇄 가능.",
        price: 159000,
        originalPrice: 198000,
        imageUrl: "/images/luckyball-box-kr.jpeg",
        isPrintable: true,
        stock: 30,
      },
      {
        id: "gq-lucky-6",
        tier: "luckypack",
        name: "럭키팩 파우치 세트 (6구)",
        description:
          "GOLFERS WANT TO HAVE LUCKYBALL! 홀로그램 파우치에 담긴 럭키볼 서프라이즈 패키지.",
        price: 39000,
        imageUrl: "/images/luckyball-pouch.png",
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
      "KPGA 출신 골프 레슨 프로. 인스타그램에서 스윙 분석과 장비 리뷰를 공유합니다. FMG 럭키볼 앰베서더.",
    snsUrl: "https://instagram.com/proswing_ms",
    platform: "instagram",
    followers: 58000,
    products: [
      {
        id: "ps-sig-12",
        tier: "signature",
        name: "프로스윙 시그니처 럭키볼 (12구)",
        description:
          "프로스윙 민수 × FMG 콜라보 럭키볼. 홀인원 축하금 + 부드러운 타감의 3피스 골프볼.",
        price: 79000,
        originalPrice: 99000,
        imageUrl: "/images/luckyball-box-en.png",
        isPrintable: true,
        stock: 40,
      },
      {
        id: "ps-lucky-6",
        tier: "luckypack",
        name: "럭키팩 파우치 세트 (6구)",
        description:
          "프로가 엄선한 FMG 럭키볼 파우치 패키지. 홀인원 축하금이 포함된 서프라이즈 골프볼.",
        price: 35000,
        imageUrl: "/images/luckyball-pouch.png",
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
