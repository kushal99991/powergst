export const showTotalRowPerPage = (rowPage, pageSelectSize , totalRowsCount ) => {

    const firstResult = rowPage * pageSelectSize + 1;
    const lastResult = Math.min(rowPage * pageSelectSize + pageSelectSize, totalRowsCount);
     return  `${firstResult}-${lastResult} of ${totalRowsCount}`
  }
