import pandas as pd
import json

file_path = 'dataset/Univeristy_Results.xls'

try:
    df = pd.read_excel(file_path)
    
    print("=== Columns ===")
    print(df.columns.tolist())
    
    print("\n=== Data Info ===")
    df.info()
    
    print("\n=== First 15 Rows ===")
    print(df.head(15))
    
    xls = pd.ExcelFile(file_path)
    print("\n=== Sheet Names ===")
    print(xls.sheet_names)
    
    for sheet in xls.sheet_names:
        df = pd.read_excel(file_path, sheet_name=sheet)
        print(f"\n--- Sheet: {sheet} ---")
        print(df.head(5))
        
except Exception as e:
    print(f"Error reading file: {e}")
