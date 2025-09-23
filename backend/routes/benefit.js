require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');
const router = express.Router();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const benefitsDataSourceId = process.env.NOTION_BENEFIT_DB_SOURCE_ID;

router.get('/', async (req, res) => {
  try {
    const response = await notion.dataSources.query({
      data_source_id: benefitsDataSourceId,
      sorts: [
        {
          property: 'min_spending',
          direction: 'ascending',
        },
      ],
    });

    const benefitData = response.results.map((page) => {
      let benefitsArray = [];
      try {
        const benefitsText = page.properties.benefits.rich_text[0]?.plain_text;
        if (benefitsText) {
          benefitsArray = JSON.parse(benefitsText);
        }
      } catch (e) {
        console.error('Failed to parse benefits JSON:', e);
      }

      return {
        id: page.id,
        tier: page.properties.tier.title[0]?.plain_text || '',
        benefits: benefitsArray,
        min_spending: page.properties.min_spending.number || 0,
      };
    });

    res.status(200).json(benefitData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch benefit data from Notion' });
  }
});

module.exports = router;
