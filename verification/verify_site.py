from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Determine the absolute path to the index.html file
        file_path = os.path.abspath('index.html')
        page.goto(f'file://{file_path}')

        # Wait for the page to load content
        page.wait_for_timeout(2000)

        # Take a screenshot
        page.screenshot(path='verification/verification.png')

        browser.close()

if __name__ == '__main__':
    run()
