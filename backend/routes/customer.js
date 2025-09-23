require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');
const router = express.Router();

// Notion 클라이언트 초기화
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const dataSourceId = process.env.NOTION_CUSTOMER_DB_SOURCE_ID;

// API EndPoint: Lookup specific customer
router.get('/customer', async (req, res) => {
  try {
    const { name, phone } = req.query;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required.',
      });
    }

    const response = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        and: [
          {
            property: 'Name',
            title: { equals: name },
          },
          {
            property: 'PhoneNumber',
            phone_number: { equals: phone },
          },
        ],
      },
    });

    if (response.results.length > 0) {
      console.log('Customer found.');
      res.json({ success: true, data: response.results[0] });
    } else {
      console.log('No customer found.');
      res.json({
        success: false,
        message: 'There is no customer information.',
      });
    }
  } catch (error) {
    console.error('API Error:', JSON.stringify(error, null, 2));
    res.status(500).json({
      success: false,
      message: 'Server error has occurred.',
    });
  }
});

// API EndPoint: Update Coupon Status
router.post('/coupon/update', async (req, res) => {
  try {
    const { pageId, couponId } = req.body;
    if (!pageId || !couponId) {
      return res.status(400).json({
        success: false,
        message: 'Page ID and coupon ID are required.',
      });
    }

    console.log('Getting data from Notion...');

    const page = await notion.pages.retrieve({ page_id: pageId });

    console.log('Finish getting data.');

    const couponProp = page.properties?.Coupons;

    if (!couponProp) {
      return res.status(404).json({
        success: false,
        message: 'Coupons property not found on page.',
      });
    }

    const richTextArr = couponProp.rich_text || [];
    if (richTextArr.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'Coupons property is empty.' });
    }

    let couponText = richTextArr.map((rt) => rt.plain_text).join('');
    // 스마트 따옴표 / 후행 콤마 제거
    couponText = couponText
      .replace(/[“”«»„]/g, '"')
      .replace(/,\s*([\]\}])/g, '$1')
      .trim();
    let parsed;

    try {
      parsed = JSON.parse(couponText);
    } catch (e) {
      console.error('JSON parse error:', e);

      return res.status(400).json({
        success: false,
        message: 'Failed to parse coupon JSON from Notion.',
        error: e.message,
        raw: couponText.slice(0, 1000),
      });
    }

    const couponsArray = Array.isArray(parsed) ? parsed : parsed?.coupons;
    if (!Array.isArray(couponsArray)) {
      return res.status(400).json({
        success: false,
        message:
          'Coupon JSON does not contain an array. Expected array or { coupons: [...] }.',
      });
    }

    const targetId = Number(couponId);
    let found = false;
    const updatedArray = couponsArray.map((c) => {
      if (Number(c.id) === targetId) {
        found = true;
        return { ...c, used: true };
      }

      return c;
    });

    if (!found) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found in the stored list.',
      });
    }

    const updatedPayload = Array.isArray(parsed)
      ? updatedArray
      : { ...parsed, coupons: updatedArray };
    const updatedString = JSON.stringify(updatedPayload);

    await notion.pages.update({
      page_id: pageId,
      properties: {
        Coupons: {
          rich_text: [
            {
              type: 'text',
              text: { content: updatedString },
            },
          ],
        },
      },
    });

    res.json({ success: true, message: 'Coupon status updated successfully.' });
  } catch (error) {
    console.error('Coupon Update Error:', error);
    console.error(error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error has occurred while updating the coupon.',
      error: error.message,
    });
  }
});

module.exports = router;
