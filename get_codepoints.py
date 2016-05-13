from itertools import chain
import sys
import os
import re

from fontTools.ttLib import TTFont
from fontTools.unicode import Unicode

clean = lambda varStr: re.sub('\W|^(?=\d)','_', varStr)
name = clean(os.path.splitext(os.path.basename(sys.argv[1]))[0])
ttf = TTFont(sys.argv[1], 0, verbose=0, allowVID=0, ignoreDecompileErrors=True, fontNumber=-1)
chars = set(chain.from_iterable([y[0] for y in x.cmap.items()] for x in ttf["cmap"].tables))

jsdict = '{' + ','.join([str(x)+':1' for x in chars]) + '}'
js = 'var {0}_glyphdict = {1};'.format(name, jsdict)

open(name + '.js', 'w').write(js)

ttf.close()
