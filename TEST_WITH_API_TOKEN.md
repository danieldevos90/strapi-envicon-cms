# Testing Article Creation with API Token

## The Script Needs an API Token

The test script requires an API token to authenticate with Strapi.

## Three Ways to Provide the Token

### Option 1: Pass Token as Argument (Easiest)

```bash
npm run test:article:logs YOUR_API_TOKEN_HERE
```

Example:
```bash
npm run test:article:logs 2ec4867ccf501bf9a1ae5361091007c9a1027c9f04fa8db31a5bdef0a59fe495e17a0d1caef7607b072b69d794b37a8997ac9ff06bf607db3f19c0bdb6f885a9b7cc1afb0ed37fc87d3f5773a918d8672be66b4f573ec1ff623255600fb8003885f64112d3e7648fb11aac3784aa5544a6fb896082c4523fe1a3036739060b3a
```

### Option 2: Set in .env File

1. Edit `.env` file in Plesk File Manager
2. Add:
   ```
   STRAPI_API_TOKEN=your_token_here
   ```
3. Run:
   ```bash
   npm run test:article:logs
   ```

### Option 3: Set as Environment Variable

```bash
STRAPI_API_TOKEN=your_token_here npm run test:article:logs
```

## Get API Token

1. Go to `https://cms.envicon.nl/admin`
2. Navigate to **Settings** → **API Tokens**
3. Click **Create new API Token**
4. Name it "Test Token" or similar
5. Select **Full access** or at least **Article** read/write permissions
6. Copy the token

## Quick Test

Once you have the token:

```bash
npm run test:article:logs YOUR_TOKEN
```

This will show full request/response logs and help identify any issues.

