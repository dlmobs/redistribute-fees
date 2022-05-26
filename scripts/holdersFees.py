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

# amount of UniDex to be distributed
token = float(sys.argv[1])
# token = 2000

# combine dataframes and drop unneeded columns
df = pd.concat([df_ftm, df_eth, df_boba])
df.drop(columns=["contract_decimals", "contract_name", "contract_ticker_symbol", "contract_address", "supports_erc", "logo_url", "total_supply", "block_height"], inplace=True)

# print(len(df_ftm))			used to confirm length is correct still
# print(len(df_eth))
# print(len(df_ftm) + len(df_eth))
# print(len(df))

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
df["usdc"] = df["decimal"] * token

# delete unnecessary columns and reset index
df.drop(columns=["balance", "decimal"], inplace=True)
df.reset_index(inplace=True, drop=True)

df.to_json(new_file, orient="values")
