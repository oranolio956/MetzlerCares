import pdfplumber
import os

# Check if PDF file exists
pdf_path = 'c:\\Users\\Oranolio\\Desktop\\MetzlerCares\\Website Audit and Improvement Plan.pdf'
txt_path = 'c:\\Users\\Oranolio\\Desktop\\MetzlerCares\\website_improvement_plan.txt'

print(f"PDF exists: {os.path.exists(pdf_path)}")
print(f"PDF size: {os.path.getsize(pdf_path) if os.path.exists(pdf_path) else 'N/A'}")

try:
    with pdfplumber.open(pdf_path) as pdf:
        text = ''
        for i, page in enumerate(pdf.pages):
            text += f"\n{'='*80}\n"
            text += f"PAGE {i+1}\n"
            text += f"{'='*80}\n\n"
            page_text = page.extract_text()
            if page_text:
                text += page_text
            else:
                text += "[No text extracted from this page]"
        
        # Write to text file
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write(text)
        
        print(f"Successfully extracted {len(pdf.pages)} pages")
        print(f"Text saved to: {txt_path}")
        print(f"First 2000 characters of extracted text:")
        print(text[:2000])
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()