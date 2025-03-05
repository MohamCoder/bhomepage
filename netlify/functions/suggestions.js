const axios = require('axios');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

exports.handler = async (event, context) => {
  const query = event.queryStringParameters.q;
  if (!query) {
    return { 
      statusCode: 400,
      body: JSON.stringify({ error: "Missing query parameter 'q'" })
    };
  }

  const googleUrl = `https://suggestqueries.google.com/complete/search?output=toolbar&hl=en&q=${query}`;

  try {
    const response = await axios.get(googleUrl);
    const result = await parser.parseStringPromise(response.data);
    
    const suggestions = result.toplevel.CompleteSuggestion.map(
      item => item.suggestion[0].$.data
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',  // CORS header
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(suggestions)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error fetching suggestions" })
    };
  }
};
