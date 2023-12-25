
#!/usr/bin/env bash

# activate python virtual env to run pip commands like Tinybird CLI
source ~/.venv/bin/activate

# change to the directory containing the script
cd "$(dirname "$0")"
cd ..

# clean up datasource from prev data
tb datasource truncate link_clicks --yes

# generate clicks and write to a fixture file
echo ""
node -r ts-node/register scripts/generate_clicks.ts --filename link_clicks.csv --rows 1000000
echo ""

# send fixture data to the datasource
tb datasource append link_clicks link_clicks.csv

# remove seed artifacts
rm link_clicks.csv
