from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, StaleElementReferenceException
import time
import yaml
import os
from datetime import datetime

def count_characters(text):
    """Count characters in text"""
    if not text:
        return 0
    return len(str(text))

def estimate_tokens(text):
    """Estimate tokens based on character count (rough approximation)"""
    char_count = count_characters(text)
    # Using the 4 characters per token approximation
    return (char_count + 3) // 4

def setup_driver(headless=True):
    print("Setting up the WebDriver.")
    options = webdriver.ChromeOptions()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--start-maximized')
    
    if headless:
        options.add_argument('--headless')
 
    return webdriver.Chrome(options=options)

def get_page_content(driver, url):
    try:
        print(f"Navigating to URL: {url}")
        driver.get(url)
        
        # Wait for content to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "main"))
        )
        
        print("Extracting main content from the page.")
        main_content = driver.find_element(By.CSS_SELECTOR, "main")
        content_text = main_content.text
        
        print(f"Content extracted from {url}: {content_text[:100]}...")  # Print first 100 characters for debugging
        return content_text
    except Exception as e:
        print(f"Error on page {url}: {str(e)}")
        return ""

def save_to_yaml(data_item, filename="golem_docs.yaml"):
    """Save the data to a YAML file in the specified format with proper pipe character for content"""
    try:
        # Load existing data if file exists, otherwise create new structure
        yaml_dict = {"golem": []}
        
        if os.path.exists(filename):
            try:
                with open(filename, 'r', encoding='utf-8') as file:
                    file_content = file.read().strip()
                    if file_content and file_content != "golem:":
                        yaml_dict = yaml.safe_load(file_content)
                    # If file just contains "golem:" with no entries, we'll use our empty list
            except Exception as e:
                print(f"Error reading existing YAML file: {str(e)}, creating new file")
        
        # Determine the next ID
        next_id = 1
        if yaml_dict and "golem" in yaml_dict and yaml_dict["golem"]:
            # Get the highest ID and increment by 1
            existing_ids = [item.get("id_parent", 0) for item in yaml_dict["golem"]]
            if existing_ids:
                next_id = max(existing_ids) + 1
        
        # Add ID to the data item
        data_item["id_parent"] = next_id
        
        # Add the new item to the list
        if "golem" not in yaml_dict:
            yaml_dict["golem"] = []
        yaml_dict["golem"].append(data_item)
        
        # Create a properly formatted YAML file manually
        with open(filename, 'w', encoding='utf-8') as file:
            file.write("golem:\n")
            
            for entry in yaml_dict["golem"]:
                file.write(f"- id_parent: {entry['id_parent']}\n")
                file.write(f"  title: {entry['title']}\n")
                file.write(f"  url: {entry['url']}\n")
                file.write("  content: |\n")
                
                # Make sure content is a string and split by lines
                content_str = str(entry['content'])
                for line in content_str.split('\n'):
                    # Ensure each line has proper indentation
                    file.write(f"    {line}\n")
                
                file.write(f"  section: {entry['section']}\n")
                file.write(f"  char_count: {entry['char_count']}\n")
                file.write(f"  approx_token_count: {entry['approx_token_count']}\n")
        
        print(f"Data saved to {filename} with ID {next_id}")
        return next_id
    except Exception as e:
        print(f"Error saving to YAML: {str(e)}")
        return None

def get_section_path_from_url(url):
    """Extract section path from URL to build proper breadcrumbs"""
    # Remove domain part and trailing slash
    base = "https://learn.golem.cloud/"
    path = url.replace(base, "").strip("/")
    
    # If empty, it's the homepage
    if not path:
        return ["Home"]
    
    # Split the path into parts and capitalize for readability
    path_parts = path.split("/")
    return [part.replace("-", " ").capitalize() for part in path_parts]

