const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
    let executablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    if (!fs.existsSync(executablePath)) {
        executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    }
    
    console.log('Using browser:', executablePath);
    
    const browser = await puppeteer.launch({
        executablePath,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    // Set a predictable viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    console.log('Page loaded');
    
    await page.waitForSelector('[id^="hbar-"]');
    const hBarId = await page.evaluate(() => {
        const el = document.querySelector('[id^="hbar-"]');
        return el ? el.id : null;
    });
    
    if (!hBarId) {
        console.log('No hBar found!');
        await browser.close();
        return;
    }
    
    console.log('Found hBar:', hBarId);
    
    await page.evaluate((id) => {
        document.getElementById(id).scrollIntoView({ behavior: 'instant', block: 'center' });
    }, hBarId);
    await new Promise(r => setTimeout(r, 500));
    
    const rect = await page.evaluate((id) => {
        const el = document.getElementById(id);
        const bounds = el.getBoundingClientRect();
        return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
    }, hBarId);
    
    console.log('Hovering at:', rect.x, rect.y);
    await page.mouse.move(rect.x, rect.y);
    await new Promise(r => setTimeout(r, 1500));
    
    console.log('Starting trace...');
    await page.tracing.start({ path: 'trace.json', screenshots: true });
    
    console.log('Triggering collapse...');
    await page.mouse.move(0, 0);
    
    console.log('Waiting for collapse...');
    await new Promise(r => setTimeout(r, 600)); // Just 600ms to capture the collapse
    
    console.log('Stopping trace...');
    await page.tracing.stop();
    await browser.close();
    
    console.log('Extracting screenshots from trace...');
    const traceData = JSON.parse(fs.readFileSync('trace.json', 'utf8'));
    
    const framesDir = path.join(__dirname, 'scratch', 'frames');
    if (!fs.existsSync(framesDir)) {
        fs.mkdirSync(framesDir, { recursive: true });
    }
    
    let frameCount = 0;
    for (const event of traceData.traceEvents) {
        if (event.name === 'Screenshot' && event.args && event.args.snapshot) {
            const buffer = Buffer.from(event.args.snapshot, 'base64');
            fs.writeFileSync(path.join(framesDir, `frame_${String(frameCount).padStart(3, '0')}.png`), buffer);
            frameCount++;
        }
    }
    
    console.log(`Extracted ${frameCount} frames to scratch/frames/`);
})();
