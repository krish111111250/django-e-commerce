import sys
import socket
import requests

PROJECT_REF = 'pizwrdkaxugreawoxgfz'
DOMAIN = f"{PROJECT_REF}.supabase.co"
DB_DOMAIN = f"db.{PROJECT_REF}.supabase.co"

print(f"Checking status for Supabase Project: {PROJECT_REF}")

# 1. Check API Gateway (HTTP)
try:
    url = f"https://{DOMAIN}"
    print(f"Pinging {url}...")
    response = requests.get(url, timeout=5)
    print(f"HTTP Status: {response.status_code}")
    if response.status_code == 404:
        print("API Gateway is UP (404 on root is normal).")
    else:
        print("API Gateway seems UP.")
except Exception as e:
    print(f"HTTP URL Check FAILED: {e}")

# 2. Check Database DNS
print(f"Checking DNS for {DB_DOMAIN}...")
try:
    ip = socket.gethostbyname(DB_DOMAIN)
    print(f"DNS RESOLVED: {ip}")
except socket.gaierror:
    print("DNS RESOLUTION FAILED (NXDOMAIN).")
    print("CRITICAL: This usually means the project is PAUSED in Supabase.")
    print("Please go to https://supabase.com/dashboard/project/" + PROJECT_REF + " and restore it.")

# 3. Check Pooler DNS
POOLER = "aws-0-ap-south-1.pooler.supabase.com"
print(f"Checking DNS for Pooler {POOLER}...")
try:
    ip = socket.gethostbyname(POOLER)
    print(f"Pooler DNS RESOLVED: {ip}")
except:
    print("Pooler DNS FAILED.")

print("Status check complete.")
