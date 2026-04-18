import codecs

file_path = r'd:\Raksha\RakshaNow\RakshaNow\src\screens\ProfileScreen.tsx'

with codecs.open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.startswith('// '):
        new_lines.append(line[3:])
    elif line.startswith('//'):
        new_lines.append(line[2:])
    else:
        new_lines.append(line)

with codecs.open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Uncommented ProfileScreen.tsx")
