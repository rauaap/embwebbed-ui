#!/usr/bin/env python3

import os, argparse, re

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input-dir', default = '.', help = 'Directory containing the html files to convert into constexprs')
parser.add_argument('output_file', help = 'File to write constexprs to')
args = parser.parse_args()

html = ((h, f'{h.split(".")[0]}Html') for h in os.listdir(args.input_dir))
comment = re.compile('<!-- .*? -->')

consts = []
for file, name in html:
    with open(os.path.join(args.input_dir, file)) as f:
        content = ''.join(
            re.sub(comment, '', l.strip()) for l in f.read().split('\n') if l
        )

    consts.append(f'// Length (excluding terminating null byte): {len(content)}')
    consts.append(
        f'constexpr char {name}[] = R"htmldoc({content})htmldoc";'
    )

with open(args.output_file, 'w') as f:
    f.write('\n'.join(consts) + '\n')
