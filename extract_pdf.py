import PyPDF2
import sys

try:
    pdf_file = open('c:\\Users\\Oranolio\\Desktop\\MetzlerCares\\Website Audit and Improvement Plan.pdf', 'rb')
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    
    text = ''
    for i, page in enumerate(pdf_reader.pages):
        text += f"=== PAGE {i+1} ===\n"
        text += page.extract_text() + '\n\n'
    
    pdf_file.close()
    
    # Write to text file
    with open('c:\\Users\\Oranolio\\Desktop\\MetzlerCares\\website_improvement_plan.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    
    print("PDF extracted successfully!")
    print(f"Total pages: {len(pdf_reader.pages)}")
    print("\nFirst few lines of content:")
    print(text[:2000])
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)