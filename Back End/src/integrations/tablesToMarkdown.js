function tablesToMarkdown (tables = []) {
  if (!Array.isArray(tables) || tables.length === 0) return [];

  /* --- helpers --- */
  const tableToMatrix = (tbl) => {
    const { columnCount, cells } = tbl;
    const rowCount = Math.max(0, ...cells.map(c => c.rowIndex + (c.rowSpan ?? 1)));
    const matrix = Array.from({ length: rowCount }, () => Array(columnCount).fill(""));

    for (let { rowIndex, columnIndex, rowSpan = 1, columnSpan = 1, content } of cells) {
      for (let r = 0; r < rowSpan; r++) {
        for (let c = 0; c < columnSpan; c++) {
          matrix[rowIndex + r][columnIndex + c] ||= content.replace(/\n/g, ' ').trim();
        }
      }
    }
    return matrix;
  };

  const matrixToMarkdown = (matrix) => {
    if (!matrix.length) return "";
    const lines = matrix.map(row => `| ${row.join(" | ")} |`);
    const divider = "| " + matrix[0].map(() => "---").join(" | ") + " |";
    lines.splice(1, 0, divider); // header separator
    return lines.join("\n");
  };

  /* --- build and return array of Markdown tables --- */
  return tables.map(tableToMatrix).map(matrixToMarkdown);
}

module.exports = { tablesToMarkdown };