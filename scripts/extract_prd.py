#!/usr/bin/env python3
"""Extract full content from Postform PRD.docx including tables"""
import docx
from docx.document import Document as DocObj
from docx.table import Table
from docx.text.paragraph import Paragraph

def iter_block_items(parent):
    """Yield paragraphs and tables in document order"""
    if isinstance(parent, DocObj):
        parent_elm = parent.element.body
    else:
        parent_elm = parent._element
    for child in parent_elm.iterchildren():
        if child.tag.endswith('}p'):
            yield Paragraph(child, parent)
        elif child.tag.endswith('}tbl'):
            yield Table(child, parent)

doc = docx.Document('/home/z/my-project/upload/Postform PRD.docx')

output = []
for block in iter_block_items(doc):
    if isinstance(block, Paragraph):
        style = block.style.name if block.style else 'Normal'
        text = block.text.strip()
        if text:
            if 'Heading' in style:
                level = ''.join(c for c in style if c.isdigit()) or '1'
                output.append(f"\n{'#' * int(level)} {text}")
            else:
                output.append(text)
    elif isinstance(block, Table):
        output.append("\n[TABLE]")
        for row in block.rows:
            cells = [cell.text.strip().replace('\n', ' | ') for cell in row.cells]
            output.append(" || ".join(cells))
        output.append("[/TABLE]\n")

with open('/home/z/my-project/prd_content.txt', 'w', encoding='utf-8') as f:
    f.write("\n".join(output))

print(f"Extracted {len(output)} blocks")
print("Saved to /home/z/my-project/prd_content.txt")
