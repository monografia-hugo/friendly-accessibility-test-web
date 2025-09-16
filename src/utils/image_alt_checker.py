# Enhanced image alt text analyzer with comprehensive accessibility checks
from bs4 import BeautifulSoup, Comment
from typing import Dict, List, Optional, Set
import re
from urllib.parse import urlparse
import os

class ImageAccessibilityAnalyzer:
    """Enhanced analyzer for image accessibility following WCAG 2.1 guidelines"""
    
    # Decorative image patterns (images that don't need alt text)
    DECORATIVE_PATTERNS = [
        r'decoration', r'ornament', r'divider', r'spacer', 
        r'bullet', r'icon-only', r'background', r'texture'
    ]
    
    # Complex image types that need detailed descriptions
    COMPLEX_IMAGE_TYPES = [
        'chart', 'graph', 'diagram', 'map', 'infographic', 
        'flowchart', 'screenshot', 'data-viz'
    ]
    
    # File extensions for different image types
    IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.bmp', '.tiff'}
    
    @staticmethod
    def analyze_images_in_html(html_content: str) -> Dict:
        """
        Comprehensive analysis of images in HTML content
        """
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Find all image elements
        img_elements = soup.find_all('img')
        svg_elements = soup.find_all('svg')
        figure_elements = soup.find_all('figure')
        
        analysis = {
            'total_images': len(img_elements),
            'svg_count': len(svg_elements),
            'figures_count': len(figure_elements),
            'images': [],
            'issues': [],
            'summary': {
                'missing_alt': 0,
                'empty_alt': 0,
                'good_alt': 0,
                'decorative': 0,
                'complex_images': 0,
                'accessibility_score': 0
            },
            'recommendations': []
        }
        
        # Analyze each image
        for i, img in enumerate(img_elements, 1):
            img_analysis = ImageAccessibilityAnalyzer._analyze_single_image(img, i)
            analysis['images'].append(img_analysis)
            
            # Update summary counts
            if img_analysis['has_alt']:
                if img_analysis['alt_text'] == '':
                    analysis['summary']['decorative'] += 1
                elif img_analysis['alt_quality']['score'] >= 7:
                    analysis['summary']['good_alt'] += 1
                else:
                    analysis['summary']['empty_alt'] += 1
            else:
                analysis['summary']['missing_alt'] += 1
                analysis['issues'].append({
                    'severity': 'error',
                    'message': f"Image #{i} missing alt attribute: {img_analysis['src']}",
                    'element': img_analysis
                })
        
        # Analyze SVG elements
        for i, svg in enumerate(svg_elements, 1):
            svg_analysis = ImageAccessibilityAnalyzer._analyze_svg_element(svg, i)
            if svg_analysis['needs_attention']:
                analysis['issues'].append({
                    'severity': 'warning',
                    'message': f"SVG #{i} may need accessibility improvements",
                    'element': svg_analysis
                })
        
        # Calculate accessibility score
        if analysis['total_images'] > 0:
            good_images = analysis['summary']['good_alt'] + analysis['summary']['decorative']
            analysis['summary']['accessibility_score'] = (good_images / analysis['total_images']) * 100
        
        # Generate recommendations
        analysis['recommendations'] = ImageAccessibilityAnalyzer._generate_recommendations(analysis)
        
        return analysis
    
    @staticmethod
    def _analyze_single_image(img_element, image_number: int) -> Dict:
        """Analyze a single image element"""
        src = img_element.get('src', '')
        alt_text = img_element.get('alt')
        title = img_element.get('title', '')
        aria_label = img_element.get('aria-label', '')
        aria_labelledby = img_element.get('aria-labelledby', '')
        aria_describedby = img_element.get('aria-describedby', '')
        role = img_element.get('role', '')
        
        # Check if image is in a figure with caption
        figure_parent = img_element.find_parent('figure')
        figcaption = None
        if figure_parent:
            figcaption = figure_parent.find('figcaption')
        
        analysis = {
            'image_number': image_number,
            'src': src,
            'alt_text': alt_text,
            'has_alt': alt_text is not None,
            'title': title,
            'aria_label': aria_label,
            'aria_labelledby': aria_labelledby,
            'aria_describedby': aria_describedby,
            'role': role,
            'in_figure': figure_parent is not None,
            'has_figcaption': figcaption is not None,
            'figcaption_text': figcaption.get_text(strip=True) if figcaption else '',
            'is_decorative': ImageAccessibilityAnalyzer._is_likely_decorative(img_element, src, alt_text),
            'is_complex': ImageAccessibilityAnalyzer._is_complex_image(src, alt_text),
            'alt_quality': ImageAccessibilityAnalyzer._assess_alt_quality(alt_text, src),
            'issues': []
        }
        
        # Check for common issues
        if not analysis['has_alt']:
            analysis['issues'].append("Missing alt attribute")
        elif alt_text and len(alt_text) > 125:
            analysis['issues'].append("Alt text too long (>125 characters)")
        elif alt_text and alt_text.lower().startswith(('image of', 'picture of', 'photo of')):
            analysis['issues'].append("Alt text includes redundant phrases")
        
        if analysis['is_complex'] and not (aria_describedby or analysis['has_figcaption']):
            analysis['issues'].append("Complex image needs long description")
        
        return analysis
    
    @staticmethod
    def _analyze_svg_element(svg_element, svg_number: int) -> Dict:
        """Analyze SVG element for accessibility"""
        title_elem = svg_element.find('title')
        desc_elem = svg_element.find('desc')
        aria_label = svg_element.get('aria-label', '')
        aria_labelledby = svg_element.get('aria-labelledby', '')
        role = svg_element.get('role', '')
        
        analysis = {
            'svg_number': svg_number,
            'has_title': title_elem is not None,
            'title_text': title_elem.get_text(strip=True) if title_elem else '',
            'has_desc': desc_elem is not None,
            'desc_text': desc_elem.get_text(strip=True) if desc_elem else '',
            'aria_label': aria_label,
            'aria_labelledby': aria_labelledby,
            'role': role,
            'is_decorative': role == 'presentation' or role == 'img',
            'needs_attention': False
        }
        
        # Determine if SVG needs attention
        has_accessible_name = any([
            analysis['has_title'],
            aria_label,
            aria_labelledby
        ])
        
        if not analysis['is_decorative'] and not has_accessible_name:
            analysis['needs_attention'] = True
        
        return analysis
    
    @staticmethod
    def _is_likely_decorative(img_element, src: str, alt_text: Optional[str]) -> bool:
        """Determine if image is likely decorative"""
        if alt_text == '':  # Empty alt explicitly marks as decorative
            return True
        
        # Check file name patterns
        filename = os.path.basename(src).lower() if src else ''
        for pattern in ImageAccessibilityAnalyzer.DECORATIVE_PATTERNS:
            if re.search(pattern, filename):
                return True
        
        # Check CSS classes or nearby context
        img_classes = ' '.join(img_element.get('class', [])).lower()
        for pattern in ImageAccessibilityAnalyzer.DECORATIVE_PATTERNS:
            if pattern in img_classes:
                return True
        
        return False
    
    @staticmethod
    def _is_complex_image(src: str, alt_text: Optional[str]) -> bool:
        """Determine if image is complex and needs long description"""
        if not src and not alt_text:
            return False
        
        content_to_check = f"{src} {alt_text or ''}".lower()
        
        return any(img_type in content_to_check for img_type in ImageAccessibilityAnalyzer.COMPLEX_IMAGE_TYPES)
    
    @staticmethod
    def _assess_alt_quality(alt_text: Optional[str], src: str) -> Dict:
        """Assess the quality of alt text"""
        if not alt_text:
            return {'score': 0, 'issues': ['Missing alt text']}
        
        if alt_text == '':
            return {'score': 10, 'issues': []}  # Perfect for decorative images
        
        issues = []
        score = 10  # Start with perfect score
        
        # Check length
        if len(alt_text) > 125:
            issues.append("Too long (>125 characters)")
            score -= 3
        elif len(alt_text) < 3:
            issues.append("Too short")
            score -= 2
        
        # Check for redundant phrases
        redundant_phrases = [
            'image of', 'picture of', 'photo of', 'graphic of',
            'icon of', 'logo of', 'illustration of'
        ]
        
        for phrase in redundant_phrases:
            if alt_text.lower().startswith(phrase):
                issues.append(f"Starts with redundant phrase: '{phrase}'")
                score -= 2
                break
        
        # Check if it's just the filename
        filename = os.path.basename(src).lower() if src else ''
        if filename and alt_text.lower() == os.path.splitext(filename)[0]:
            issues.append("Alt text is just filename")
            score -= 4
        
        # Check for placeholder text
        placeholder_patterns = [
            r'^\w+\.(jpg|jpeg|png|gif|svg)$',  # Just filename with extension
            r'^image\d*$',  # "image" or "image1", etc.
            r'^(untitled|placeholder|default)$'
        ]
        
        for pattern in placeholder_patterns:
            if re.match(pattern, alt_text.lower()):
                issues.append("Appears to be placeholder text")
                score -= 5
                break
        
        return {
            'score': max(0, score),
            'issues': issues,
            'length': len(alt_text)
        }
    
    @staticmethod
    def _generate_recommendations(analysis: Dict) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        missing = analysis['summary']['missing_alt']
        total = analysis['total_images']
        score = analysis['summary']['accessibility_score']
        
        if missing > 0:
            recommendations.append(f"Add alt attributes to {missing} images missing them")
        
        if score < 50:
            recommendations.append("Critical: Most images fail accessibility standards")
        elif score < 80:
            recommendations.append("Improve alt text quality for better accessibility")
        
        # Specific recommendations based on image analysis
        complex_without_desc = sum(1 for img in analysis['images'] 
                                 if img['is_complex'] and 'Complex image needs long description' in img['issues'])
        
        if complex_without_desc > 0:
            recommendations.append(f"Add long descriptions for {complex_without_desc} complex images")
        
        if analysis['summary']['good_alt'] < total * 0.8:
            recommendations.append("Review and improve alt text quality - aim for concise, descriptive text")
        
        if not recommendations:
            recommendations.append("Great job! Image accessibility looks good.")
        
        return recommendations

