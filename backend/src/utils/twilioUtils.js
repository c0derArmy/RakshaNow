const twilio = require('twilio');

const formatPhoneNumber = (phone) => {
  if (!phone) return null;
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.length === 10) return '+91' + cleaned;
  if (cleaned.length === 12 && cleaned.startsWith('91')) return '+' + cleaned;
  return '+' + cleaned;
};

const sendEmergencySMS = async (contacts, userName, userPhone, userEmail, location, incidentType, conditionDescription, medicalText) => {
  console.log("=== TWILIO SMS START ===");

  if (!contacts || contacts.length === 0) {
    console.warn("No emergency contacts found. SMS not sent.");
    console.log("=== TWILIO SMS END ===");
    return;
  }

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn("Twilio env vars missing. SID:", !!process.env.TWILIO_ACCOUNT_SID, "TOKEN:", !!process.env.TWILIO_AUTH_TOKEN, "PHONE:", !!process.env.TWILIO_PHONE_NUMBER);
    console.log("=== TWILIO SMS END ===");
    return;
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  const lat = location?.lat || 0;
  const lng = location?.lng || 0;
  const mapsUrl = lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : '';
  const locationText = location?.address || 'Location unavailable';

  const displayPhone = userPhone ? formatPhoneNumber(userPhone) : 'N/A';

  for (let contact of contacts) {
    const formattedPhone = formatPhoneNumber(contact.phone);
    console.log("SMS to:", contact.name, "| Phone:", formattedPhone);

    let message = `Emergency Alert: ${userName} needs assistance.\n`;
    message += `Contact: ${displayPhone}\n`;
    message += `Location: ${locationText}\n`;
    if (mapsUrl) message += `Map: ${mapsUrl}\n`;
    if (medicalText && medicalText.trim()) message += `Medical Info: ${medicalText}\n`;
    message += `Please help immediately!`;

    console.log("SMS Body:", message);

    try {
      const msg = await client.messages.create({
        body: message,
        to: formattedPhone,
        from: process.env.TWILIO_PHONE_NUMBER
      });
      console.log(`✅ TWILIO SMS to ${contact.name}:`, msg.sid, "| Status:", msg.status);
    } catch (error) {
      console.error(`❌ TWILIO SMS FAILED to ${contact.name}:`, error.message);
      if (error.code) console.error("Error code:", error.code);
      if (error.status) console.error("Error status:", error.status);
    }
  }
  console.log("=== TWILIO SMS END ===");
};

const dispatchEmergencyCalls = async (contacts, userName, userPhone, location, incidentType, conditionDescription, medicalText) => {
  console.log("=== TWILIO CALL START ===");

  if (!contacts || contacts.length === 0) {
    console.warn("No contacts for call.");
    console.log("=== TWILIO CALL END ===");
    return;
  }

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn("Twilio credentials missing.");
    console.log("=== TWILIO CALL END ===");
    return;
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  const lat = location?.lat || 0;
  const lng = location?.lng || 0;
  const locationText = location?.address || (lat ? `${lat}, ${lng}` : 'location unavailable');
  const mapLink = lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : 'location unavailable';
  const displayPhone = userPhone ? formatPhoneNumber(userPhone) : 'not provided';

  let emergencyMessage = `Emergency SOS from RakshaNow. `;
  emergencyMessage += `Name: ${userName}. `;
  emergencyMessage += `Type: ${incidentType}. `;
  if (conditionDescription) emergencyMessage += `What happened: ${conditionDescription}. `;
  emergencyMessage += `Phone: ${displayPhone}. `;
  emergencyMessage += `Address: ${locationText}. `;
  if (mapLink !== 'location unavailable') emergencyMessage += `Map: ${mapLink}. `;
  if (medicalText && medicalText.trim()) emergencyMessage += `Medical: ${medicalText}. `;
  emergencyMessage += `Please help immediately!`;

  for (let contact of contacts) {
    const formattedPhone = formatPhoneNumber(contact.phone);
    console.log("Calling:", contact.name, "| Phone:", formattedPhone);

    try {
      const call = await client.calls.create({
        twiml: `<Response><Say>${emergencyMessage}</Say></Response>`,
        to: formattedPhone,
        from: process.env.TWILIO_PHONE_NUMBER
      });
      console.log(`✅ TWILIO CALL to ${contact.name}:`, call.sid);
    } catch (error) {
      console.error(`❌ TWILIO CALL FAILED to ${contact.name}:`, error.message);
      if (error.code) console.error("Error code:", error.code);
    }
  }
  console.log("=== TWILIO CALL END ===");
};

const sendSMS = async (to, message) => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn("Twilio credentials missing.");
    return;
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const formattedPhone = formatPhoneNumber(to);

  try {
    const msg = await client.messages.create({
      body: message,
      to: formattedPhone,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    console.log(`✅ SMS to ${formattedPhone}:`, msg.sid);
  } catch (error) {
    console.error("SMS failed:", error.message);
    if (error.code) console.error("Error code:", error.code);
  }
};

const sendAutomatedCalls = async (to, message) => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    return;
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const formattedPhone = formatPhoneNumber(to);

  await client.calls.create({
    twiml: `<Response><Say>${message}</Say></Response>`,
    to: formattedPhone,
    from: process.env.TWILIO_PHONE_NUMBER
  });
};

module.exports = {
  sendEmergencySMS,
  dispatchEmergencyCalls,
  sendSMS,
  sendAutomatedCalls,
  formatPhoneNumber
};