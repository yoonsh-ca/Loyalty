// couponParser.js

const parseCouponRichText = (richTextArr) => {
  if (!richTextArr || richTextArr.length === 0) {
    return [];
  }

  let couponText = richTextArr.map((rt) => rt.plain_text).join('');

  // 스마트 따옴표, 후행 콤마 등 파싱 에러 방지
  couponText = couponText
    .replace(/[“”«»„]/g, '"')
    .replace(/,\s*([\]\}])/g, '$1')
    .trim();

  try {
    const parsed = JSON.parse(couponText);
    return Array.isArray(parsed) ? parsed : parsed?.coupons || [];
  } catch (e) {
    console.error('JSON parse error in couponParser:', e.message);
    return [];
  }
};

module.exports = { parseCouponRichText };
