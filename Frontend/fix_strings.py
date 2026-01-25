#!/usr/bin/env python3
"""Script to fix unterminated string literals in TypeScript files."""

import re
import sys
from pathlib import Path
from typing import List, Tuple

def get_files_with_errors() -> List[Tuple[str, int]]:
    """Get list of files with TS1002 errors and their line numbers."""
    try:
        with open('/tmp/build.log', 'r') as f:
            content = f.read()
        
        error_lines = []
        for line in content.split('\n'):
            if 'error TS1002' in line:
                match = re.match(r'(.+?)\((\d+),(\d+)\):', line)
                if match:
                    filepath = match.group(1)
                    line_num = int(match.group(2))
                    error_lines.append((filepath, line_num))
        
        return error_lines
    except Exception as e:
        print(f"Error reading build log: {e}")
        return []

def fix_line(line: str, line_num: int) -> str:
    """Fix unterminated string literals in a line."""
    original = line
    stripped = line.rstrip()
    newline = '\n' if line.endswith('\n') else ''
    
    # Pattern: Variable assignment with opening quote only at end
    # Example: let uuid = '; or let uuid = ";
    if re.match(r".*=\s*'\s*;?\s*$", stripped):
        if stripped.endswith("';"):
            line = stripped[:-2] + "'';" + newline
        elif stripped.endswith("'"):
            line = stripped[:-1] + "''" + newline
    elif re.match(r'.*=\s*"\s*;?\s*$', stripped):
        if stripped.endswith('";'):
            line = stripped[:-2] + '"";' + newline
        elif stripped.endswith('"'):
            line = stripped[:-1] + '""' + newline
    elif re.match(r'.*=\s*`\s*;?\s*$', stripped):
        if stripped.endswith('`;'):
            line = stripped[:-2] + '``;' + newline
        elif stripped.endswith('`'):
            line = stripped[:-1] + '``' + newline
    
    # Pattern: Function call with opening quote
    # Example: .join('); or Array.from().join(');
    elif re.match(r".*\(\s*'\s*\)\s*;?\s*$", stripped):
        line = re.sub(r"\(\s*'\s*\)", "('')", line)
    elif re.match(r'.*\(\s*"\s*\)\s*;?\s*$', stripped):
        line = re.sub(r'\(\s*"\s*\)', '("")', line)
    elif re.match(r'.*\(\s*`\s*\)\s*;?\s*$', stripped):
        line = re.sub(r'\(\s*`\s*\)', '(``)', line)
    
    # Pattern: OR with opening quote
    # Example: || ';
    elif re.match(r".*\|\|\s*'\s*;", stripped):
        line = re.sub(r"\|\|\s*'\s*;", "|| '';", line)
    elif re.match(r'.*\|\|\s*"\s*;', stripped):
        line = re.sub(r'\|\|\s*"\s*;', '|| "";', line)
    elif re.match(r'.*\|\|\s*`\s*;', stripped):
        line = re.sub(r'\|\|\s*`\s*;', '|| ``;', line)
    
    # Pattern: Property value with opening quote
    # Example: payload: ', or name: ",
    elif re.match(r".*:\s*',\s*$", stripped):
        line = stripped[:-2] + "''," + newline
    elif re.match(r'.*:\s*",\s*$', stripped):
        line = stripped[:-2] + '"",' + newline
    elif re.match(r'.*:\s*`,\s*$', stripped):
        line = stripped[:-2] + '``,' + newline
    elif re.match(r".*:\s*'\s*$", stripped):
        line = stripped[:-1] + "''" + newline
    elif re.match(r'.*:\s*"\s*$', stripped):
        line = stripped[:-1] + '""' + newline
    elif re.match(r'.*:\s*`\s*$', stripped):
        line = stripped[:-1] + '``' + newline
    
    # Pattern: Parameter value with quote and comma
    # Example: private prefix: string = ',
    elif re.match(r".*=\s*',\s*$", stripped):
        line = stripped[:-2] + "''," + newline
    elif re.match(r'.*=\s*",\s*$', stripped):
        line = stripped[:-2] + '"",' + newline
    elif re.match(r'.*=\s*`,\s*$', stripped):
        line = stripped[:-2] + '``,' + newline
    
    # Pattern: Replace with opening quote
    # Example: .replace(/^_/, ')
    elif re.search(r"\.replace\([^)]*'\)\s*$", stripped):
        line = re.sub(r"\.replace\(([^,]+),\s*'\)", r".replace(\1, '')", line)
    elif re.search(r'\.replace\([^)]*"\)\s*$', stripped):
        line = re.sub(r'\.replace\(([^,]+),\s*"\)', r'.replace(\1, "")', line)
    elif re.search(r'\.replace\([^)]*`\)\s*$', stripped):
        line = re.sub(r'\.replace\(([^,]+),\s*`\)', r'.replace(\1, ``)', line)
    
    # Pattern: Function argument with opening quote
    # Example: this.ipHash(healthyWorkers, sessionId || ');
    elif re.search(r'\|\|\s*\'\)\s*;?\s*$', stripped):
        line = re.sub(r"\|\|\s*'\)", "|| '')", line)
    elif re.search(r'\|\|\s*"\)\s*;?\s*$', stripped):
        line = re.sub(r'\|\|\s*"\)', '|| "")', line)
    elif re.search(r'\|\|\s*`\)\s*;?\s*$', stripped):
        line = re.sub(r'\|\|\s*`\)', '|| ``)', line)
    
    # Pattern: Ternary with opening quote (: branch)
    # Example: : ';
    elif re.match(r".*:\s*'\s*;?\s*$", stripped):
        if stripped.endswith("';"):
            line = stripped[:-2] + "'';" + newline
        elif stripped.endswith("'"):
            line = stripped[:-1] + "''" + newline
    elif re.match(r'.*:\s*"\s*;?\s*$', stripped):
        if stripped.endswith('";'):
            line = stripped[:-2] + '""' + ";" + newline
        elif stripped.endswith('"'):
            line = stripped[:-1] + '""' + newline
    elif re.match(r'.*:\s*`\s*;?\s*$', stripped):
        if stripped.endswith('`;'):
            line = stripped[:-2] + '``' + ";" + newline
        elif stripped.endswith('`'):
            line = stripped[:-1] + '``' + newline
    
    # Pattern: Ternary with opening quote (? branch)
    # Example: ? ';
    elif re.match(r".*\?\s*'\s*;?\s*$", stripped):
        if stripped.endswith("';"):
            line = stripped[:-2] + "'';" + newline
        elif stripped.endswith("'"):
            line = stripped[:-1] + "''" + newline
    elif re.match(r'.*\?\s*"\s*;?\s*$', stripped):
        if stripped.endswith('";'):
            line = stripped[:-2] + '""' + ";" + newline
        elif stripped.endswith('"'):
            line = stripped[:-1] + '""' + newline
    elif re.match(r'.*\?\s*`\s*;?\s*$', stripped):
        if stripped.endswith('`;'):
            line = stripped[:-2] + '``' + ";" + newline
        elif stripped.endswith('`'):
            line = stripped[:-1] + '``' + newline
    
    # Pattern: Strings inside function calls
    # Example: this.simplifySelector(pattern.selector || ');
    elif re.search(r"\([^)]*\|\|\s*'\)\s*;?\s*$", stripped):
        line = re.sub(r"\(([^)]*)\|\|\s*'\)", r"(\1|| '')", line)
    elif re.search(r'\([^)]*\|\|\s*"\)\s*;?\s*$', stripped):
        line = re.sub(r'\(([^)]*)\|\|\s*"\)', r'(\1|| "")', line)
    elif re.search(r'\([^)]*\|\|\s*`\)\s*;?\s*$', stripped):
        line = re.sub(r'\(([^)]*)\|\|\s*`\)', r'(\1|| ``)', line)
    
    # Pattern: OR operator with quote and comma
    # Example: pattern.selector || ',
    elif re.search(r"\|\|\s*',\s*$", stripped):
        line = re.sub(r"\|\|\s*',", "|| '',", line)
    elif re.search(r'\|\|\s*",\s*$', stripped):
        line = re.sub(r'\|\|\s*",', '|| "",', line)
    elif re.search(r'\|\|\s*`,\s*$', stripped):
        line = re.sub(r'\|\|\s*`,', '|| ``,', line)
    
    # Pattern: Null coalescing operator with quote and comma
    # Example: config.cloudEndpoint ?? ',
    elif re.search(r"\?\?\s*',\s*$", stripped):
        line = re.sub(r"\?\?\s*',", "?? '',", line)
    elif re.search(r'\?\?\s*",\s*$', stripped):
        line = re.sub(r'\?\?\s*",', '?? "",', line)
    elif re.search(r'\?\?\s*`,\s*$', stripped):
        line = re.sub(r'\?\?\s*`,', '?? ``,', line)
    
    # Pattern: Ternary operator with quote before closing paren
    # Example: ? '...' : ')
    elif re.search(r":\s*'\)\s*$", stripped):
        line = re.sub(r":\s*'\)", ": '')", line)
    elif re.search(r':\s*"\)\s*$', stripped):
        line = re.sub(r':\s*"\)', ': "")', line)
    elif re.search(r':\s*`\)\s*$', stripped):
        line = re.sub(r':\s*`\)', ': ``)', line)
    
    # Pattern: Replace with empty string ending with closing paren
    # Example: .replace(/:nth-child\([^)]+\)/g, ') or .replace(/\s/g, ')
    elif re.search(r'\.replace\([^,]+,\s*\'\)\s*$', stripped):
        line = re.sub(r'(\.replace\([^,]+,\s*)\'(\)\s*)$', r"\1''\2", line)
    elif re.search(r'\.replace\([^,]+,\s*"\)\s*$', stripped):
        line = re.sub(r'(\.replace\([^,]+,\s*)"(\)\s*)$', r'\1""\2', line)
    elif re.search(r'\.replace\([^,]+,\s*`\)\s*$', stripped):
        line = re.sub(r'(\.replace\([^,]+,\s*)`(\)\s*)$', r'\1``\2', line)
    
    # Pattern: Array element with just opening quote
    # Example: ',
    # This is a line with just whitespace, quote, comma
    elif re.match(r"^\s*',\s*$", stripped):
        line = re.sub(r"^(\s*)','", r"\1'',", line)
    elif re.match(r'^\s*",\s*$', stripped):
        line = re.sub(r'^(\s*)",$', r'\1"",', line)
    elif re.match(r'^\s*`,\s*$', stripped):
        line = re.sub(r'^(\s*)`,$', r'\1``,', line)
    
    # Pattern: Array element or standalone with just quote and optional semicolon
    # Example: ';
    elif re.match(r"^\s*'\s*;?\s*$", stripped):
        if stripped.endswith("';"):
            line = re.sub(r"^(\s*)'';", r"\1'';" + newline, stripped + newline)
        else:
            line = re.sub(r"^(\s*)'$", r"\1''" + newline, stripped + newline)
    elif re.match(r'^\s*"\s*;?\s*$', stripped):
        if stripped.endswith('";'):
            line = re.sub(r'^(\s*)"";', r'\1"";' + newline, stripped + newline)
        else:
            line = re.sub(r'^(\s*)"$', r'\1""' + newline, stripped + newline)
    elif re.match(r'^\s*`\s*;?\s*$', stripped):
        if stripped.endswith('`;'):
            line = re.sub(r'^(\s*)``', r'\1``;' + newline, stripped + newline)
        else:
            line = re.sub(r'^(\s*)`$', r'\1``' + newline, stripped + newline)
    
    if line != original:
        print(f"  Line {line_num}: Fixed")
    
    return line

