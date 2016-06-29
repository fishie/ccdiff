import itertools
import sys
import os
import re

from fontTools.ttLib import TTFont
from fontTools.unicode import Unicode

clean = lambda varStr: re.sub('\W|^(?=\d)','_', varStr)
name = clean(os.path.splitext(os.path.basename(sys.argv[1]))[0])
ttf = TTFont(sys.argv[1], 0, verbose=1, allowVID=0, ignoreDecompileErrors=False, fontNumber=-1)
for table in ttf['cmap'].tables:
    print('Platform ID={0}'.format(table.platformID))
    print('Is Unicode={0}'.format(table.isUnicode()))
    print('Language={0}'.format(table.language))
    print('Length={0}'.format(table.length))
    print('cmap length={0}'.format(len(table.cmap.items())))
    print()

#chars = set(chain.from_iterable([y[0] for y in x.cmap.items()] for x in ttf["cmap"].tables))
listoflists = [[x[0] for x in table.cmap.items()] for table in ttf['cmap'].tables if table.platformID == 0]
chars = sorted(set(itertools.chain.from_iterable(listoflists)))
print('chars length={0}'.format(len(chars)))

jsdict = '{' + ','.join([str(x)+':1' for x in chars]) + '}'
js = 'var {0}_glyphdict = {1};'.format(name, jsdict)

open('www/js/' + name + '.js', 'w').write(js)
ttf.close()
