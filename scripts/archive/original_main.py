import pandas as pd

# read csv files
df_ftm = pd.read_csv('data/export-tokenholders-for-contract-0x2130d2a1e51112d349ccf78d2a1ee65843ba36e0.csv')
df_eth = pd.read_csv('data/export-tokenholders-for-contract-0x95b3497bbcccc46a8f45f5cf54b0878b39f8d96c.csv')
new_file = "finished.csv"

# amount of UniDex to be distributed
token = 2000

# combine dataframes
df = pd.concat([df_ftm, df_eth])

# print(len(df_ftm))			used to confirm length is correct still
# print(len(df_eth))
# print(len(df_ftm) + len(df_eth))
# print(len(df))

# filter out addresses
filter_addresses = [
	"0xc564ee9f21ed8a2d8e7e76c085740d5e4c5fafbe",
	"0xf74bf048138a2b8f825eccabed9e02e481a0f6c0",
	"0x015efb351919f30f1820e4118a09dcf6759288d4",
	"0x5f4bb61c9d736b17c0dedd8081864d56484408d9",
	"0xe236416af855196acb1cd16712a2311ccc9c950d",
	"0x11ededebf63bef0ea2d2d071bdf88f71543ec6fb",
	"0x95b3497bbcccc46a8f45f5cf54b0878b39f8d96c",
	"0xbddd7e0d950abd902f18068e92f61cefe58d9180",
	"0xef5a2298d5ca18ce8967390dace51a825f8d6418",
	"0x0000000000000eb4ec62758aae93400b3e5f7f18",
	"0x3328f5f2cecaf00a2443082b657cedeaf70bfaef",
	"0x4f2195a538760387b61df4abd8efa158fb0be47c",
	"0x766d082266670828c08522a38201359dd05d4e89",
	"0xb7ec8b38601ff09fe86ace3d1799bf63d2dcb2f6",
	"0x20dd72ed959b6147912c2e529f0a0c651c33c9ce",
	"0x38655f2e859960f3cc10848777982faba3451ec7",
	"0x5063fc9d759b5b03dd5fbc0b882b5f68cf881c32",
	"0x578c7b9a45d9e55246d3036d48db262b9b3ca48e",
	"0x2a520963f332c347c83a6e20f4ca33e2f24b6305",
	"0x7e5cc28cc2b67080b666d77a4a5a5b110618e146"
]

# print(len(df) - len(filter_addresses))	double check filter edits
for address in filter_addresses:
	df = df[df.HolderAddress != address]

# sort and make calculations
df.sort_values(by=["Balance"], inplace=True, ascending=False)

total = sum(df["Balance"])
df["Decimal"] = df["Balance"]/total
df["UniDex"] = df["Decimal"] * token

# delete unnecessary columns and reset index
df.drop(columns=["PendingBalanceUpdate", "Balance", "Decimal"], inplace=True)
df.reset_index(inplace=True, drop=True)

df.to_csv(new_file, header=False, index=False)
