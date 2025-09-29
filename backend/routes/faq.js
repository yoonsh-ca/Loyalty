require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');
const router = express.Router();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const faqDataSourceId = process.env.NOTION_FAQ_DB_SOURCE_ID;
console.log(faqDataSourceId);

router.get('/', async (req, res) => {
  try {
    const response = await notion.dataSources.query({
      data_source_id: faqDataSourceId,
      filter: {
        property: 'status',
        select: {
          equals: 'published',
        },
      },
    });

    const faqData = response.results.map((page) => {
      return {
        id: page.id,
        question: page.properties.question.title[0]?.plain_text || '',
        answer: page.properties.answer.rich_text[0]?.plain_text || '',
        category: page.properties.category?.select?.name || 'etc',
      };
    });

    res.status(200).json(faqData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch FAQ data from Notion' });
  }
});

module.exports = router;
