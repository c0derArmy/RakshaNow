# RakshaNow

**Emergency Alert System**

RakshaNow is a mobile application designed to send emergency alerts to police, doctors, and emergency services based on the incident report submitted by the user.

---

## What RakshaNow Does

- **Report Emergency** - Users can report emergencies (accident, crime, medical, fire, etc.)
- **Send Alert to Authorities** - The app sends the emergency alert to police, doctors, and relevant services
- **AI Classification** - Automatically identifies the type of emergency
- **Share Location** - Sends user's exact location along with the alert
- **Notify Emergency Contacts** - Automatically calls emergency contacts with the alert details
- **Medical ID** - Stores user's medical information (blood type, allergies) for responders

---

## How It Works

1. User reports an emergency (voice or manual)
2. App captures the user's location
3. AI classifies the emergency type
4. Alert is sent to police/medical services
5. Emergency contacts receive automatic phone calls
6. Responders view and handle the incident

---

## Tech Stack

- **Frontend:** React Native (Mobile App)
- **Backend:** Express.js (Node.js)
- **Database:** MongoDB
- **AI:** Google Generative AI
- **Notifications:** Twilio (Voice calls)
- **Auth:** Firebase + JWT

---

## Setup

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd RakshaNow
npm install
npx react-native run-android
```

---

**Stay Safe with RakshaNow**
