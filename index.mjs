/* global fetch */

export const handler = async (event) => {
  for (const record of event.Records) {
    // Check if the event is an insert event to the DynamoDB table
    if (record.eventName === 'INSERT' && record.eventSourceARN.includes('table/assessments')) {
      // Extract assessment from the new item
      const assessment = record.dynamodb.NewImage;

      // Basic validation to ensure we have an assessment and a company_id
      if (!assessment || !assessment.company_id) return;

      try {
        // Send a POST request to the endpoint using fetch
        const response = await fetch('https://plannlyhealth-api-dev.up.railway.app/risk-profiles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(assessment),
        });
        console.log('SUCCESS: ', response)

        if (response.ok) {
          console.log(`Assessment data sent for user with id ${assessment.user_id.S}`);
        } else {
          console.error(`Failed to send assessment data for user with id ${assessment.user_id.S}. Status: ${response.status}`);
        }
      } catch (error) {
        console.log('ERROR: ', error)
        console.error(`Failed to send assessment data for user with id ${assessment.user_id.S}`);
      }
    }
  }

  return { statusCode: 200, body: JSON.stringify(event) };
};
