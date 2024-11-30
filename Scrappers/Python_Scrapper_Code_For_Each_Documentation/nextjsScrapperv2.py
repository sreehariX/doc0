from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
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
    print("Setting up the WebDriver.")
    options = webdriver.ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--start-maximized')
    return webdriver.Chrome(options=options)

def get_page_content(driver, url):
    try:
        print(f"Navigating to URL: {url}")
        driver.get(url)
        
        
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "article[data-docs-container]"))
        )
        
        print("Extracting main content from the page.")
        main_content = driver.find_element(By.CSS_SELECTOR, "article[data-docs-container]")
        content_text = main_content.text
        
        print(f"Content extracted from {url}: {content_text[:100]}...")  # Print first 100 characters for debugging
        return content_text
    except Exception as e:
        print(f"Error on page {url}: {str(e)}")
        return ""

def scrape_nextjs_docs():
    driver = setup_driver()
    base_url = "https://nextjs.org/docs/app"
    results = []
    
    try:
        driver.get(base_url)
        
        
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "nav.styled-scrollbar a"))
        )
        
        
        sidebar_links = driver.find_elements(By.CSS_SELECTOR, "nav.styled-scrollbar a")
        urls = []
        
     
        for link in sidebar_links:
            href = link.get_attribute('href')
            if href and '/docs/' in href and '#' not in href:
                urls.append(href)
        
      
        urls = list(dict.fromkeys(urls))
        
        for url in urls:
            print(f"Scraping: {url}")
            content = get_page_content(driver, url)
            
            token_count = count_tokens(content)
            char_count = count_characters(content)
            
            
            content_wrapped = f'"""{content}"""'
            
            results.append({
                'url': url,
                'content': content_wrapped,
                'token_count': token_count,
                'char_count': char_count,
                'techStackName': 'nextjs'
            })
            time.sleep(2)  
            
       
        print("Writing results to CSV file.")
        with open('docs_nextjs.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
            
            
            writer.writerow(['url', 'content', 'token_count', 'char_count', 'techStackName'])
            
       
            for row in results:
                writer.writerow([
                    row['url'],
                    row['content'],
                    row['token_count'],
                    row['char_count'],
                    row['techStackName']
                ])
        
        print("Scraping completed! Data saved to docs_nextjs.csv")
        
      
        print("\nScraping Summary:")
        print(f"Total pages scraped: {len(results)}")
        total_tokens = sum(row['token_count'] for row in results)
        total_chars = sum(row['char_count'] for row in results)
        print(f"Total tokens: {total_tokens}")
        print(f"Total characters: {total_chars}")
        
    
        print("Per-page statistics:")
        for row in results:
            print(f"URL: {row['url']}")
            print(f"Characters: {row['char_count']}")
            print(f"Tokens: {row['token_count']}")
            
    finally:
        print("Closing the WebDriver.")
        time.sleep(5)
        driver.quit()

if __name__ == "__main__":
    scrape_nextjs_docs()                                                            