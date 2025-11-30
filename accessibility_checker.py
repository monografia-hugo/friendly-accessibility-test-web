#!/usr/bin/env python3
"""
Main accessibility checker script for CI/CD pipeline.
Runs comprehensive accessibility audits on HTML files and generates JSON reports.
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime
import glob

# Add src/utils to path for imports
sys.path.insert(0, str(Path(__file__).parent / 'src' / 'utils'))

try:
    from bs4 import BeautifulSoup
    from heading_validator import check_header_hierarchy, validate_html_headings
    from image_alt_checker import check_images_accessibility, ImageAccessibilityAnalyzer
    from color_contrast import analyze_web_page_contrast, ColorContrastAnalyzer
    from keyboard_navigation import KeyboardNavigationEnhancer
except ImportError as e:
    print(f"Error importing modules: {e}")
    print("Please ensure all required dependencies are installed.")
    sys.exit(1)


class AccessibilityAuditor:
    """Main auditor class that coordinates all accessibility checks"""

    def __init__(self, base_dir: str = "."):
        self.base_dir = Path(base_dir)
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "files_analyzed": [],
            "summary": {
                "total_files": 0,
                "total_issues": 0,
                "errors": 0,
                "warnings": 0,
                "accessibility_score": 0
            },
            "checks": {
                "headings": [],
                "images": [],
                "color_contrast": [],
                "keyboard_navigation": []
            }
        }

    def find_html_files(self) -> List[Path]:
        """Find all HTML files to analyze"""
        html_files = []

        # Check dist directory (built files)
        dist_dir = self.base_dir / "dist"
        if dist_dir.exists():
            html_files.extend(dist_dir.glob("**/*.html"))

        # Check root for index.html
        index_html = self.base_dir / "index.html"
        if index_html.exists():
            html_files.append(index_html)

        # Check public directory
        public_dir = self.base_dir / "public"
        if public_dir.exists():
            html_files.extend(public_dir.glob("**/*.html"))

        # Remove duplicates and sort
        html_files = sorted(set(html_files))
        return html_files

    def analyze_file(self, file_path: Path) -> Dict[str, Any]:
        """Run all accessibility checks on a single HTML file"""
        print(f"Analyzing: {file_path}")

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
        except Exception as e:
            return {
                "file": str(file_path),
                "error": f"Could not read file: {e}",
                "checks": {}
            }

        file_result = {
            "file": str(file_path.relative_to(self.base_dir)),
            "timestamp": datetime.now().isoformat(),
            "checks": {}
        }

        # 1. Check heading hierarchy
        try:
            heading_report = check_header_hierarchy(html_content)
            file_result["checks"]["headings"] = heading_report

            # Count issues
            findings = heading_report.get("findings", [])
            errors = sum(1 for f in findings if f.get("severity") == "error")
            warnings = sum(1 for f in findings if f.get("severity") == "warning")

            self.results["summary"]["errors"] += errors
            self.results["summary"]["warnings"] += warnings
            self.results["summary"]["total_issues"] += len(findings)

        except Exception as e:
            file_result["checks"]["headings"] = {
                "error": f"Heading check failed: {e}"
            }

        # 2. Check image accessibility
        try:
            image_report = check_images_accessibility(str(file_path))
            file_result["checks"]["images"] = {
                "total_images": image_report.get("total_images", 0),
                "issues": image_report.get("issues", []),
                "summary": image_report.get("summary", {}),
                "recommendations": image_report.get("recommendations", [])
            }

            # Count issues
            image_issues = image_report.get("issues", [])
            errors = sum(1 for i in image_issues if i.get("severity") == "error")
            warnings = sum(1 for i in image_issues if i.get("severity") == "warning")

            self.results["summary"]["errors"] += errors
            self.results["summary"]["warnings"] += warnings
            self.results["summary"]["total_issues"] += len(image_issues)

        except Exception as e:
            file_result["checks"]["images"] = {
                "error": f"Image check failed: {e}"
            }

        # 3. Check color contrast
        try:
            # Try to find associated CSS files
            css_content = ""
            css_dir = file_path.parent / "assets"
            if css_dir.exists():
                for css_file in css_dir.glob("**/*.css"):
                    try:
                        with open(css_file, 'r', encoding='utf-8') as f:
                            css_content += f.read() + "\n"
                    except:
                        pass

            contrast_report = analyze_web_page_contrast(html_content, css_content)
            file_result["checks"]["color_contrast"] = contrast_report

            # Count issues (low contrast ratios)
            color_pairs = contrast_report.get("color_pairs_analyzed", [])
            failing_pairs = sum(
                1 for pair in color_pairs
                if not pair.get("wcag_aa", {}).get("normal", {}).get("passes", True)
            )

            self.results["summary"]["warnings"] += failing_pairs
            self.results["summary"]["total_issues"] += failing_pairs

        except Exception as e:
            file_result["checks"]["color_contrast"] = {
                "error": f"Color contrast check failed: {e}"
            }

        # 4. Check keyboard navigation
        try:
            focus_analysis = KeyboardNavigationEnhancer.analyze_focus_order(html_content)
            validation = KeyboardNavigationEnhancer.validate_focus_management(html_content)

            file_result["checks"]["keyboard_navigation"] = {
                "total_focusable": focus_analysis.get("total_focusable", 0),
                "issues": focus_analysis.get("issues", []),
                "validation_issues": validation.get("issues", [])
            }

            # Count issues
            kb_issues = focus_analysis.get("issues", []) + validation.get("issues", [])

            self.results["summary"]["warnings"] += len(kb_issues)
            self.results["summary"]["total_issues"] += len(kb_issues)

        except Exception as e:
            file_result["checks"]["keyboard_navigation"] = {
                "error": f"Keyboard navigation check failed: {e}"
            }

        return file_result

    def run_audit(self) -> Dict[str, Any]:
        """Run full accessibility audit on all HTML files"""
        print("Starting accessibility audit...")
        print("=" * 60)

        html_files = self.find_html_files()

        if not html_files:
            print("Warning: No HTML files found to analyze.")
            print("Looking in: dist/, index.html, public/")
            self.results["warning"] = "No HTML files found"
            return self.results

        print(f"Found {len(html_files)} HTML file(s) to analyze:\n")
        for f in html_files:
            print(f"  - {f.relative_to(self.base_dir)}")
        print()

        self.results["summary"]["total_files"] = len(html_files)

        # Analyze each file
        for html_file in html_files:
            file_result = self.analyze_file(html_file)
            self.results["files_analyzed"].append(file_result)

        # Calculate overall accessibility score
        # Score is calculated based on issues found, not just binary pass/fail
        total_issues = self.results["summary"]["total_issues"]
        errors = self.results["summary"]["errors"]
        warnings = self.results["summary"]["warnings"]

        # Base score calculation: 100 points, subtract for issues
        # Errors are more severe than warnings
        base_score = 100

        # Calculate penalty: each error = -10 points, each warning = -2 points
        penalty = (errors * 10) + (warnings * 2)

        # Calculate final score
        final_score = max(0, base_score - penalty)

        # Alternative: If no issues found, use component-based scoring
        if total_issues == 0:
            component_scores = []

            for file_result in self.results["files_analyzed"]:
                checks = file_result.get("checks", {})

                # Heading checks
                if "headings" in checks and "error" not in checks["headings"]:
                    summary = checks["headings"].get("summary", {})
                    if summary.get("valid_hierarchy", False):
                        component_scores.append(100)
                    else:
                        # Partial score if hierarchy has issues but no critical errors
                        findings = checks["headings"].get("findings", [])
                        error_count = sum(1 for f in findings if f.get("severity") == "error")
                        component_scores.append(max(50, 100 - (error_count * 25)))

                # Image checks
                if "images" in checks and "error" not in checks["images"]:
                    summary = checks["images"].get("summary", {})
                    score = summary.get("accessibility_score", 0)
                    component_scores.append(score)

                # Color contrast checks
                if "color_contrast" in checks and "error" not in checks["color_contrast"]:
                    score = checks["color_contrast"].get("accessibility_score", 0)
                    if score > 0:
                        component_scores.append(score)
                    else:
                        # If no color contrast issues detected, assume good
                        component_scores.append(100)

                # Keyboard navigation checks
                if "keyboard_navigation" in checks and "error" not in checks["keyboard_navigation"]:
                    kb_issues = len(checks["keyboard_navigation"].get("issues", []))
                    kb_validation = len(checks["keyboard_navigation"].get("validation_issues", []))
                    total_kb_issues = kb_issues + kb_validation
                    kb_score = max(50, 100 - (total_kb_issues * 10))
                    component_scores.append(kb_score)

            if component_scores:
                final_score = round(sum(component_scores) / len(component_scores), 2)

        self.results["summary"]["accessibility_score"] = final_score

        print("=" * 60)
        print("Audit complete!")
        print(f"Files analyzed: {self.results['summary']['total_files']}")
        print(f"Total issues found: {self.results['summary']['total_issues']}")
        print(f"  - Errors: {self.results['summary']['errors']}")
        print(f"  - Warnings: {self.results['summary']['warnings']}")
        print(f"Accessibility score: {self.results['summary']['accessibility_score']}%")
        print("=" * 60)

        return self.results

    def save_report(self, output_path: str = "report.json"):
        """Save audit results to JSON file"""
        output_file = Path(output_path)

        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(self.results, f, indent=2, ensure_ascii=False)

            print(f"\nReport saved to: {output_file.absolute()}")
            return True

        except Exception as e:
            print(f"Error saving report: {e}")
            return False


def main():
    """Main entry point for the accessibility checker"""
    import argparse

    parser = argparse.ArgumentParser(
        description="Run accessibility audit on HTML files"
    )
    parser.add_argument(
        "--dir",
        default=".",
        help="Base directory to search for HTML files (default: current directory)"
    )
    parser.add_argument(
        "--output",
        default="report.json",
        help="Output JSON report file (default: report.json)"
    )

    args = parser.parse_args()

    # Create auditor and run checks
    auditor = AccessibilityAuditor(base_dir=args.dir)
    results = auditor.run_audit()

    # Save report
    auditor.save_report(args.output)

    # Exit with error code only for critical errors
    # Warnings should not fail the build, but should be addressed
    errors = results["summary"]["errors"]
    score = results["summary"]["accessibility_score"]

    if errors > 0:
        print("\n❌ Critical accessibility errors found. Please fix before merging.")
        sys.exit(1)
    elif score < 50:
        print("\n⚠️  Accessibility score is critically low (<50%). Please review issues.")
        sys.exit(1)
    elif score < 70:
        print("\n⚠️  Accessibility score is below 70%. Please review issues.")
        print("Note: Build will continue, but these issues should be addressed.")
        sys.exit(0)  # Don't fail on warnings, just alert
    else:
        print("\n✅ Accessibility audit passed!")
        sys.exit(0)


if __name__ == "__main__":
    main()

