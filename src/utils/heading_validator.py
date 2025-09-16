# Enhanced heading hierarchy validator with comprehensive WCAG support
from bs4 import BeautifulSoup, Comment
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
import re

@dataclass
class Heading:
    tag: str  # h1, h2, h3, etc. or 'role=heading'
    level: int  # 1 for h1, 2 for h2, etc.
    text: str  # Text content of the header
    line: Optional[int] = None  # Line number if available
    attributes: Optional[Dict[str, str]] = None  # Additional attributes

@dataclass
class Finding:
    severity: str  # 'error', 'warning', 'info'
    message: str
    prev: Optional[Heading] = None
    curr: Optional[Heading] = None
    line: Optional[int] = None

def _parse_headings(html: str, scope: str = "document") -> List[Heading]:
    """
    Enhanced heading parser with better error handling and accessibility checks.
    scope: 'document' (default), 'main' (limits to <main> / [role=main]), or 'article'
    """
    try:
        # Use 'lxml' for better sourceline support, fallback to html.parser
        soup = BeautifulSoup(html, "lxml")
    except:
        soup = BeautifulSoup(html, "html.parser")
    
    # Determine scope
    if scope == "main":
        root = soup.select_one("main, [role=main]")
    elif scope == "article":
        root = soup.select_one("article, [role=article]")
    else:
        root = soup
    
    if not root:
        root = soup  # Fallback to full document

    def is_hidden(el) -> bool:
        """Enhanced visibility check"""
        # Check HTML5 hidden attribute
        if el.has_attr("hidden"):
            return True
        
        # Check aria-hidden
        if el.get("aria-hidden") == "true":
            return True
        
        # Check CSS visibility/display
        style = el.get("style", "")
        style_clean = re.sub(r'\s+', '', style.lower())
        
        hidden_patterns = [
            "display:none", "visibility:hidden", "opacity:0",
            "position:absolute;left:-9999", "height:0", "width:0"
        ]
        
        return any(pattern in style_clean for pattern in hidden_patterns)

    def is_heading(el) -> bool:
        """Check if element is a heading"""
        if hasattr(el, 'name') and el.name in ("h1", "h2", "h3", "h4", "h5", "h6"):
            return True
        return el.get("role") == "heading" and el.get("aria-level")

    def level_of(el) -> int:
        """Get heading level"""
        if hasattr(el, 'name') and el.name and el.name.startswith("h"):
            try:
                return int(el.name[1])
            except (ValueError, IndexError):
                return 0
        
        aria_level = el.get("aria-level")
        if aria_level:
            try:
                level = int(aria_level)
                return level if 1 <= level <= 6 else 0
            except (ValueError, TypeError):
                return 0
        return 0

    def get_text_content(el) -> str:
        """Get meaningful text content, excluding hidden elements"""
        text_parts = []
        for content in el.contents:
            if hasattr(content, 'get_text'):
                if not is_hidden(content):
                    text_parts.append(content.get_text(strip=True))
            elif isinstance(content, str) and not isinstance(content, Comment):
                text_parts.append(content.strip())
        
        return ' '.join(filter(None, text_parts))

    headings: List[Heading] = []
    
    # Find all potential heading elements
    for el in root.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) + root.find_all(attrs={"role": "heading"}):
        if not is_heading(el) or is_hidden(el):
            continue
            
        level = level_of(el)
        if level == 0:  # Invalid level
            continue
            
        tag = el.name if el.name in ("h1", "h2", "h3", "h4", "h5", "h6") else "role=heading"
        text = get_text_content(el)
        
        if not text.strip():  # Skip empty headings
            continue
            
        line = getattr(el, "sourceline", None)
        attributes = dict(el.attrs) if hasattr(el, 'attrs') else {}
        
        headings.append(Heading(tag, level, text, line, attributes))
    
    return headings

