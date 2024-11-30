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
        
      
        content_selectors = [
            "main article",
            "article[itemtype='http://schema.org/Article']",
            "div[role='main']"
        ]
        
        for selector in content_selectors:
            try:
                WebDriverWait(driver, 5).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                )
                main_content = driver.find_element(By.CSS_SELECTOR, selector)
                break
            except:
                continue
        else:
            print(f"Could not find main content for {url}")
            return ""
        
        
        content_parts = []
        

        headings = main_content.find_elements(By.CSS_SELECTOR, "h1, h2, h3, h4, h5, h6")
        for heading in headings:
            content_parts.append(f"\n# {heading.text}\n")
            

        text_elements = main_content.find_elements(By.CSS_SELECTOR, "p, li")
        for elem in text_elements:
            content_parts.append(elem.text)
            
  
        code_blocks = main_content.find_elements(By.CSS_SELECTOR, "pre code")
        for code in code_blocks:
            language = code.get_attribute("class") or ""
            if "language-" in language:
                language = language.split("language-")[1].split()[0]
            else:
                language = ""
            content_parts.append(f"\n```{language}\n{code.text}\n```\n")
        
        content_text = "\n".join(content_parts)
        
        print(f"Content extracted from {url}: {content_text[:100]}...")  # Print first 100 characters for debugging
        return content_text
    except Exception as e:
        print(f"Error on page {url}: {str(e)}")
        return ""

def scrape_react_docs():
    driver = setup_driver()
    urls_to_scrape = [
        "https://react.dev/learn/reusing-logic-with-custom-hooks",
        "https://react.dev/reference/react/PureComponent",
        "https://react.dev/community"
    ]
    results = []
    
    try:
        for initial_url in urls_to_scrape:
            print(f"Processing section starting at: {initial_url}")
            driver.get(initial_url)
            time.sleep(2)
            
          
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "nav[role='navigation']"))
            )
            
           
            section_urls = []
            
            if "learn" in initial_url:
              
                sidebar_items = driver.find_elements(By.CSS_SELECTOR, "nav[role='navigation'] a[href^='/learn']")
                for item in sidebar_items:
                    url = item.get_attribute('href')
                    if url and url.startswith('https://react.dev/learn/'):
                        section_urls.append(url)
                        
            elif "reference" in initial_url:
           
                sidebar_items = driver.find_elements(By.CSS_SELECTOR, "nav[role='navigation'] a[href^='/reference']")
                for item in sidebar_items:
                    url = item.get_attribute('href')
                    if url and url.startswith('https://react.dev/reference/'):
                        section_urls.append(url)
                        
            elif "community" in initial_url:
               
                sidebar_items = driver.find_elements(By.CSS_SELECTOR, "nav[role='navigation'] a[href^='/community']")
                for item in sidebar_items:
                    url = item.get_attribute('href')
                    if url and url.startswith('https://react.dev/community/'):
                        if 'versioning-policy' in url:
                            section_urls.append(url)
                            break  
                        section_urls.append(url)
            
            for url in section_urls:
                print(f"Scraping: {url}")
                content = get_page_content(driver, url)
                
                token_count = count_tokens(content)
                char_count = count_characters(content)
                
                results.append({
                    'url': url,
                    'content': f'"""{content}"""',
                    'token_count': token_count,
                    'char_count': char_count,
                    'techStackName': 'react'
                })
                time.sleep(2)  
        
       
        print("Writing results to CSV file.")
        with open('docs_react.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
           
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
        
        print("Scraping completed! Data saved to docs_react.csv")
        
        # Print summary
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
    scrape_react_docs()                                                            