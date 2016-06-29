import os
import subprocess

fonts = os.listdir('www/fonts')

for font in fonts:
    print(font)
    process = subprocess.run(['python', 'get_codepoints.py', 'www/fonts/' + font],
        stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    print(str(process.stdout, 'utf-8'))
    print(str(process.stderr, 'utf-8'))