def check_header_hierarchy(
    html: str,
    *,
    allow_multiple_h1: bool = False,  # Changed default to False for better accessibility
    allow_start_at_h2: bool = False,
    scope: str = "document",
    check_empty_headings: bool = True,
    check_long_headings: bool = True,
    max_heading_length: int = 120
) -> Dict[str, Any]:
    """
    Enhanced heading hierarchy validator with comprehensive WCAG checks.
    """
    headers = _parse_headings(html, scope=scope)
    findings: List[Finding] = []

    if not headers:
        findings.append(Finding(
            "warning", 
            "No headings found. Consider adding headings to improve document structure and accessibility."
        ))
        return {
            "headers": [],
            "findings": [f.__dict__ for f in findings],
            "summary": {"h1_count": 0, "total": 0, "valid_hierarchy": False}
        }

    # Check first heading level
    if not allow_start_at_h2 and headers[0].level > 1:
        findings.append(Finding(
            "warning",
            f"Document starts with H{headers[0].level} instead of H1. Consider starting with H1 for better document structure.",
            None, headers[0], headers[0].line
        ))

    # Count H1s
    h1_count = sum(1 for h in headers if h.level == 1)
    if not allow_multiple_h1 and h1_count > 1:
        findings.append(Finding(
            "warning",
            f"Multiple H1 headings found ({h1_count}). Consider using only one H1 per page.",
            None, headers[0], headers[0].line
        ))
    elif h1_count == 0:
        findings.append(Finding(
            "warning",
            "No H1 heading found. Each page should have exactly one H1 for the main title.",
        ))

    # Check heading level jumps
    valid_hierarchy = True
    for i in range(1, len(headers)):
        prev, curr = headers[i - 1], headers[i]
        
        # Check for level jumps (going up more than 1 level)
        if curr.level > prev.level + 1:
            valid_hierarchy = False
            findings.append(Finding(
                "error",
                f"Invalid heading level jump: H{prev.level} to H{curr.level}. "
                f"Headings should increase by one level at a time. Consider using H{prev.level + 1}.",
                prev, curr, curr.line
            ))

    # Additional accessibility checks
    if check_empty_headings:
        for header in headers:
            if not header.text.strip():
                findings.append(Finding(
                    "error",
                    f"Empty heading found: {header.tag.upper()}. All headings must have meaningful text content.",
                    None, header, header.line
                ))

    if check_long_headings:
        for header in headers:
            if len(header.text) > max_heading_length:
                findings.append(Finding(
                    "warning",
                    f"Long heading text ({len(header.text)} chars): {header.text[:50]}... "
                    f"Consider keeping headings under {max_heading_length} characters for better accessibility.",
                    None, header, header.line
                ))

    # Check for proper nesting in sectioning content
    section_stack = []
    for header in headers:
        # This is a simplified check - in practice, you'd want to track actual DOM structure
        while section_stack and section_stack[-1] >= header.level:
            section_stack.pop()
        section_stack.append(header.level)

    return {
        "headers": [h.__dict__ for h in headers],
        "findings": [f.__dict__ for f in findings],
        "summary": {
            "h1_count": h1_count,
            "total": len(headers),
            "valid_hierarchy": valid_hierarchy,
            "max_level": max(h.level for h in headers) if headers else 0,
            "scope": scope
        }
    }

def pretty_print_report(report: Dict[str, Any]) -> None:
    """Enhanced report printing with better formatting"""
    print("=" * 60)
    print("HEADING HIERARCHY ANALYSIS REPORT")
    print("=" * 60)
    
    summary = report["summary"]
    print(f"Scope: {summary.get('scope', 'document')}")
    print(f"Total headings: {summary['total']}")
    print(f"H1 count: {summary['h1_count']}")
    print(f"Max heading level: {summary.get('max_level', 'N/A')}")
    print(f"Valid hierarchy: {'✓' if summary.get('valid_hierarchy', False) else '✗'}")
    print()
    
    if report["headers"]:
        print("HEADING STRUCTURE:")
        print("-" * 40)
        for i, h in enumerate(report["headers"], 1):
            indent = "  " * (h['level'] - 1)
            line_info = f" (line {h['line']})" if h.get('line') else ""
            print(f"{i:2d}. {indent}H{h['level']}: {h['text'][:60]}{'...' if len(h['text']) > 60 else ''}{line_info}")
        print()
    
    if report["findings"]:
        print("ACCESSIBILITY ISSUES:")
        print("-" * 40)
        
        # Group by severity
        errors = [f for f in report["findings"] if f['severity'] == 'error']
        warnings = [f for f in report["findings"] if f['severity'] == 'warning']
        info = [f for f in report["findings"] if f['severity'] == 'info']
        
        for severity, findings_list in [('ERROR', errors), ('WARNING', warnings), ('INFO', info)]:
            if findings_list:
                print(f"\n{severity}S ({len(findings_list)}):")
                for f in findings_list:
                    line_info = f" (line {f.get('line')})" if f.get('line') else ""
                    print(f"  • {f['message']}{line_info}")
    else:
        print("✓ No accessibility issues found in heading structure!")
    
    print("=" * 60)

def validate_html_headings(file_path: str, **kwargs) -> Dict[str, Any]:
    """Convenience function to validate headings from HTML file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            html_content = f.read()
        return check_header_hierarchy(html_content, **kwargs)
    except Exception as e:
        return {
            "headers": [],
            "findings": [{"severity": "error", "message": f"Error reading file: {e}"}],
            "summary": {"h1_count": 0, "total": 0, "valid_hierarchy": False}
        }