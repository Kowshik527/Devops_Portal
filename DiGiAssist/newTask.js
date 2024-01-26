import ExcelJS from 'exceljs';
import fs from 'fs/promises';

const writeToExcel= async(email) => {
    const filePath = 'output.xlsx';
    try {
        let workbook;
        try {
            const existingBuffer = await fs.readFile(filePath);
            workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(existingBuffer);
        } catch (readError) {
            workbook = new ExcelJS.Workbook();
        }
        const sheet = workbook.getWorksheet(1) || workbook.addWorksheet('Sheet 1');
        const emptyRow = sheet.actualRowCount + 1;
        sheet.getCell(emptyRow, 1).value = email;
        await workbook.xlsx.writeFile(filePath);
    } catch (writeError) {
        throw writeError;
    }
}

export default writeToExcel