#!/usr/bin/env python3

import os, argparse

parser = argparse.ArgumentParser()
parser.add_argument('-i', '--input-dir', default = '.', help = 'Directory containing the html files to convert into constexprs')
parser.add_argument('output_file', help = 'File to write constexprs to')
args = parser.parse_args()

html = ((h, f'{h.split(".")[0]}Html') for h in os.listdir(args.input_dir))

consts = []
for file, name in html:
    with open(os.path.join(args.input_dir, file)) as f:
        content = ''.join(
            l.strip() for l in f.read().split('\n') if l
        )

    # Increment by one to account for the null byte
    consts.append(f'// Length: {len(content) + 1}')
    consts.append(
        f'constexpr char {name}[] = R"htmldoc({content})htmldoc";'
    )

with open(args.output_file, 'w') as f:
    f.write('\n'.join(consts))
