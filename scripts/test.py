import pandas as pd

df_boba = pd.read_json('data/csv/boba-tokenholders.json')
df_boba = df_boba["result"].apply(pd.Series)
print(df_boba.head())
print(df_boba.head())