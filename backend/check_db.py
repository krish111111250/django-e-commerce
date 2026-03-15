import sys
import os
import psycopg2
from urllib.parse import urlparse

USER = 'postgres'
PASS = 'ramani2005%40%40'
PROJECT_REF = 'pizwrdkaxugreawoxgfz'

def test_conn(host, port, user, dbname='postgres', sslmode='require'):
    print(f"Testing connection to {host}:{port} as {user}...")
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=PASS,
            dbname=dbname,
            sslmode=sslmode,
            connect_timeout=5
        )
        print(f"SUCCESS! Connected to {host}:{port}")
        conn.close()
        return True
    except Exception as e:
        print(f"FAILED: {e}")
        return False

# 1. Try Direct (Standard Supabase)
# usually db.<ref>.supabase.co
# test_conn(f"db.{PROJECT_REF}.supabase.co", 5432, "postgres") 

# 2. Try Pooler (India Region guess)
# usually aws-0-ap-south-1.pooler.supabase.com:6543
# User format: using session pooler? port 5432 user 'postgres' (if supported)
# start with transaction pooler port 6543 user 'postgres.<ref>'
if test_conn("aws-0-ap-south-1.pooler.supabase.com", 6543, f"postgres.{PROJECT_REF}"):
    print("Found valid pooler connection!")

# 3. Try generic hostname (resolved)
if test_conn(f"{PROJECT_REF}.supabase.co", 5432, "postgres"):
    print("Found valid direct connection via main domain!")

# 4. Try generic hostname with pooler port?
test_conn(f"{PROJECT_REF}.supabase.co", 6543, f"postgres.{PROJECT_REF}")