def expand_all_sidebar_sections(driver):
    """Expand all collapsible sections in the sidebar to reveal all links"""
    try:
        print("Attempting to expand all nextra sidebar sections...")
        
        # Wait for sidebar to load using the new class structure
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "aside.nextra-sidebar-container"))
        )
        
        # This script will find and click all expandable items in the Nextra sidebar
        expand_script = """
        function expandAllSidebarItems() {
            // Find all items with an SVG inside them (these are typically expandable items in Nextra)
            const expandableItems = document.querySelectorAll('aside.nextra-sidebar-container a svg, aside.nextra-sidebar-container button svg');
            let clickedCount = 0;
            
            // Process each potentially expandable item
            expandableItems.forEach(svg => {
                // Get the parent element (the clickable link/button)
                const parentElement = svg.closest('a, button');
                if (!parentElement) return;
                
                // Check if this is a collapsed section by looking at siblings or children
                const isCollapsed = (() => {
                    // Check if there's a hidden div following this item 
                    const nextDiv = parentElement.nextElementSibling;
                    if (nextDiv && nextDiv.style.height === '0px') return true;
                    
                    // Check for collapsed state in parent
                    const parentClasses = parentElement.className || '';
                    if (parentClasses.includes('nx-text-gray-500') || 
                        parentClasses.includes('nx-text-neutral-400')) return true;
                        
                    // Check for SVG rotation (common indicator in Nextra)
                    const svgTransform = window.getComputedStyle(svg).transform;
                    // If no rotation or default rotation, it's likely collapsed
                    if (svgTransform === 'none' || svgTransform.includes('rotate(0)')) return true;
                    
                    return false;
                })();
                
                if (isCollapsed) {
                    try {
                        parentElement.click();
                        clickedCount++;
                    } catch (e) {
                        console.error("Failed to click element:", e);
                    }
                }
            });
            
            return clickedCount;
        }
        
        // Run expansion multiple times to catch nested items
        let totalExpanded = 0;
        for (let i = 0; i < 5; i++) {
            // Wait a bit between iterations
            if (i > 0) {
                setTimeout(() => {}, 500);
            }
            const expanded = expandAllSidebarItems();
            totalExpanded += expanded;
            // If nothing expanded in this iteration after the first couple tries, we can stop
            if (expanded === 0 && i > 1) break;
        }
        
        return totalExpanded;
        """
        
        # Execute the expansion script
        expanded_count = driver.execute_script(expand_script)
        print(f"Expanded {expanded_count} sections using JavaScript")
        
        # Additional fallback approach using direct Selenium selection
        # for nested links that might not have been caught by the script
        try:
            # Look for elements with SVG icons (likely to be expandable)
            svg_elements = driver.find_elements(By.CSS_SELECTOR, "aside.nextra-sidebar-container a svg, aside.nextra-sidebar-container button svg")
            print(f"Found {len(svg_elements)} potential expandable items with SVG icons")
            
            # Click on the parent elements of these SVGs
            clicked = 0
            for svg in svg_elements:
                try:
                    # Get parent element
                    parent = svg.find_element(By.XPATH, "./..")
                    # Try to click it
                    driver.execute_script("arguments[0].click();", parent)
                    clicked += 1
                    time.sleep(0.3)  # Short delay after each click
                except Exception as e:
                    continue
            
            print(f"Clicked additional {clicked} expandable items directly")
        except Exception as e:
            print(f"Error in fallback expansion: {str(e)}")
        
        # Final pass: look for any divs with height 0 and try to expand their previous sibling
        try:
            expand_hidden_script = """
            const hiddenDivs = document.querySelectorAll('aside.nextra-sidebar-container div[style*="height:0"]');
            let expanded = 0;
            
            hiddenDivs.forEach(div => {
                const previousElement = div.previousElementSibling;
                if (previousElement && (previousElement.tagName === 'A' || previousElement.tagName === 'BUTTON')) {
                    try {
                        previousElement.click();
                        expanded++;
                    } catch (e) {}
                }
            });
            
            return expanded;
            """
            
            final_expanded = driver.execute_script(expand_hidden_script)
            if final_expanded > 0:
                print(f"Expanded {final_expanded} additional hidden sections")
                time.sleep(1)  # Wait for expansion
        except Exception as e:
            print(f"Error in final expansion pass: {str(e)}")
        
        return True
    except Exception as e:
        print(f"Failed to expand sidebar: {str(e)}")
        return False

