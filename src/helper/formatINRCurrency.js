export const formatINR = (x) => {
    if (x !== null && x !== "" )
    return x.toLocaleString("en-IN", { minimumFractionDigits: 2 });
  }


  export const formatINRWithoutDecimal =(x) => {
    if (x !== null && x !== "" )
    return x.toLocaleString("en-IN");
  }