def fix_file(filepath: str, error_lines: List[int]) -> bool:
    """Fix a file with unterminated string literal errors."""
    full_path = Path('/home/runner/work/QANTUM-FRAMEWORK-PRIVATE/QANTUM-FRAMEWORK-PRIVATE/Frontend') / filepath
    
    if not full_path.exists():
        print(f"File not found: {full_path}")
        return False
    
    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        modified = False
        error_line_set = set(error_lines)
        
        for i, line in enumerate(lines):
            line_num = i + 1
            if line_num in error_line_set:
                fixed_line = fix_line(line, line_num)
                if fixed_line != line:
                    lines[i] = fixed_line
                    modified = True
        
        if modified:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            return True
        
        return False
    except Exception as e:
        print(f"Error fixing file {filepath}: {e}")
        return False

def main():
    """Main function."""
    print("Scanning for TypeScript TS1002 errors...")
    errors = get_files_with_errors()
    
    if not errors:
        print("No TS1002 errors found!")
        return 0
    
    # Group errors by file
    files_to_fix = {}
    for filepath, line_num in errors:
        if filepath not in files_to_fix:
            files_to_fix[filepath] = []
        files_to_fix[filepath].append(line_num)
    
    print(f"\nFound {len(errors)} errors in {len(files_to_fix)} files\n")
    
    fixed_files = 0
    for filepath, error_lines in sorted(files_to_fix.items()):
        print(f"Fixing {filepath} ({len(error_lines)} errors)...")
        if fix_file(filepath, error_lines):
            fixed_files += 1
    
    print(f"\n✓ Fixed {fixed_files} files")
    return 0

if __name__ == '__main__':
    sys.exit(main())
