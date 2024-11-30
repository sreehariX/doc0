from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import pandas as pd
import time
import csv
import tiktoken

def count_tokens(text):
    """Count tokens using tiktoken"""
    if not text:
        return 0
    encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(text))

def count_characters(text):
    """Count characters in text"""
    if not text:
        return 0
    return len(str(text))

def setup_driver():
    options = webdriver.ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--start-maximized')
    return webdriver.Chrome(options=options)

def get_page_content(driver, url):
    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div[class*='astro-mduiocwh']"))
        )
        
        main_content = driver.find_element(By.CSS_SELECTOR, "div[class*='astro-mduiocwh']")
        tab_buttons = main_content.find_elements(By.CSS_SELECTOR, "[role='tab']")
        content_texts = []
        
        initial_content = main_content.text
        if initial_content:
            content_texts.append(initial_content)
        
        for tab in tab_buttons:
            try:
                driver.execute_script("arguments[0].click();", tab)
                time.sleep(0.5)
                tab_content = main_content.text
                if tab_content and tab_content not in content_texts:
                    content_texts.append(tab_content)
            except Exception as e:
                print(f"Error clicking tab: {e}")
        
        full_content = "\n\n".join(content_texts)
        return full_content
    except Exception as e:
        print(f"Error on page {url}: {str(e)}")
        return ""

def scrape_astro_docs():
    driver = setup_driver()
    base_url = "https://docs.astro.build"
    results = []
    
    try:
      
        driver.get(f"{base_url}/en/getting-started/")
        
       
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CLASS_NAME, "sidebar-content"))
        )
        
        # Get all links from sidebar
        sidebar_links = driver.find_elements(By.CSS_SELECTOR, ".sidebar-content a")
        urls = []
        
        # Collect all URLs
        for link in sidebar_links:
            href = link.get_attribute('href')
            if href and '/en/' in href and '#' not in href:
                urls.append(href)
        
        # Remove duplicates while maintaining order
        urls = list(dict.fromkeys(urls))
        
        for url in urls:
            print(f"\nScraping: {url}")
            content = get_page_content(driver, url)
            
            token_count = count_tokens(content)
            char_count = count_characters(content)
            
            # Wrap content in triple quotes
            content_wrapped = f'"""{content}"""'
            
            results.append({
                'url': url,
                'content': content_wrapped,
                'token_count': token_count,
                'char_count': char_count,
                'techStackName': 'astro'
            })
            time.sleep(2)
            
        # Custom CSV writing to handle triple quotes
        with open('astro_docs.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            
            # Write header
            writer.writerow(['url', 'content', 'token_count', 'char_count', 'techStackName'])
            
            # Write rows
            for row in results:
                writer.writerow([
                    row['url'],
                    row['content'],
                    row['token_count'],
                    row['char_count'],
                    row['techStackName']
                ])
        
        print("\nScraping completed! Data saved to astro_docs.csv")
        
        # Print summary
        print("\nSummary:")
        print(f"Total pages scraped: {len(results)}")
        total_tokens = sum(row['token_count'] for row in results)
        total_chars = sum(row['char_count'] for row in results)
        print(f"Total tokens: {total_tokens}")
        print(f"Total characters: {total_chars}")
        
        # Print per-page stats
        print("\nPer-page statistics:")
        for row in results:
            print(f"\nURL: {row['url']}")
            print(f"Characters: {row['char_count']}")
            print(f"Tokens: {row['token_count']}")
            
    finally:
        time.sleep(5)
        driver.quit()

if __name__ == "__main__":
    scrape_astro_docs()