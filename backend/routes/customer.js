require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');
const router = express.Router();
const { parseCouponRichText } = require('../utils/couponParser');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const dataSourceId = process.env.NOTION_CUSTOMER_DB_SOURCE_ID;

const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  const cleanedPhone = phone.replace(/[-|\s|\+]/g, '');
  if (cleanedPhone.startsWith('1')) {
    return cleanedPhone;
  }
  return `1${cleanedPhone}`;
};

const checkAndIssueBirthdayCoupon = async (customerData) => {
  const { pageId, birthday, coupons } = customerData;
  if (!birthday) return coupons;

  const today = new Date();
  const birthdayDate = new Date(birthday);
  birthdayDate.setFullYear(today.getFullYear());

  const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  const timeDifference = birthdayDate.getTime() - today.getTime();

  const hasCoupon = coupons.some((c) => c.name === 'Happy Birthday!');

  if (
    !hasCoupon &&
    timeDifference > 0 &&
    timeDifference <= oneWeekInMilliseconds
  ) {
    console.log('🎁 Birthday found! Issuing a coupon...');

    const expiryDate = new Date(birthdayDate);
    expiryDate.setDate(expiryDate.getDate() + 7);

    const newCoupon = {
      id: Math.floor(Math.random() * 100000000),
      name: 'Happy Birthday!',
      used: false,
      expiry_date: expiryDate.toISOString().slice(0, 10),
    };

    const updatedCoupons = [...coupons, newCoupon];
    const updatedPayload = { coupons: updatedCoupons };
    const updatedString = JSON.stringify(updatedPayload);

    await notion.pages.update({
      page_id: pageId,
      properties: {
        coupons: {
          rich_text: [{ type: 'text', text: { content: updatedString } }],
        },
      },
    });

    console.log('✅ Successfully issued birthday coupon.');
    return updatedCoupons;
  }

  return coupons;
};

router.get('/customer', async (req, res) => {
  try {
    const { name, phone } = req.query;
    if (!name || !phone) {
      return res
        .status(400)
        .json({ success: false, message: 'Name and phone are required.' });
    }

    const normalizedPhone = normalizePhoneNumber(phone);

    const queryResponse = await notion.dataSources.query({
      data_source_id: dataSourceId,
      filter: {
        and: [
          { property: 'name', title: { equals: name } },
          {
            property: 'phone_number',
            phone_number: { equals: normalizedPhone },
          },
        ],
      },
    });

    if (queryResponse.results.length === 0) {
      return res.json({
        success: false,
        message: 'The provided information does not match any customer.',
      });
    }

    const matchingCustomer = queryResponse.results[0];
    const pageId = matchingCustomer.id;
    const customerPage = await notion.pages.retrieve({ page_id: pageId });

    const birthdayProp = customerPage.properties.birthday?.date?.start;
    const couponsProp = customerPage.properties.coupons?.rich_text;
    const existingCoupons = parseCouponRichText(couponsProp);

    const customerData = {
      pageId: customerPage.id,
      name: customerPage.properties.name.title[0]?.plain_text || '',
      phone_number: customerPage.properties.phone_number.phone_number || '',
      email: customerPage.properties.email?.email || '',
      purchase_amount: customerPage.properties.purchase_amount?.number || 0,
      tier: customerPage.properties.tier?.formula?.string || '',
      birthday: birthdayProp,
      coupons: existingCoupons,
    };

    const finalCoupons = await checkAndIssueBirthdayCoupon(customerData);
    const finalCustomerData = { ...customerData, coupons: finalCoupons };

    res.json({ success: true, data: finalCustomerData });
  } catch (error) {
    console.error('API Error:', JSON.stringify(error, null, 2));
    res
      .status(500)
      .json({ success: false, message: 'Server error has occurred.' });
  }
});

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
    const couponProp = page.properties?.coupons || page.properties?.Coupons;

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
