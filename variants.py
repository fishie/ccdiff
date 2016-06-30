import collections

def get_charcode(text):
    return int(text[2:], 16)

def nnprint(text):
    print(text, end='')

d = collections.defaultdict(set)

# Create a bidirectional graph
for line in open('Unihan_Variants.txt'):
    if line[0] == '#' or line.strip() == '': continue
    from_codepoint, variant_style, tos = line.split(maxsplit=2)

    if variant_style in ['kTraditionalVariant', 'kSimplifiedVariant', 'kZVariant']:
        for to in tos.split():
            to_codepoint = to.split('<')[0].strip()
            from_charcode = get_charcode(from_codepoint)
            to_charcode = get_charcode(to_codepoint)
            d[from_charcode].add(to_charcode)
            d[to_charcode].add(from_charcode)

# Find connected subgraphs using BFSs
visited = set()
for codepoint in d.keys():
    if codepoint in visited:
        continue

    nodes = {codepoint}
    queue = [codepoint]
    while len(queue) > 0:
        current = queue.pop()
        visited.add(current)
        nodes.add(current)
        for adjacent in d[current]:
            if adjacent not in nodes:
                queue.insert(0, adjacent)
    for node in nodes:
        d[node] = nodes - {node}

entries = []
for from_codepoint in sorted(d.keys()):
    character_string = str(from_codepoint) + ':['
    character_string += ','.join(map(str, d[from_codepoint])) + ']'
    entries.append(character_string)
js = 'var variantsMap = {' + ','.join(entries) + '};'
open('www/js/variants.js', 'w').write(js)
print(js)
