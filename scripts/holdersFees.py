import pandas as pd
import sys

# read csv files
df_ftm = pd.read_csv('data/csv/ftm-tokenholders.csv')
df_eth = pd.read_csv('data/csv/eth-tokenholders.csv')
df_boba = pd.read_json('data/csv/boba-tokenholders.json')
new_file = "data/csv/crosschain-tokenholders.json"

# boba
df_boba = df_boba["result"].apply(pd.Series)
df_boba.rename(columns={"value": "balance"}, inplace=True)

# amount of UniDex to be distributed - subtract one to avoid issues with distribution
token = float(sys.argv[1]) - 1
# token = 2000

# combine dataframes and drop unneeded columns
df = pd.concat([df_ftm, df_eth, df_boba])
df.drop(columns=["contract_decimals", "contract_name", "contract_ticker_symbol", "contract_address", "supports_erc", "logo_url", "total_supply", "block_height"], inplace=True)

# filter out addresses
with open('data/filterAddresses.txt') as f:
    filter_addresses = f.readlines()

# print(len(df) - len(filter_addresses))	double check filter edits
for address in filter_addresses:
	df = df[df["address"] != address]

# sort and make calculations
df["balance"] = df["balance"].astype(float)
df.sort_values(by=["balance"], inplace=True, ascending=False)

total = sum(df["balance"])
df["decimal"] = df["balance"]/total
df["usdc"] = df["decimal"] * token * 1000000 # conversion back to 1e6

# convert to string
df['usdc'] = df['usdc'].apply('{:.9f}'.format)

# delete unnecessary columns and reset index
df.drop(columns=["balance", "decimal"], inplace=True)
df.reset_index(inplace=True, drop=True)

df.to_json(new_file, orient="values")
