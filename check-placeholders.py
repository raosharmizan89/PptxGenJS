#!/usr/bin/env python3
import re
import json

# Read testflow file
with open('testflow', 'r') as f:
    testflow = f.read()

# Extract templates from step_templates:data section
templates_start = testflow.find('step_templates:data')
templates_end = testflow.find('----', templates_start)
templates_section = testflow[templates_start:templates_end]

# Parse templates
template_pattern = r'\{[^}]*"template":\s*"([^"]+)"[^}]*"code":\s*"([^"]+)"'
matches = re.findall(template_pattern, templates_section, re.DOTALL)

print("=" * 80)
print("PLACEHOLDER NAMES USED IN TESTFLOW TEMPLATES:")
print("=" * 80)

template_placeholders = {}
for template_name, code in matches:
    # Find all placeholder names in the code
    placeholder_pattern = r'placeholder:\s*"([^"]+)"'
    placeholders = re.findall(placeholder_pattern, code)
    
    if placeholders:
        template_placeholders[template_name] = set(placeholders)
        print(f"\n{template_name}:")
        for ph in sorted(placeholders):
            print(f"  - {ph}")

# Now read the custom layouts file
try:
    with open('src/cust-xml-slide-layouts.ts', 'r') as f:
        layouts_content = f.read()
    
    print("\n" + "=" * 80)
    print("CHECKING PLACEHOLDER NAMES IN LAYOUT DEFINITIONS:")
    print("=" * 80)
    
    # Extract layout names and their placeholder types
    layout_names = re.findall(r'name="([^"]+)"', layouts_content)
    unique_layouts = set(layout_names)
    
    print(f"\nFound {len(unique_layouts)} unique layouts in XML definitions")
    
    # Extract placeholder types from XML
    placeholder_types = re.findall(r'type="([^"]+)"', layouts_content)
    unique_types = set(placeholder_types)
    print(f"\nPlaceholder types found in layouts: {sorted(unique_types)}")
    
except FileNotFoundError:
    print("\nCould not find src/cust-xml-slide-layouts.ts")

print("\n" + "=" * 80)
print("SUMMARY:")
print("=" * 80)
print(f"Total templates in testflow: {len(template_placeholders)}")
print(f"Templates with placeholders: {sum(1 for v in template_placeholders.values() if v)}")
