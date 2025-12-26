# MedSecure (minimal)

This is a minimal hospital-management auth demo.

Features implemented:
- Login (email + password)
- Signup (only allowed if email exists in `Staff` collection)
- Forgot password (asks for current password and new password twice)

Setup

1. Install dependencies

```bash
npm install
```

2. Seed sample staff emails (so signup is allowed for those emails)

```bash
npm run seed
```

3. Start the server

```bash
npm start
```

Open http://localhost:3000

Notes
- MongoDB default URI used: `mongodb://localhost:27017/med_secure`. You can set `MONGO_URI` env var.
- The `signup` route checks the `Staff` collection; only emails present there can create accounts.
