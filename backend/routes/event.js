require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');
const router = express.Router();

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const eventsDataSourceId = process.env.NOTION_EVENT_DB_SOURCE_ID;

router.get('/', async (req, res) => {
  try {
    const response = await notion.dataSources.query({
      data_source_id: eventsDataSourceId,
      sorts: [
        {
          property: 'status',
          direction: 'ascending',
        },
        {
          property: 'period',
          direction: 'ascending',
        },
      ],
    });

    const eventData = response.results.map((page) => {
      // period 값이 비어있을 경우, 임의의 미래 날짜를 지정하여 정렬 우선순위를 가장 뒤로 보냅니다.
      const rawPeriod = page.properties.period.date;
      const period = rawPeriod
        ? {
            start: rawPeriod.start,
            end: rawPeriod.end,
          }
        : {
            start: null,
            end: '2050-01-01T00:00:00.000Z', // 아주 먼 미래 날짜를 지정
          };

      const eventStatus = page.properties.status.formula?.string || 'N/A';

      return {
        id: page.id,
        event: page.properties.event.title[0]?.plain_text || '',
        period: {
          start: period.start,
          end: period.end,
        },
        status: eventStatus,
      };
    });

    res.status(200).json(eventData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch event data from Notion' });
  }
});

module.exports = router;
