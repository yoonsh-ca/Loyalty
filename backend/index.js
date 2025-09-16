require('dotenv').config();
const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// CORS & JSON 설정
app.use(cors());
app.use(express.json());

// Notion 클라이언트 초기화
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// env 변수 확인 (디버깅용)
const databaseId = process.env.NOTION_DATABASE_ID;
const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;
console.log('Database ID:', databaseId);
console.log('Data Source ID:', dataSourceId);

// API EndPoint: Lookup specific customer
app.get('/api/customer', async (req, res) => {
  try {
    console.log('API call received.');
    const { name, phone } = req.query;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required.',
      });
    }

    console.log('Querying Notion with:', { name, phone });

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

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
