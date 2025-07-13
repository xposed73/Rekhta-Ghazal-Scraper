import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim().replace(/&nbsp;/g, ' ');
}

function isUrdu(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

function extractUrduVerses($: cheerio.CheerioAPI): string[] {
  const verses: string[] = [];
  const urduBlocks = $('div[data-roman="off"] .c');

  urduBlocks.each((_, container) => {
    const $container = $(container);
    $container.find('p').each((_, p) => {
      const $p = $(p);
      const spans = $p.find('span');
      const words: string[] = [];
      
      spans.each((_, span) => {
        const text = cleanText($(span).text());
        if (text) {
          words.push(text);
        }
      });

      if (words.length > 0 && words.some(word => isUrdu(word))) {
        const verse = words.join(' ');
        verses.push(verse);
      }
    });
  });

  return verses;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!url.includes('rekhta.org')) {
      return NextResponse.json({ error: 'Only Rekhta.org URLs are supported' }, { status: 400 });
    }

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };

    const response = await axios.get(url, { headers, timeout: 10000 });
    const $ = cheerio.load(response.data);
    
    const verses = extractUrduVerses($);

    if (verses.length === 0) {
      return NextResponse.json({ error: 'No Urdu verses found on the page' }, { status: 404 });
    }

    // Create the text content
    const textContent = verses.join('\n');
    
    // Create filename from URL
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1]?.split('?')[0] || 'ghazal';
    
    return NextResponse.json({
      success: true,
      verses,
      textContent,
      filename: `${filename}.txt`,
      count: verses.length
    });

  } catch (error: any) {
    console.error('Scraping error:', error);
    
    if (error.code === 'ECONNABORTED') {
      return NextResponse.json({ error: 'Request timeout. Please try again.' }, { status: 408 });
    }
    
    if (error.response?.status === 404) {
      return NextResponse.json({ error: 'Page not found. Please check the URL.' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to scrape the page. Please check the URL and try again.' 
    }, { status: 500 });
  }
} 