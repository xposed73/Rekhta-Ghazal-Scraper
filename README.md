# Rekhta Ghazal Scraper

A beautiful React-based web application that extracts Urdu verses from Rekhta.org ghazals and allows users to download them as text files.

## Features

- 🎯 **Easy URL Input**: Simply paste any Rekhta.org ghazal URL
- 📝 **Urdu Text Extraction**: Automatically extracts Urdu verses using the same logic as the Python scraper
- 👀 **Live Preview**: See the first 3 verses before downloading
- 💾 **File Download**: Download extracted verses as a `.txt` file
- 📋 **Copy to Clipboard**: Copy all verses to clipboard with one click
- 🎨 **Beautiful UI**: Modern, responsive design with dark mode support
- ⚡ **Fast & Reliable**: Built with Next.js for optimal performance

## How It Works

The application uses the same scraping logic as the original Python script:

1. **URL Validation**: Ensures only Rekhta.org URLs are processed
2. **HTML Parsing**: Uses Cheerio to parse the webpage structure
3. **Urdu Detection**: Identifies Urdu text using Unicode ranges
4. **Verse Extraction**: Finds verses in `div[data-roman="off"] .c` containers
5. **Text Cleaning**: Removes extra whitespace and HTML entities

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/xposed73/Rekhta-Ghazal-Scraper.git
cd Rekhta-Ghazal-Scraper
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. Go to [Rekhta.org](https://www.rekhta.org) and find a ghazal
2. Make sure the page is in Urdu language mode
3. Copy the URL of the ghazal page
4. Paste the URL in the application
5. Click "Extract Verses"
6. Download the text file or copy to clipboard

## Example URLs

- `https://www.rekhta.org/ghazals/sitaaron-se-aage-jahaan-aur-bhii-hain-allama-iqbal-ghazals-1?lang=ur`
- `https://www.rekhta.org/ghazals/ye-na-thi-hamari-qismat-ke-wisaal-e-yaar-hota-allama-iqbal-ghazals-1?lang=ur`

## Technical Details

### Frontend
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Features**: Client-side file download, clipboard API

### Backend
- **API Route**: `/api/scrape` (Next.js API route)
- **HTTP Client**: Axios for web requests
- **HTML Parsing**: Cheerio (jQuery-like API for server-side)
- **Error Handling**: Comprehensive error handling with user-friendly messages

### Scraping Logic

The application follows the same pattern as the original Python script:

```typescript
// Clean text function
function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim().replace(/&nbsp;/g, ' ');
}

// Urdu detection using Unicode ranges
function isUrdu(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

// Extract verses from specific DOM elements
function extractUrduVerses($: cheerio.CheerioAPI): string[] {
  const verses: string[] = [];
  const urduBlocks = $('div[data-roman="off"] .c');
  // ... extraction logic
  return verses;
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Disclaimer

This tool is for educational and personal use only. Please respect Rekhta.org's terms of service and use responsibly. The application only extracts publicly available content and does not bypass any access restrictions.
