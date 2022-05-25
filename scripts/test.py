import pandas as pd

df = pd.read_json('data/csv/boba-tokenholders.json')
print(df.head())