import re
with open("src/pages/CompareLibraryDetail.tsx") as f:
    text = f.read()

# very basic stack matching
stack = []
lines = text.split("\n")
for i, line in enumerate(lines):
    opens = len(re.findall(r'<\w+', line)) - len(re.findall(r'/>', line)) - len(re.findall(r'</\w+', line))
    # just count <div and </div
    div_opens = len(re.findall(r'<div', line))
    div_closes = len(re.findall(r'</div', line))
    for _ in range(div_opens):
        stack.append(i)
    for _ in range(div_closes):
        if stack:
            stack.pop()
        else:
            print(f"Extra closing div on line {i+1}: {line}")
print("Unmatched open divs:", len(stack))
