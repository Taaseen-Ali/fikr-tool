import json, re, urllib.request, time, sys
sys.path.insert(0, '/data/.openclaw/workspace/fikr-modern')
from generate_roots import build_user_prompt, SYSTEM_PROMPT, call_gpt, expand_sarf

root_info = {"root_arabic": "ك ت ب", "slug": "k-t-b", "past": "كَتَبَ", "future": "يَكْتُبُ", "masdar": "كِتَابَة"}

t = time.time()
result = call_gpt([{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": build_user_prompt(root_info)}])
result = re.sub(r'^```[a-z]*\s*', '', result.strip())
result = re.sub(r'\s*```$', '', result.strip())
data = json.loads(result)
data = expand_sarf(data)
elapsed = time.time() - t

print(f"Time: {elapsed:.1f}s")
bab = data["babs"][0]
sk = bab["sarf_kabir"]
for section, val in sk.items():
    print(f"  {section}: {len(val['rows'])} rows, sample={val['rows'][0]['form']}")
print("mazeed:", [(m["wazn"], m["exists"]) for m in data["mazeed"]])
