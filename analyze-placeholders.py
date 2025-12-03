#!/usr/bin/env python3
import re
import json

# Read testflow
with open('testflow', 'r') as f:
    content = f.read()

# Extract placeholder names from layout definitions (step_*Layouts:data sections)
layout_placeholders = {}
layout_sections = re.findall(r'(step_\w+Layout.*?:data.*?)(?=\n----|\nstep_|\Z)', content, re.DOTALL)

for section in layout_sections:
    section_name = re.search(r'step_(\w+Layout\w*):data', section)
    if section_name:
        layout_name = section_name.group(1)
        # Find all placeholder names
        names = re.findall(r'name:\s*"([^"]+)"', section)
        if names:
            layout_placeholders[layout_name] = set(names)

# Extract placeholder names from template codes (step_templates:data section)
template_start = content.find('step_templates:data')
template_end = content.find('\n----', template_start)
template_section = content[template_start:template_end]

# Parse JSON array
try:
    # Extract the JSON array
    json_start = template_section.find('[')
    json_text = template_section[json_start:]
    
    templates = json.loads(json_text)
    
    template_placeholders = {}
    for tmpl in templates:
        template_name = tmpl.get('template', 'Unknown')
        code = tmpl.get('code', '')
        
        # Find all placeholder names in code
        ph_matches = re.findall(r'placeholder:\s*"([^"]+)"', code)
        if ph_matches:
            template_placeholders[template_name] = set(ph_matches)
    
    print("=" * 100)
    print("ANALYSIS: Placeholder Names in Templates vs. Layout Definitions")
    print("=" * 100)
    
    # Get all unique placeholder names from templates
    all_template_phs = set()
    for phs in template_placeholders.values():
        all_template_phs.update(phs)
    
    # Get all unique placeholder names from layouts
    all_layout_phs = set()
    for phs in layout_placeholders.values():
        all_layout_phs.update(phs)
    
    print(f"\n📊 SUMMARY:")
    print(f"  - Total templates: {len(template_placeholders)}")
    print(f"  - Total layout sections: {len(layout_placeholders)}")
    print(f"  - Unique placeholder names in templates: {len(all_template_phs)}")
    print(f"  - Unique placeholder names in layouts: {len(all_layout_phs)}")
    
    # Check for mismatches
    missing_in_layouts = all_template_phs - all_layout_phs
    extra_in_layouts = all_layout_phs - all_template_phs
    
    if missing_in_layouts:
        print(f"\n⚠️  WARNING: {len(missing_in_layouts)} placeholder names used in templates but NOT defined in layouts:")
        for ph in sorted(missing_in_layouts):
            print(f"     - '{ph}'")
            # Find which templates use this
            using_templates = [t for t, phs in template_placeholders.items() if ph in phs]
            print(f"       Used in: {', '.join(using_templates[:3])}{' ...' if len(using_templates) > 3 else ''}")
    
    if extra_in_layouts:
        print(f"\n✅ NOTE: {len(extra_in_layouts)} placeholder names defined in layouts but not used in templates:")
        for ph in sorted(extra_in_layouts):
            print(f"     - '{ph}'")
    
    if not missing_in_layouts:
        print("\n✅ ALL GOOD: All placeholder names used in templates are defined in layouts!")
    
    # Detailed template-by-template check
    print("\n" + "=" * 100)
    print("DETAILED TEMPLATE CHECK:")
    print("=" * 100)
    
    for template_name, phs in sorted(template_placeholders.items()):
        issues = []
        for ph in phs:
            if ph not in all_layout_phs:
                issues.append(ph)
        
        status = "❌ HAS ISSUES" if issues else "✅ OK"
        print(f"\n{status} - {template_name}")
        print(f"  Placeholders: {', '.join(sorted(phs))}")
        if issues:
            print(f"  ⚠️  Missing in layouts: {', '.join(sorted(issues))}")

except json.JSONDecodeError as e:
    print(f"Error parsing JSON: {e}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "=" * 100)
