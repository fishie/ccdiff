import collections

def get_charcode(text):
    return int(text[2:], 16)

def nnprint(text):
    print(text, end='')

d = collections.defaultdict(set)

for line in open('Unihan_Variants.txt'):
    if line[0] == '#' or line.strip() == '': continue
    from_codepoint, variant_style, tos = line.split(maxsplit=2)

    if variant_style in ['kTraditionalVariant', 'kSimplifiedVariant', 'kZVariant']:
        for to in tos.split():
            to_codepoint = to.split('<')[0].strip()
            d[get_charcode(from_codepoint)].add(get_charcode(to_codepoint))

for from_codepoint in list(d.keys()):
    for to_codepoint in d[from_codepoint]:
        to_set = set(d[to_codepoint])
        if from_codepoint in to_set:
            to_set.remove(from_codepoint)
        d[from_codepoint] = d[from_codepoint].union(to_set)
        d[to_codepoint].add(from_codepoint)

entries = []
for from_codepoint in d:
    character_string = str(from_codepoint) + ':['
    character_string += ','.join(map(str, d[from_codepoint])) + ']'
    entries.append(character_string)
print('{' + ','.join(entries) + '}')

