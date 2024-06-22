import argparse

from keys import create_and_save_key

parser = argparse.ArgumentParser()
parser.add_argument("-n", "--name", required=True)
parser.add_argument("-o", "--output", required=True)
parser.add_argument("-p", "--password", required=True)
args = parser.parse_args()

#TODO: prompts
#TODO: prompt if file exists already

create_and_save_key(
    args.name,
    args.password,
    args.output
)