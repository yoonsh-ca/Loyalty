require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');
const router = express.Router();
const { parseCouponRichText } = require('../utils/couponParser');

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
            property: 'name',
            title: { equals: name },
          },
          {
            property: 'phone_number',
            phone_number: { equals: phone },
          },
        ],
      },
    });

    if (response.results.length > 0) {
      const customerPage = response.results[0];
      const couponProp = customerPage.properties?.coupons;

      const parsedCoupons = parseCouponRichText(couponProp?.rich_text);
      console.log(parsedCoupons);

      const customerData = {
        pageId: customerPage.id,
        name: customerPage.properties.name.title[0]?.plain_text || '',
        phone_number: customerPage.properties.phone_number.phone_number || '',
        email: customerPage.properties.email.email || '',
        purchase_amount: customerPage.properties.purchase_amount?.number || 0,
        tier: customerPage.properties.tier.formula?.string || '',
        coupons: parsedCoupons,
      };

      console.log('Customer found.');

      res.json({ success: true, data: customerData });
    } else {
      console.log('No customer found.');
      res.json({
        success: false,
        message: 'There is no customer information.',
      });
    }
  } catch (error) {
    console.error('API Error:', error.message || error);
    console.error(
      'API Error Stack:',
      error.stack || 'No stack trace available.'
    );
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

    const page = await notion.pages.retrieve({ page_id: pageId });

    const couponProp = page.properties?.coupons;

    if (!couponProp) {
      return res.status(404).json({
        success: false,
        message: 'Coupons property not found on page.',
      });
    }

    const couponsArray = parseCouponRichText(couponProp?.rich_text);

    if (!Array.isArray(couponsArray)) {
      return res.status(400).json({
        success: false,
        message: 'Coupon JSON does not contain an array.',
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

    const updatedPayload = { coupons: updatedArray };
    const updatedString = JSON.stringify(updatedPayload);

    await notion.pages.update({
      page_id: pageId,
      properties: {
        coupons: {
          rich_text: [{ type: 'text', text: { content: updatedString } }],
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
