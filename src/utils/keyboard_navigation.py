# Enhanced keyboard navigation and focus management utilities
from bs4 import BeautifulSoup
from typing import Dict, List, Optional, Set
import re

class KeyboardNavigationEnhancer:
    """Enhanced keyboard navigation with proper focus management"""
    
    FOCUSABLE_ELEMENTS = [
        'a[href]', 'area[href]', 'input:not([disabled])', 
        'select:not([disabled])', 'textarea:not([disabled])',
        'button:not([disabled])', 'iframe', 'object', 'embed',
        '[contenteditable]', '[tabindex]:not([tabindex^="-"])'
    ]
    
    INTERACTIVE_ROLES = {
        'button', 'checkbox', 'link', 'menuitem', 'menuitemcheckbox',
        'menuitemradio', 'option', 'radio', 'slider', 'spinbutton',
        'switch', 'tab', 'textbox', 'treeitem'
    }

    @staticmethod
    def analyze_focus_order(html_content: str) -> Dict:
        """Analyze and report on keyboard focus order"""
        soup = BeautifulSoup(html_content, "html.parser")
        
        # Find all potentially focusable elements
        focusable_elements = []
        
        # Get elements with explicit tabindex
        tabindex_elements = soup.find_all(attrs={"tabindex": True})
        
        # Get naturally focusable elements
        for selector in KeyboardNavigationEnhancer.FOCUSABLE_ELEMENTS:
            elements = soup.select(selector)
            focusable_elements.extend(elements)
        
        # Add elements with interactive roles
        role_elements = soup.find_all(attrs={"role": True})
        for element in role_elements:
            if element.get("role") in KeyboardNavigationEnhancer.INTERACTIVE_ROLES:
                focusable_elements.append(element)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_elements = []
        for elem in focusable_elements:
            elem_id = id(elem)
            if elem_id not in seen:
                seen.add(elem_id)
                unique_elements.append(elem)
        
        # Analyze focus order
        focus_analysis = {
            'total_focusable': len(unique_elements),
            'elements': [],
            'issues': [],
            'recommendations': []
        }
        
        for i, element in enumerate(unique_elements):
            tabindex = element.get('tabindex')
            element_info = {
                'order': i + 1,
                'tag': element.name,
                'type': element.get('type'),
                'role': element.get('role'),
                'tabindex': tabindex,
                'has_aria_label': bool(element.get('aria-label')),
                'has_aria_labelledby': bool(element.get('aria-labelledby')),
                'text_content': element.get_text(strip=True)[:50],
                'line': getattr(element, 'sourceline', None)
            }
            
            # Check for accessibility issues
            if not element_info['has_aria_label'] and not element_info['has_aria_labelledby'] and not element_info['text_content']:
                focus_analysis['issues'].append({
                    'severity': 'error',
                    'element_order': i + 1,
                    'message': f'Focusable {element.name} element lacks accessible name'
                })
            
            if tabindex and tabindex.isdigit() and int(tabindex) > 0:
                focus_analysis['issues'].append({
                    'severity': 'warning',
                    'element_order': i + 1,
                    'message': f'Positive tabindex ({tabindex}) can disrupt natural focus order'
                })
            
            focus_analysis['elements'].append(element_info)
        
        # Add general recommendations
        if focus_analysis['total_focusable'] > 0:
            focus_analysis['recommendations'].extend([
                'Ensure focus indicators are clearly visible',
                'Test navigation using only keyboard',
                'Verify focus doesn\'t get trapped in components',
                'Consider using skip links for long navigation lists'
            ])
        
        return focus_analysis

    @staticmethod
    def add_proper_keyboard_support(html_content: str) -> str:
        """Add proper keyboard support to interactive elements"""
        soup = BeautifulSoup(html_content, "html.parser")
        
        # Find clickable divs/spans and convert to buttons
        clickable_elements = soup.find_all(attrs={"onclick": True})
        clickable_elements.extend(soup.find_all(class_=re.compile(r'clickable|cursor-pointer')))
        
        for element in clickable_elements:
            if element.name not in ['button', 'a', 'input', 'select', 'textarea']:
                # Convert to button if it's acting like one
                if element.name in ['div', 'span']:
                    element.name = 'button'
                    element.attrs.pop('onclick', None)  # Remove inline onclick
                    
                    # Add proper attributes
                    if not element.get('type'):
                        element['type'] = 'button'
                    
                    if not element.get('aria-label') and not element.get_text(strip=True):
                        element['aria-label'] = 'Interactive element'
        
        # Add skip links if not present
        body = soup.find('body')
        if body and not soup.find(class_='skip-link'):
            skip_link = soup.new_tag('a', href='#main-content', class_='skip-link')
            skip_link.string = 'Skip to main content'
            body.insert(0, skip_link)
        
        # Ensure main content area has proper id
        main = soup.find('main')
        if main and not main.get('id'):
            main['id'] = 'main-content'
        
        return str(soup)

    @staticmethod
    def validate_focus_management(html_content: str) -> Dict:
        """Validate focus management patterns"""
        soup = BeautifulSoup(html_content, "html.parser")
        
        validation_results = {
            'skip_links': False,
            'focus_indicators': False,
            'keyboard_traps': [],
            'modal_focus': True,  # Assume good unless proven otherwise
            'issues': []
        }
        
        # Check for skip links
        skip_links = soup.find_all('a', class_=re.compile(r'skip'))
        validation_results['skip_links'] = len(skip_links) > 0
        
        if not validation_results['skip_links']:
            validation_results['issues'].append({
                'severity': 'warning',
                'message': 'No skip links found. Consider adding skip navigation for keyboard users.'
            })
        
        # Check for focus indicators in CSS (simplified check)
        style_tags = soup.find_all('style')
        css_content = ' '.join(tag.get_text() for tag in style_tags)
        
        focus_patterns = [':focus', 'focus-visible', 'focus-within']
        has_focus_styles = any(pattern in css_content for pattern in focus_patterns)
        validation_results['focus_indicators'] = has_focus_styles
        
        if not has_focus_styles:
            validation_results['issues'].append({
                'severity': 'error',
                'message': 'No focus indicators found in styles. All interactive elements must have visible focus indicators.'
            })
        
        # Check for potential keyboard traps
        tabindex_elements = soup.find_all(attrs={"tabindex": "-1"})
        for element in tabindex_elements:
            # This is a simplified check - real implementation would be more complex
            if element.name in ['div', 'span'] and 'modal' in element.get('class', []):
                validation_results['keyboard_traps'].append({
                    'element': element.name,
                    'classes': element.get('class', []),
                    'warning': 'Potential keyboard trap in modal-like element'
                })
        
        return validation_results

def enhance_keyboard_accessibility(file_path: str, output_path: Optional[str] = None) -> bool:
    """Main function to enhance keyboard accessibility in HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Analyze current state
        focus_analysis = KeyboardNavigationEnhancer.analyze_focus_order(html_content)
        print(f"Found {focus_analysis['total_focusable']} focusable elements")
        
        if focus_analysis['issues']:
            print(f"Found {len(focus_analysis['issues'])} accessibility issues")
        
        # Enhance the HTML
        enhanced_html = KeyboardNavigationEnhancer.add_proper_keyboard_support(html_content)
        
        # Validate the enhanced version
        validation = KeyboardNavigationEnhancer.validate_focus_management(enhanced_html)
        
        # Write enhanced version
        output_file = output_path or file_path.replace('.html', '_accessible.html')
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(enhanced_html)
        
        print(f"Enhanced HTML written to: {output_file}")
        print(f"Validation results: {len(validation['issues'])} remaining issues")
        
        return True
        
    except Exception as e:
        print(f"Error enhancing keyboard accessibility: {e}")
        return False