def scroll_sidebar(driver):
    """Scroll the sidebar to ensure all content is loaded"""
    try:
        print("Scrolling nextra sidebar to ensure all content is loaded...")
        
        # Find the scrollable container in the Nextra sidebar
        try:
            # First try the main scrollable container
            sidebar = driver.find_element(By.CSS_SELECTOR, "aside.nextra-sidebar-container .nx-overflow-y-auto")
        except:
            # Fallback to the entire sidebar
            sidebar = driver.find_element(By.CSS_SELECTOR, "aside.nextra-sidebar-container")
        
        # Execute JavaScript to scroll the sidebar
        scroll_script = """
        function smoothScroll(element) {
            // Start at the top
            element.scrollTo(0, 0);
            
            // Get total height
            const totalHeight = element.scrollHeight;
            const clientHeight = element.clientHeight;
            
            // If not much to scroll, just do a simple scroll
            if (totalHeight <= clientHeight * 2) {
                element.scrollTo(0, totalHeight);
                setTimeout(() => element.scrollTo(0, 0), 300);
                return;
            }
            
            // Smooth scroll down in steps
            let position = 0;
            const step = Math.min(200, clientHeight / 2);
            
            function scrollStep() {
                if (position < totalHeight) {
                    position += step;
                    element.scrollTo(0, position);
                    setTimeout(scrollStep, 100);
                } else {
                    // Reached bottom, wait a bit then scroll back to top
                    setTimeout(() => element.scrollTo(0, 0), 300);
                }
            }
            
            // Start scrolling
            scrollStep();
        }
        
        smoothScroll(arguments[0]);
        return arguments[0].scrollHeight;
        """
        
        height = driver.execute_script(scroll_script, sidebar)
        print(f"Scrolled sidebar with total height of {height}px")
        time.sleep(1)  # Wait for any lazy-loaded content
        
        return True
    except Exception as e:
        print(f"Error scrolling sidebar: {str(e)}")
        return False

def collect_all_sidebar_links(driver):
    """Collect all links from the fully expanded Nextra sidebar"""
    all_links = []
    
    try:
        # Wait for sidebar to load with new class structure
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "aside.nextra-sidebar-container"))
        )
        
        print("Starting to collect links from Nextra sidebar")
        
        # Scroll the sidebar to ensure all content is loaded
        scroll_sidebar(driver)
        
        # Expand all sections using our improved expansion function
        expand_all_sidebar_sections(driver)
        
        # Wait for animations to complete
        time.sleep(2)
        
        # Scroll again after expansion
        scroll_sidebar(driver)
        
        # Use JavaScript to extract all links to handle complex nested structure
        extract_links_script = """
        function extractAllLinks() {
            const links = [];
            const allAnchors = document.querySelectorAll('aside.nextra-sidebar-container a[href]');
            
            allAnchors.forEach(anchor => {
                const href = anchor.getAttribute('href');
                if (!href || href.startsWith('#') || href.includes('javascript:') || 
                    href.endsWith('.pdf') || href.endsWith('.zip')) {
                    return;
                }
                
                // Get visible text
                let title = anchor.textContent.trim();
                
                // If empty text, try to find a child element with text
                if (!title) {
                    const childWithText = anchor.querySelector('span, div, p');
                    if (childWithText) {
                        title = childWithText.textContent.trim();
                    } else {
                        title = "Unknown";
                    }
                }
                
                // Add to our list
                links.push({
                    url: href,
                    title: title,
                    isActive: anchor.classList.contains('nx-bg-primary-100') || 
                             anchor.classList.contains('nx-font-semibold')
                });
            });
            
            return links;
        }
        
        return extractAllLinks();
        """
        
        # Execute the script to get all links
        links_data = driver.execute_script(extract_links_script)
        
        # Process the extracted links
        for link_info in links_data:
            url = link_info['url']
            title = link_info['title']
            
            # Handle relative URLs by adding the base
            if url.startswith('/'):
                url = "https://learn.golem.cloud" + url
            
            # Only include Golem Cloud documentation links
            if not url.startswith('https://learn.golem.cloud'):
                continue
                
            # Skip external links and anchor links (redundant check)
            if "#" in url or url.endswith(".pdf") or url.endswith(".zip"):
                continue
            
            # Check if this URL is already in our list
            if not any(item['url'] == url for item in all_links):
                all_links.append({
                    "url": url,
                    "title": title
                })
        
        print(f"Collected {len(all_links)} unique links from Nextra sidebar")
        
        # If we didn't find any links, try alternative selectors
        if len(all_links) == 0:
            print("No links found with primary method, trying alternative approach")
            
            # Directly query all anchor elements
            anchors = driver.find_elements(By.CSS_SELECTOR, "aside.nextra-sidebar-container a")
            for anchor in anchors:
                try:
                    href = anchor.get_attribute("href")
                    if not href or not href.startswith("https://learn.golem.cloud"):
                        # Try to handle relative URLs
                        if href and href.startswith("/"):
                            href = "https://learn.golem.cloud" + href
                        else:
                            continue
                    
                    # Skip undesired link types
                    if "#" in href or href.endswith(".pdf") or href.endswith(".zip"):
                        continue
                    
                    title = anchor.text.strip()
                    if not title:
                        title = "Unknown"
                    
                    # Add to our list if not already present
                    if not any(item['url'] == href for item in all_links):
                        all_links.append({
                            "url": href,
                            "title": title
                        })
                except Exception as e:
                    print(f"Error processing link: {str(e)}")
                    continue
            
            print(f"Found {len(all_links)} links with alternative method")
        
        return all_links
        
    except Exception as e:
        print(f"Error collecting sidebar links: {str(e)}")
        return []

