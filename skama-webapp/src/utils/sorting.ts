import type { ISalesByProductDto } from '../types';

const textCollator = new Intl.Collator('es', {
  sensitivity: 'base',
  numeric: true,
});

export function compareText(left: string, right: string): number {
  return textCollator.compare(left.trim(), right.trim());
}

export function sortByText<T>(items: T[], selector: (item: T) => string): T[] {
  return [...items].sort((left, right) => compareText(selector(left), selector(right)));
}

export function sortSalesRows(items: ISalesByProductDto[]): ISalesByProductDto[] {
  return [...items].sort((left, right) => {
    const salesDifference = right.totalSales - left.totalSales;
    if (salesDifference !== 0) {
      return salesDifference;
    }

    const quantityDifference = right.totalQuantitySold - left.totalQuantitySold;
    if (quantityDifference !== 0) {
      return quantityDifference;
    }

    const orderDifference = right.orderCount - left.orderCount;
    if (orderDifference !== 0) {
      return orderDifference;
    }

    return (
      compareText(left.productName, right.productName) ||
      compareText(left.customerEmail, right.customerEmail)
    );
  });
}
