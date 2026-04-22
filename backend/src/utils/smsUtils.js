const https = require('https');

const formatPhone = (phone) => {
  if (!phone) return null;
  const cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.startsWith('+')) return cleaned;
  if (cleaned.length === 10) return '+91' + cleaned;
  if (cleaned.length === 12 && cleaned.startsWith('91')) return '+' + cleaned;
  return '+' + cleaned;
};

const sendEmergencySMS = async (contacts, userName, userPhone, userEmail, location, incidentType, conditionDescription, medicalText) => {
  console.log("=== MSG91 SMS START ===");

  if (!contacts || contacts.length === 0) {
    console.warn("No emergency contacts found.");
    console.log("=== MSG91 SMS END ===");
    return;
  }

  const apiKey = process.env.MSG91_API_KEY;
  const senderId = process.env.MSG91_SENDER_ID || 'RAKSHA';

  console.log("MSG91_API_KEY exists:", !!apiKey, apiKey ? "YES" : "NO");
  console.log("MSG91_SENDER_ID:", senderId);

  if (!apiKey || apiKey === 'AddYourMsg91ApiKeyHere') {
    console.warn("MSG91_API_KEY not configured! Add your key in .env file.");
    console.log("=== MSG91 SMS END ===");
    return;
  }

  const lat = location?.lat || 0;
  const lng = location?.lng || 0;
  const mapsUrl = lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : '';
  const locationText = location?.address || 'Location unavailable';

  const displayPhone = userPhone ? formatPhone(userPhone) : 'N/A';

  for (let contact of contacts) {
    const toPhone = formatPhone(contact.phone)?.replace('+', '') || contact.phone;
    console.log("Sending to:", contact.name, "| Phone:", toPhone);

    let message = `EMERGENCY SOS ALERT\n`;
    message += `Name: ${userName}\n`;
    message += `Emergency Type: ${incidentType}\n`;
    if (conditionDescription) message += `Condition: ${conditionDescription}\n`;
    message += `Phone: ${displayPhone}\n`;
    message += `Address: ${locationText}\n`;
    if (mapsUrl) message += `Map: ${mapsUrl}\n`;
    if (medicalText && medicalText.trim()) message += `Medical: ${medicalText}\n`;
    message += `Please help immediately!`;

    console.log("SMS Body:", message);

    try {
      await sendViaMsg91(apiKey, toPhone, message, senderId);
      console.log(`MSG91 SMS SENT to ${contact.name} (${toPhone})`);
    } catch (error) {
      console.error(`MSG91 SMS FAILED:`, error.message);
    }
  }
  console.log("=== MSG91 SMS END ===");
};

const sendViaMsg91 = (apiKey, to, message, senderId) => {
  return new Promise((resolve, reject) => {
    const cleanNumber = String(to).replace(/\D/g, '');
    console.log("Msg91 Clean number:", cleanNumber);

    // Msg91 v5 API - JSON body format
    const payload = JSON.stringify({
      route: 'otp',
      sender: senderId,
      mobiles: cleanNumber,
      message: message
    });

    const options = {
      hostname: 'api.msg91.com',
      path: '/api/v5/sendsms',
      method: 'POST',
      headers: {
        'authkey': apiKey,
        'Content-Type': 'application/json'
      }
    };

    console.log("Trying msg91 v5 API...");
    const req = https.request(options, (res) => {
      console.log("HTTP Status:", res.statusCode);
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log("Msg91 Response:", data);
        try {
          const resp = JSON.parse(data);
          if (resp.type === 'success' || resp.status === 'success' || resp.status === 'success' || (resp && Object.keys(resp).length > 0)) {
            console.log("Msg91 SMS sent successfully!");
            resolve(resp);
          } else {
            reject(new Error('Msg91 error: ' + data));
          }
        } catch (e) {
          reject(new Error('Parse error: ' + data));
        }
      });
    });

    req.on('error', (e) => reject(new Error('Request error: ' + e.message)));
    req.write(payload);
    req.end();
  });
};

const dispatchEmergencyCalls = async (contacts, userName, userPhone, location, incidentType, conditionDescription, medicalText) => {
  console.log("=== TWILIO CALL START ===");

  if (!contacts || contacts.length === 0) {
    console.warn("No contacts for call.");
    return;
  }

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn("Twilio credentials missing.");
    return;
  }

  const lat = location?.lat || 0;
  const lng = location?.lng || 0;
  const locationText = location?.address || (lat ? `${lat}, ${lng}` : 'location unavailable');
  const mapLink = lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : 'location unavailable';
  const displayPhone = userPhone ? formatPhone(userPhone) : 'not provided';

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
    const formattedPhone = formatPhone(contact.phone);
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      const call = await client.calls.create({
        twiml: `<Response><Say>${emergencyMessage}</Say></Response>`,
        to: formattedPhone,
        from: process.env.TWILIO_PHONE_NUMBER
      });
      console.log(`TWILIO CALL MADE to ${contact.name} (${formattedPhone}) | SID: ${call.sid}`);
    } catch (error) {
      console.error(`TWILIO CALL FAILED:`, error.message);
    }
  }
  console.log("=== TWILIO CALL END ===");
};

const sendSMS = async (to, message) => {
  console.log("OTP service is disabled");
};

module.exports = {
  sendEmergencySMS,
  dispatchEmergencyCalls,
  sendSMS
};