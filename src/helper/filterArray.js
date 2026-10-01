import moment from "moment";


//Don't remove this commented code
// Use Of This Code Date Selection Is Perfectly Working On Chrome Browser But In Firefox Is Not Working

//  export const filterCurrentDate = (arrayValue, singleDate) =>
//   {
//         const frDataFilter = arrayValue?.filter((item) =>  new Date(singleDate)  > new Date(item.label));
//         return frDataFilter;
//   }


// 30-04-2024 Use Of This Code Date Selection Is Perfectly Working On Chrome Browser And FireFox 
 export const filterCurrentDate = (arrayValue) =>
  {
        const frDataFilter = arrayValue?.filter((item) => new Date(item.label));
        return frDataFilter;
  }


  export const filterCurrentMonthWise = (arrayValue, singleDate) =>
  {

        var month = moment(singleDate).format("MM");
        // Determine the start and end months of the financial year
        let startMonth, endMonth;

        startMonth = 4;  // April of previous year
        endMonth =  parseInt(month);    // March of current year

        // Filter the array to include months within the current financial year
        const frDataFilter = arrayValue.filter((item) => {
            const itemMonth = parseInt(item.value);
            if (parseInt(startMonth) <= parseInt(endMonth)) {
                return itemMonth >= parseInt(startMonth) && itemMonth <= parseInt(endMonth);
            } else {
                return itemMonth >= parseInt(startMonth) || itemMonth <= parseInt(endMonth);
            }
        });
        return frDataFilter;
  }


export const  compareDates =(givenDate, serverDate) =>  {
  const givenMonth = parseInt(givenDate.substr(0, 2), 10);
  const givenYear = parseInt(givenDate.substr(2), 10);

  const serverMonth = parseInt(serverDate.substr(0, 2), 10);
  const serverYear = parseInt(serverDate.substr(2), 10);

  if (givenYear > serverYear) {
    return true;
  } else if (givenYear === serverYear && givenMonth > serverMonth) {
    return true;
  } else {
    return false;
  }
}


export const  monthDiff = (d1, d2) => {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  // edit: increment months if d2 comes later in its month than d1 in its month
  if (d2.getDate() >= d1.getDate())
      months++
  // end edit
  return months <= 0 ? 0 : months;
}
