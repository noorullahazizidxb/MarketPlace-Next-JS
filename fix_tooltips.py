import re

with open('d:/projects/MarketPlace_Back_end__Front_End/marketplace-Front-end/src/components/ui/listing-card.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The first sed matched <DialogClose asChild> and inserted <Tooltip>. The second sed failed.
# Let's cleanly fix it.
content = re.sub(r'<DialogClose asChild>\s*<Tooltip content=\{t\("close"\)\}>\s*<button(.*?)>\s*(.*?)\s*</button>\s*</DialogClose>',
                 r'<DialogClose asChild>\n                      <Tooltip content={t("close")}>\n                        <button\1>\n                          \2\n                        </button>\n                      </Tooltip>\n                    </DialogClose>',
                 content, flags=re.DOTALL)

with open('d:/projects/MarketPlace_Back_end__Front_End/marketplace-Front-end/src/components/ui/listing-card.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