def scrape_golem_docs(driver, base_url, start_url=None):
    """Scrape the Golem Cloud documentation by following sidebar links"""
    processed_urls = set()  # Track processed URLs to avoid loops
    yaml_filename = "golem_docs.yaml"
    total_saved = 0
    
    # Load already processed URLs from YAML file if it exists
    if os.path.exists(yaml_filename):
        try:
            with open(yaml_filename, 'r', encoding='utf-8') as file:
                file_content = file.read()
                yaml_data = yaml.safe_load(file_content)
                if yaml_data and "golem" in yaml_data:
                    for entry in yaml_data["golem"]:
                        url = entry.get("url", "")
                        if url:
                            processed_urls.add(url)
            print(f"Loaded {len(processed_urls)} already processed URLs from YAML file")
        except Exception as e:
            print(f"Error reading YAML file: {str(e)}")
    
    # Remove the starting URL from processed_urls to force reprocessing it if needed
    if start_url and start_url in processed_urls:
        processed_urls.remove(start_url)
        print(f"Removed starting URL from processed list to reprocess it")
    
    def scrape_page(url, section_path):
        """Scrape a single page and save its information"""
        nonlocal total_saved
        
        if url in processed_urls:
            print(f"Already processed {url}, skipping")
            return
        
        processed_urls.add(url)
        content = get_page_content(driver, url)
        
        # Skip pages with no content
        if not content:
            print(f"No content found at {url}, skipping")
            return
            
        char_count = count_characters(content)
        approx_token_count = estimate_tokens(content)
        
        # Determine section from URL path
        section = section_path[0] if section_path else "Unknown"
        
        # Create data dictionary for YAML
        data = {
            "title": section_path[-1] if section_path else "Unknown",
            "url": url,
            "content": content,
            "section": section,
            "char_count": char_count,
            "approx_token_count": approx_token_count
        }
        
        # Save to YAML file
        saved_id = save_to_yaml(data, yaml_filename)
        if saved_id:
            total_saved += 1
        
        # Print the scraped information
        print("\n--- Scraped Page Information ---")
        print(f"Title: {data['title']}")
        print(f"URL: {data['url']}")
        print(f"Section: {data['section']}")
        print(f"Character Count: {data['char_count']}")
        print(f"Approximate Token Count: {data['approx_token_count']}")
        print(f"Content Preview: {content[:150]}...")
        print(f"Saved to: {yaml_filename} with ID: {saved_id}")
        print("-------------------------------\n")
    
    def process_sidebar_links():
        """Process all links in the sidebar navigation"""
        # Navigate to the base URL
        driver.get(base_url)
        time.sleep(3)
        
        # If we have a starting URL, navigate there first
        current_url = base_url
        if start_url:
            current_url = start_url
            driver.get(current_url)
            time.sleep(2)
        
        # First, scrape the current page
        section_path = get_section_path_from_url(current_url)
        scrape_page(current_url, section_path)
        
        # Make three attempts to collect all sidebar links
        # Sometimes multiple attempts are needed to get all links
        all_sidebar_links = []
        for attempt in range(3):  # Increased to 3 attempts
            print(f"\nAttempt #{attempt+1} to collect all sidebar links")
            driver.get(base_url)  # Always start from the base URL
            time.sleep(3)
            
            links = collect_all_sidebar_links(driver)
            
            # Add only new links to our master list
            new_count = 0
            for link in links:
                if not any(item['url'] == link['url'] for item in all_sidebar_links):
                    all_sidebar_links.append(link)
                    new_count += 1
            
            print(f"Added {new_count} new links in attempt #{attempt+1}")
            # If we didn't add any new links on the third attempt, we can stop
            if new_count == 0 and attempt > 0:
                break
                
            # Wait between attempts
            time.sleep(2)
        
        print(f"\nTotal unique links to process: {len(all_sidebar_links)}")
        
        # Process each link
        for i, link_info in enumerate(all_sidebar_links):
            url = link_info["url"]
            title = link_info["title"]
            
            if url in processed_urls:
                print(f"Skipping already processed link: {title}")
                continue
            
            try:
                print(f"\nProcessing link [{i+1}/{len(all_sidebar_links)}]: {title} -> {url}")
                
                # Navigate to the URL
                driver.get(url)
                time.sleep(2)
                
                # Get the section path
                section_path = get_section_path_from_url(url)
                
                # Scrape the page content
                scrape_page(url, section_path)
                
                # Every 5 links, try collecting sidebar links again
                # This helps ensure we don't miss any links that might appear later
                if (i+1) % 5 == 0 and i > 0:
                    print(f"Processed {i+1} links. Collecting sidebar links again...")
                    driver.get(base_url)
                    time.sleep(2)
                    
                    new_links = collect_all_sidebar_links(driver)
                    new_count = 0
                    for link in new_links:
                        if not any(item['url'] == link['url'] for item in all_sidebar_links):
                            all_sidebar_links.append(link)
                            new_count += 1
                    
                    if new_count > 0:
                        print(f"Found {new_count} additional links to process")
                
            except Exception as e:
                print(f"Error processing link {url}: {str(e)}")
                continue
    
    # Start the scraping process
    try:
        process_sidebar_links()
        print("\n===== Completed sidebar navigation =====\n")
    except Exception as e:
        print(f"Error in main processing: {str(e)}")
    
    return total_saved, yaml_filename

def scrape_from_section(headless=True, start_url=None):
    """Start scraping from a specific URL or the base URL"""
    driver = setup_driver(headless)
    base_url = "https://learn.golem.cloud/"
    
    try:
        if start_url:
            print(f"Starting scrape from specific URL: {start_url}")
        else:
            print("Starting scrape from documentation homepage")
        
        # Use the scraper with optional start URL
        pages_processed, yaml_file = scrape_golem_docs(driver, base_url, start_url)
        
        # Print summary
        print("\n===== Scraping Summary =====")
        print(f"Total pages processed: {pages_processed}")
        print(f"All data saved to: {yaml_file}")
        print("Documentation scraping completed!")
        
    finally:
        print("Closing the WebDriver.")
        time.sleep(2)
        driver.quit()

if __name__ == "__main__":
    # Start scraping from the base URL
    start_url = "https://learn.golem.cloud/"
    scrape_from_section(headless=False, start_url=start_url)