const twilio = require('twilio');

const dispatchAutomatedCalls = async (contacts, userName, incidentType) => {
  const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  for (let contact of contacts) {
    await client.calls.create({
      twiml: `<Response><Say>Emergency Alert from RakshaNow. ${userName} has triggered a ${incidentType} SOS. Please check the app immediately for their live coordinates.</Say></Response>`,
      to: contact.phone,
      from: process.env.TWILIO_PHONE_NUMBER
    });
  }
};

module.exports = { dispatchAutomatedCalls };