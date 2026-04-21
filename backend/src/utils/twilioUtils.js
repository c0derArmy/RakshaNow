const twilio = require('twilio');

const dispatchEmergencyCalls = async (contacts, userName, userPhone, location, incidentType) => {
  if (!process.env.TWILIO_PHONE_NUMBER) {
    console.warn("⚠️ TWILIO_PHONE_NUMBER not configured. Skipping calls.");
    return;
  }

  try {
    const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    const locationText = location?.address || location?.lat ? `${location.lat} and ${location.lng}` : 'location unavailable';
    const emergencyMessage = `URGENT EMERGENCY! EMERGENCY! ${userName} is in DANGER! Please help this person! Go to their location NOW! Location: ${locationText}. This is a real emergency. Please take action right now and help them!`;

    for (let contact of contacts) {
      await client.calls.create({
        twiml: `<Response><Say>${emergencyMessage}</Say></Response>`,
        to: contact.phone,
        from: process.env.TWILIO_PHONE_NUMBER
      });
      console.log(`📞 Emergency call made to ${contact.phone}`);
    }
  } catch (error) {
    console.error("Twilio Emergency Call Failed:", error.message);
  }
};

const sendEmergencySMS = async (contacts, userName, userPhone, location, incidentType) => {
  if (!process.env.TWILIO_PHONE_NUMBER) {
    console.warn("⚠️ TWILIO_PHONE_NUMBER not configured. Skipping SMS.");
    return;
  }

  try {
    const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    const locationText = location?.address || (location?.lat ? `https://maps.google.com/?q=${location.lat},${location.lng}` : 'Location unavailable');
    const message = `🚨 RAKSHANOW EMERGENCY 🚨\n\n${userName} has triggered ${incidentType} SOS.\nLocation: ${locationText}\nPhone: ${userPhone || 'N/A'}\n\nPlease help immediately!`;

    for (let contact of contacts) {
      await client.messages.create({
        body: message,
        to: contact.phone,
        from: process.env.TWILIO_PHONE_NUMBER
      });
    }
    console.log(`✅ Emergency SMS sent to contacts`);
  } catch (error) {
    console.error("Twilio Emergency SMS Failed:", error.message);
  }
};

const dispatchAutomatedCalls = async (contacts, userName, incidentType) => {
  if (!process.env.TWILIO_PHONE_NUMBER) {
    console.warn("⚠️ TWILIO_PHONE_NUMBER not configured. Skipping automated calls.");
    return;
  }

  try {
    const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    for (let contact of contacts) {
      await client.calls.create({
        twiml: `<Response><Say>Emergency Alert from RakshaNow. ${userName} has triggered a ${incidentType} SOS. Please check the app immediately for their live coordinates.</Say></Response>`,
        to: contact.phone,
        from: process.env.TWILIO_PHONE_NUMBER
      });
    }
  } catch (error) {
    console.error("Twilio Call Dispatch Failed:", error.message);
  }
};

const sendSMS = async (to, message) => {
  if (!process.env.TWILIO_PHONE_NUMBER) {
    console.warn("⚠️ TWILIO_PHONE_NUMBER not configured. Skipping SMS.");
    return;
  }

  try {
    const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: message,
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    console.log(`✅ SMS sent to ${to}`);
  } catch (error) {
    console.error("Twilio SMS Failed:", error.message);
  }
};

module.exports = { 
  dispatchAutomatedCalls, 
  sendSMS, 
  dispatchEmergencyCalls,
  sendEmergencySMS 
};