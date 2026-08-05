import { parseCellItems } from '@/lib/cdmm-import';

describe('parseCellItems 单元格清洗', () => {
  it('按 ◆ 拆分多条', () => {
    expect(parseCellItems('◆能抬头\n◆ 能翻身')).toEqual(['能抬头', '能翻身']);
  });
  it('去除空项与首尾空白', () => {
    expect(parseCellItems('◆能抬头 ◆\n◆ 能翻身 ')).toEqual(['能抬头', '能翻身']);
  });
  it('清洗多余换行与连续空格', () => {
    expect(parseCellItems('◆能抬头\r\n◆能翻身　测试')).toEqual(['能抬头', '能翻身 测试']);
  });
  it('过滤纯括号注释项（如（9~10月龄））', () => {
    expect(parseCellItems('（9~10月龄）◆有支撑时腿部无法承重')).toEqual(['有支撑时腿部无法承重']);
  });
});