def check_images_accessibility(file_path: str) -> Dict:
    """Main function to check image accessibility in HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        analyzer = ImageAccessibilityAnalyzer()
        analysis = analyzer.analyze_images_in_html(html_content)
        
        return analysis
        
    except Exception as e:
        return {
            'error': f"Error analyzing file: {e}",
            'total_images': 0,
            'images': [],
            'issues': [],
            'summary': {'accessibility_score': 0},
            'recommendations': [f"Could not analyze file: {e}"]
        }

def print_accessibility_report(analysis: Dict) -> None:
    """Print a comprehensive accessibility report"""
    print("=" * 60)
    print("IMAGE ACCESSIBILITY ANALYSIS REPORT")
    print("=" * 60)
    
    if 'error' in analysis:
        print(f"ERROR: {analysis['error']}")
        return
    
    # Summary
    summary = analysis['summary']
    print(f"Total Images: {analysis['total_images']}")
    print(f"SVG Elements: {analysis['svg_count']}")
    print(f"Accessibility Score: {summary['accessibility_score']:.1f}%")
    print()
    
    # Breakdown
    print("ACCESSIBILITY BREAKDOWN:")
    print(f"  ✓ Good Alt Text: {summary['good_alt']}")
    print(f"  ✓ Decorative (Empty Alt): {summary['decorative']}")
    print(f"  ⚠ Poor Alt Text: {summary['empty_alt']}")
    print(f"  ✗ Missing Alt: {summary['missing_alt']}")
    print()
    
    # Issues
    if analysis['issues']:
        print("CRITICAL ISSUES:")
        for i, issue in enumerate(analysis['issues'], 1):
            print(f"  {i}. [{issue['severity'].upper()}] {issue['message']}")
        print()
    
    # Recommendations
    if analysis['recommendations']:
        print("RECOMMENDATIONS:")
        for i, rec in enumerate(analysis['recommendations'], 1):
            print(f"  {i}. {rec}")
        print()
    
    # Detailed image analysis
    if analysis['images']:
        print("DETAILED IMAGE ANALYSIS:")
        print("-" * 40)
        
        for img in analysis['images']:
            print(f"Image #{img['image_number']}: {os.path.basename(img['src'])}")
            
            if img['has_alt']:
                if img['alt_text'] == '':
                    print("  Alt: (empty - decorative)")
                else:
                    print(f"  Alt: \"{img['alt_text'][:50]}{'...' if len(img['alt_text']) > 50 else ''}\"")
                    print(f"  Quality Score: {img['alt_quality']['score']}/10")
            else:
                print("  Alt: MISSING ❌")
            
            if img['issues']:
                print(f"  Issues: {', '.join(img['issues'])}")
            
            print()
    
    print("=" * 60)

# Example usage
if __name__ == "__main__":
    # Test with sample HTML
    sample_html = """
    <html>
    <body>
        <img src="logo.png" alt="Company Logo">
        <img src="chart.png" alt="Sales increased by 25% this quarter">
        <img src="decoration.png" alt="">
        <img src="photo.jpg">
        <figure>
            <img src="complex-chart.png" alt="Monthly sales data">
            <figcaption>Detailed breakdown of sales performance by region</figcaption>
        </figure>
        <svg role="img" aria-label="Loading spinner">
            <circle cx="50" cy="50" r="40"/>
        </svg>
    </body>
    </html>
    """
    
    analyzer = ImageAccessibilityAnalyzer()
    analysis = analyzer.analyze_images_in_html(sample_html)
    print_accessibility_report(analysis)