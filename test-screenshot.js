/**
 * Screenshot capture script for Market Opportunity section
 * Run with: node test-screenshot.js
 * Requires: npm install puppeteer
 */

const puppeteer = require('puppeteer');

async function captureMarketSection() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to localhost:3000...');
    await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle0',
      timeout: 10000 
    });
    
    console.log('Waiting for page to load...');
    await page.waitForTimeout(2000);
    
    // Find the Market Opportunity section
    console.log('Scrolling to Market Opportunity section...');
    await page.evaluate(() => {
      const marketSection = document.querySelector('#market');
      if (marketSection) {
        marketSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    
    await page.waitForTimeout(1500);
    
    // Take screenshot 1: Full TAM funnel in view
    console.log('Taking screenshot 1: TAM funnel...');
    const funnelElement = await page.$('.rounded-xl.border.border-slate-200.bg-white');
    if (funnelElement) {
      await funnelElement.screenshot({ 
        path: 'market-funnel-full.png',
        type: 'png'
      });
      console.log('✓ Saved: market-funnel-full.png');
    }
    
    // Get the bounding box of the funnel card
    const boundingBox = await page.evaluate(() => {
      const card = document.querySelector('.rounded-xl.border.border-slate-200.bg-white');
      if (!card) return null;
      const rect = card.getBoundingClientRect();
      return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        scrollY: window.scrollY
      };
    });
    
    console.log('Funnel card dimensions:', boundingBox);
    
    // Check if CAGR callout is visible
    const cagrInfo = await page.evaluate(() => {
      const cagrElement = document.evaluate(
        "//span[contains(text(), '8.2% CAGR')]",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      
      if (!cagrElement) return { found: false };
      
      const rect = cagrElement.getBoundingClientRect();
      const parent = cagrElement.closest('.mt-6');
      const parentRect = parent?.getBoundingClientRect();
      
      return {
        found: true,
        visible: rect.top >= 0 && rect.bottom <= window.innerHeight,
        rect: {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height
        },
        parentRect: parentRect ? {
          top: parentRect.top,
          bottom: parentRect.bottom,
          height: parentRect.height
        } : null,
        computedStyle: parent ? window.getComputedStyle(parent).opacity : null
      };
    });
    
    console.log('CAGR callout info:', cagrInfo);
    
    // Scroll slightly down to see below the funnel
    console.log('Scrolling down slightly...');
    await page.evaluate(() => {
      window.scrollBy({ top: 200, behavior: 'smooth' });
    });
    
    await page.waitForTimeout(1000);
    
    // Take screenshot 2: Scrolled view
    console.log('Taking screenshot 2: Scrolled view...');
    await page.screenshot({ 
      path: 'market-section-scrolled.png',
      type: 'png',
      fullPage: false
    });
    console.log('✓ Saved: market-section-scrolled.png');
    
    // Get SOM tier info
    const somInfo = await page.evaluate(() => {
      const somElements = Array.from(document.querySelectorAll('span')).filter(
        el => el.textContent.trim() === 'SOM'
      );
      
      if (somElements.length === 0) return { found: false };
      
      const somElement = somElements[0];
      const tierContainer = somElement.closest('.rounded-lg');
      const rect = tierContainer?.getBoundingClientRect();
      
      return {
        found: true,
        visible: rect && rect.top >= 0 && rect.bottom <= window.innerHeight,
        rect: rect ? {
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height,
          width: rect.width
        } : null
      };
    });
    
    console.log('SOM tier info:', somInfo);
    
    // Check for overflow/clipping issues
    const overflowCheck = await page.evaluate(() => {
      const card = document.querySelector('.rounded-xl.border.border-slate-200.bg-white');
      if (!card) return null;
      
      const cardStyle = window.getComputedStyle(card);
      const cardRect = card.getBoundingClientRect();
      
      // Find all children
      const children = Array.from(card.children);
      const lastChild = children[children.length - 1];
      const lastChildRect = lastChild?.getBoundingClientRect();
      
      return {
        cardOverflow: cardStyle.overflow,
        cardOverflowY: cardStyle.overflowY,
        cardHeight: cardRect.height,
        cardBottom: cardRect.bottom,
        lastChildBottom: lastChildRect?.bottom,
        isClipped: lastChildRect ? lastChildRect.bottom > cardRect.bottom : false
      };
    });
    
    console.log('Overflow check:', overflowCheck);
    
    console.log('\n=== SUMMARY ===');
    console.log(`Funnel card found: ${!!boundingBox}`);
    console.log(`CAGR callout found: ${cagrInfo.found}`);
    console.log(`CAGR callout visible: ${cagrInfo.visible}`);
    console.log(`SOM tier found: ${somInfo.found}`);
    console.log(`SOM tier visible: ${somInfo.visible}`);
    console.log(`Content clipped: ${overflowCheck?.isClipped}`);
    
    console.log('\nScreenshots saved to current directory.');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
}

captureMarketSection();
