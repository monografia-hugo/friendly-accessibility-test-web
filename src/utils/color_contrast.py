# Enhanced color contrast analyzer with comprehensive WCAG support
import colorsys
import re
from typing import Tuple, Dict, List, Optional, Union
import math

class ColorContrastAnalyzer:
    """Enhanced color contrast analyzer following WCAG 2.1 guidelines"""
    
    # WCAG contrast ratio thresholds
    WCAG_AA_NORMAL = 4.5
    WCAG_AA_LARGE = 3.0
    WCAG_AAA_NORMAL = 7.0
    WCAG_AAA_LARGE = 4.5
    
    @staticmethod
    def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
        """Convert hex color to RGB tuple"""
        hex_color = hex_color.lstrip('#')
        if len(hex_color) == 3:
            hex_color = ''.join([c*2 for c in hex_color])
        
        try:
            return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
        except ValueError:
            raise ValueError(f"Invalid hex color: #{hex_color}")
    
    @staticmethod
    def rgb_to_hex(rgb: Tuple[int, int, int]) -> str:
        """Convert RGB tuple to hex string"""
        return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"
    
    @staticmethod
    def hsl_to_rgb(h: float, s: float, l: float) -> Tuple[int, int, int]:
        """Convert HSL to RGB"""
        h = h / 360.0 if h > 1 else h
        s = s / 100.0 if s > 1 else s
        l = l / 100.0 if l > 1 else l
        
        r, g, b = colorsys.hls_to_rgb(h, l, s)
        return (int(r * 255), int(g * 255), int(b * 255))
    
    @staticmethod
    def get_luminance(color: Union[str, Tuple[int, int, int]]) -> float:
        """
        Calculate relative luminance according to WCAG 2.1
        https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
        """
        if isinstance(color, str):
            if color.startswith('#'):
                r, g, b = ColorContrastAnalyzer.hex_to_rgb(color)
            else:
                # Handle CSS color names or other formats
                raise ValueError(f"Unsupported color format: {color}")
        else:
            r, g, b = color
        
        def linearize(c):
            c = c / 255.0
            if c <= 0.03928:
                return c / 12.92
            else:
                return math.pow((c + 0.055) / 1.055, 2.4)
        
        r_lin = linearize(r)
        g_lin = linearize(g)
        b_lin = linearize(b)
        
        return 0.2126 * r_lin + 0.7152 * g_lin + 0.0722 * b_lin
    
    @staticmethod
    def calculate_contrast_ratio(color1: Union[str, Tuple[int, int, int]], 
                               color2: Union[str, Tuple[int, int, int]]) -> float:
        """
        Calculate contrast ratio between two colors according to WCAG 2.1
        Returns a value between 1 (no contrast) and 21 (maximum contrast)
        """
        luminance1 = ColorContrastAnalyzer.get_luminance(color1)
        luminance2 = ColorContrastAnalyzer.get_luminance(color2)
        
        # Ensure lighter color is numerator
        lighter = max(luminance1, luminance2)
        darker = min(luminance1, luminance2)
        
        return (lighter + 0.05) / (darker + 0.05)
    
    @staticmethod
    def check_wcag_compliance(contrast_ratio: float, 
                            text_size: str = 'normal',
                            level: str = 'AA') -> Dict[str, bool]:
        """
        Check WCAG compliance for given contrast ratio
        
        Args:
            contrast_ratio: The calculated contrast ratio
            text_size: 'normal', 'large', or 'small'
            level: 'AA' or 'AAA'
        
        Returns:
            Dict with compliance status for different criteria
        """
        is_large_text = text_size in ['large']
        
        if level.upper() == 'AA':
            threshold = ColorContrastAnalyzer.WCAG_AA_LARGE if is_large_text else ColorContrastAnalyzer.WCAG_AA_NORMAL
        else:  # AAA
            threshold = ColorContrastAnalyzer.WCAG_AAA_LARGE if is_large_text else ColorContrastAnalyzer.WCAG_AAA_NORMAL
        
        return {
            'passes': contrast_ratio >= threshold,
            'ratio': contrast_ratio,
            'threshold': threshold,
            'level': level,
            'text_size': text_size,
            'grade': 'Pass' if contrast_ratio >= threshold else 'Fail'
        }
    
    @staticmethod
    def analyze_color_pair(foreground: Union[str, Tuple[int, int, int]], 
                          background: Union[str, Tuple[int, int, int]],
                          text_sizes: List[str] = None) -> Dict:
        """
        Comprehensive analysis of a color pair
        """
        if text_sizes is None:
            text_sizes = ['normal', 'large']
        
        contrast_ratio = ColorContrastAnalyzer.calculate_contrast_ratio(foreground, background)
        
        analysis = {
            'foreground': foreground,
            'background': background,
            'contrast_ratio': round(contrast_ratio, 2),
            'wcag_aa': {},
            'wcag_aaa': {},
            'recommendations': []
        }
        
        # Check compliance for different text sizes and levels
        for text_size in text_sizes:
            analysis['wcag_aa'][text_size] = ColorContrastAnalyzer.check_wcag_compliance(
                contrast_ratio, text_size, 'AA'
            )
            analysis['wcag_aaa'][text_size] = ColorContrastAnalyzer.check_wcag_compliance(
                contrast_ratio, text_size, 'AAA'
            )
        
        # Generate recommendations
        if contrast_ratio < ColorContrastAnalyzer.WCAG_AA_NORMAL:
            analysis['recommendations'].append("Increase contrast to meet WCAG AA standards")
            
        if contrast_ratio < ColorContrastAnalyzer.WCAG_AAA_NORMAL:
            analysis['recommendations'].append("Consider increasing contrast for AAA compliance")
            
        if contrast_ratio >= ColorContrastAnalyzer.WCAG_AAA_NORMAL:
            analysis['recommendations'].append("Excellent contrast ratio - exceeds all WCAG guidelines")
        
        return analysis
    
    @staticmethod
    def suggest_accessible_colors(base_color: Union[str, Tuple[int, int, int]], 
                                target_contrast: float = 4.5,
                                adjust_lightness: bool = True) -> Dict:
        """
        Suggest accessible color alternatives
        """
        if isinstance(base_color, str):
            base_rgb = ColorContrastAnalyzer.hex_to_rgb(base_color)
        else:
            base_rgb = base_color
        
        suggestions = {
            'base_color': base_color,
            'target_contrast': target_contrast,
            'light_backgrounds': [],
            'dark_backgrounds': []
        }
        
        # Generate suggestions for light backgrounds
        for lightness in range(85, 101, 5):  # Light backgrounds
            bg_rgb = (lightness * 255 // 100, lightness * 255 // 100, lightness * 255 // 100)
            contrast = ColorContrastAnalyzer.calculate_contrast_ratio(base_rgb, bg_rgb)
            
            if contrast >= target_contrast:
                suggestions['light_backgrounds'].append({
                    'background': ColorContrastAnalyzer.rgb_to_hex(bg_rgb),
                    'contrast_ratio': round(contrast, 2)
                })
        
        # Generate suggestions for dark backgrounds
        for lightness in range(0, 21, 5):  # Dark backgrounds
            bg_rgb = (lightness * 255 // 100, lightness * 255 // 100, lightness * 255 // 100)
            contrast = ColorContrastAnalyzer.calculate_contrast_ratio(base_rgb, bg_rgb)
            
            if contrast >= target_contrast:
                suggestions['dark_backgrounds'].append({
                    'background': ColorContrastAnalyzer.rgb_to_hex(bg_rgb),
                    'contrast_ratio': round(contrast, 2)
                })
        
        return suggestions
    
    @staticmethod
    def analyze_css_colors(css_content: str) -> List[Dict]:
        """
        Analyze colors found in CSS content
        """
        # Simple regex patterns for colors - in production, use a proper CSS parser
        hex_pattern = r'#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b'
        rgb_pattern = r'rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)'
        hsl_pattern = r'hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)'
        
        colors_found = []
        
        # Find hex colors
        hex_matches = re.findall(hex_pattern, css_content)
        for match in hex_matches:
            colors_found.append({
                'type': 'hex',
                'value': f"#{match}",
                'rgb': ColorContrastAnalyzer.hex_to_rgb(match)
            })
        
        # Find RGB colors
        rgb_matches = re.findall(rgb_pattern, css_content)
        for match in rgb_matches:
            rgb = tuple(int(x) for x in match)
            colors_found.append({
                'type': 'rgb',
                'value': f"rgb({', '.join(match)})",
                'rgb': rgb
            })
        
        # Find HSL colors
        hsl_matches = re.findall(hsl_pattern, css_content)
        for match in hsl_matches:
            h, s, l = [int(x) for x in match]
            rgb = ColorContrastAnalyzer.hsl_to_rgb(h, s, l)
            colors_found.append({
                'type': 'hsl',
                'value': f"hsl({h}, {s}%, {l}%)",
                'rgb': rgb
            })
        
        return colors_found

def analyze_web_page_contrast(html_content: str, css_content: str = "") -> Dict:
    """
    Analyze contrast ratios in a web page
    This is a simplified version - in production, you'd need a proper DOM parser
    """
    analyzer = ColorContrastAnalyzer()
    
    # Extract colors from CSS
    css_colors = analyzer.analyze_css_colors(css_content) if css_content else []
    
    # Common problematic color combinations to check
    common_checks = [
        ('#ffffff', '#f0f0f0'),  # White on light gray
        ('#000000', '#333333'),  # Black on dark gray  
        ('#0000ff', '#000080'),  # Blue on dark blue
        ('#ff0000', '#800000'),  # Red on dark red
    ]
    
    results = {
        'css_colors_found': len(css_colors),
        'color_pairs_analyzed': [],
        'accessibility_score': 0,
        'recommendations': []
    }
    
    # Analyze common problematic combinations
    for fg, bg in common_checks:
        analysis = analyzer.analyze_color_pair(fg, bg)
        results['color_pairs_analyzed'].append(analysis)
    
    # Calculate overall accessibility score
    passing_combinations = sum(1 for pair in results['color_pairs_analyzed'] 
                              if pair['wcag_aa']['normal']['passes'])
    
    if results['color_pairs_analyzed']:
        results['accessibility_score'] = (passing_combinations / len(results['color_pairs_analyzed'])) * 100
    
    # Generate overall recommendations
    if results['accessibility_score'] < 70:
        results['recommendations'].append("Critical: Many color combinations fail WCAG standards")
    elif results['accessibility_score'] < 90:
        results['recommendations'].append("Warning: Some color combinations need improvement")
    else:
        results['recommendations'].append("Good: Most color combinations meet accessibility standards")
    
    return results

# Example usage and testing
if __name__ == "__main__":
    analyzer = ColorContrastAnalyzer()
    
    # Test some common color combinations
    test_combinations = [
        ("#000000", "#ffffff"),  # Black on white
        ("#ffffff", "#000000"),  # White on black  
        ("#0066cc", "#ffffff"),  # Blue on white
        ("#666666", "#ffffff"),  # Gray on white
        ("#ff0000", "#ffffff"),  # Red on white
    ]
    
    print("=== Color Contrast Analysis ===\n")
    
    for fg, bg in test_combinations:
        analysis = analyzer.analyze_color_pair(fg, bg)
        print(f"Foreground: {fg}, Background: {bg}")
        print(f"Contrast Ratio: {analysis['contrast_ratio']}:1")
        print(f"WCAG AA (Normal): {analysis['wcag_aa']['normal']['grade']}")
        print(f"WCAG AAA (Normal): {analysis['wcag_aaa']['normal']['grade']}")
        print("---")