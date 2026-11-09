"""Recalcula um .xlsx no Microsoft Excel (Windows, via COM) e lista erros de fórmula.

Uso:  python recalc_excel.py caminho\\modelo.xlsx
Requer: Excel instalado + pip install pywin32 openpyxl
Sai com código 1 se encontrar #REF!, #DIV/0!, #VALUE!, #NAME?, #N/A, #NUM! ou #NULL!.
"""
import sys, os

ERROS = ("#REF!", "#DIV/0!", "#VALUE!", "#NAME?", "#N/A", "#NUM!", "#NULL!")


def recalcular(caminho: str) -> None:
    import win32com.client as win32
    excel = win32.DispatchEx("Excel.Application")
    excel.Visible = False
    excel.DisplayAlerts = False
    try:
        wb = excel.Workbooks.Open(os.path.abspath(caminho))
        excel.CalculateFullRebuild()
        wb.Save()
        wb.Close(SaveChanges=False)
    finally:
        excel.Quit()


def verificar(caminho: str) -> list:
    from openpyxl import load_workbook
    wb = load_workbook(caminho, data_only=True)
    achados = []
    for ws in wb.worksheets:
        for linha in ws.iter_rows():
            for c in linha:
                if isinstance(c.value, str) and c.value.strip() in ERROS:
                    achados.append(f"{ws.title}!{c.coordinate} = {c.value}")
    return achados


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("Uso: python recalc_excel.py arquivo.xlsx")
    arq = sys.argv[1]
    recalcular(arq)
    erros = verificar(arq)
    if erros:
        print(f"{len(erros)} erro(s) de fórmula:")
        print("\n".join(erros))
        sys.exit(1)
    print("OK: recalculado no Excel, nenhum erro de fórmula.")
