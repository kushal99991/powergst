import { Table } from "reactstrap";

//**  validate on Paste like url/HtmlTag/space/query
export const handlePasteText = (e, setError, name, messageText, type) => {
  const pastedText = (e.clipboardData || window.Clipboard).getData('text');

  const urlPattern = /<[^>]+>|(http|https|www\.)|\s|(\bselect\b\s*\*?\s*\bfrom\b|\binsertinto\b|\bupdate\b|\bdeletefrom\b)|[!@#$%^&*(),.?":{}|<>]/i;
  const passwordPattern = /<[^>]+>|(http|https|www\.)|\s|(\bselect\b\s*\*?\s*\bfrom\b|\binsertinto\b|\bupdate\b|\bdeletefrom\b)/i;
  const patternAllowSpace = /<[^>]+>|(http|https|www\.)|(\bselect\b\s*\*?\s*\bfrom\b|\binsert\s+into\b|\bupdate\b|\bdelete\s+from\b)/i;
  const patternCaptcha = /<[^>]+>|(http|https|www\.)|\s|[\w\.-]+@[\w\.-]+\.\w+|(\bselect\b\s*\*?\s*\bfrom\b|\binsert\b|\bupdate\b|\bdelete\b)/i;
  const emailPattern = /^(?![A-Za-z0-9]).*|<[^>]*>|(http|https|(\bselect\b\s*\*?\s*\bfrom\b|\binsertinto\b|\bupdate\b|\bdeletefrom\b)|www\.)|\s/;

  const typeOfValidation = type == 'allowSpace' ? patternAllowSpace : type == 'captcha' ? passwordPattern : type == 'password' ? patternCaptcha : type == 'email' ? emailPattern : urlPattern

  if (typeOfValidation.test(pastedText)) {
    e.preventDefault();
    setError(name, { type: 'manual', message: `Please enter a valid Copy/Paste value to ${messageText}.` });
  }
  else {
    setError(name, { type: 'manual', message: '' });
  }
};


//**  Email Validation
export const handleKeyPressText = (e, setError, name) => {
  const value = e.target.value + e.key;
  const invalidPattern = /^(?![A-Za-z0-9]).*|<[^>]*>|(http|https|(\bselect\b\s*\*?\s*\bfrom\b|\binsertinto\b|\bupdate\b|\bdeletefrom\b)|www\.)|\s/;

  if (invalidPattern.test(value)) {
    e.preventDefault();
    setError(name, { type: 'manual', message: 'Please enter a valid email.' });
    return;
  } else {
    setError(name, { type: 'manual', message: '' });
  }

};


//**  validate on-keyPress like url/HtmlTag/space/query (Password/userName)
export const handleKeyPressPass = (e, setError, name, messageText, type) => {
  const value = e.target.value + e.key;

  const invalidPattern = /<[^>]+>|(http|https|www\.)|\s|(\bselect\b\s*\*?\s*\bfrom\b|\binsertinto\b|\bupdate\b|\bdeletefrom\b)|[!@#$%^&*(),.?":{}|<>]/i;
  const invalidPasswordPattern = /<[^>]+>|(http|https|www\.)|\s|(\bselect\b\s*\*?\s*\bfrom\b|\binsertinto\b|\bupdate\b|\bdeletefrom\b)/i;
  const patternAllowSpace = /<[^>]+>|(http|https|www\.)|(\bselect\b\s*\*?\s*\bfrom\b|\binsert\s+into\b|\bupdate\b|\bdelete\s+from\b)/i;
  const patternCaptcha = /<[^>]+>|(http|https|www\.)|\s|[\w\.-]+@[\w\.-]+\.\w+|(\bselect\b\s*\*?\s*\bfrom\b|\binsert\b|\bupdate\b|\bdelete\b)/i;


  const typeOfValidation = type == 'allowSpace' ?  patternAllowSpace : type == 'captcha' ? invalidPasswordPattern : type == 'password' ? patternCaptcha : invalidPattern

  if (typeOfValidation.test(value)) {
    e.preventDefault();
    setError(name, { type: 'manual', message: `Please enter a valid ${messageText}.` });
    return;
  } else {
    setError(name, { type: 'manual', message: '' });
  }

};


export const handleValidateExcel = /<[^>]+>|(http|https|www\.)|(\bselect\b\s*\*?\s*\bfrom\b|\binsert\s+into\b|\bupdate\b|\bdelete\s+from\b)/i;

export const validationErrorMessage = (value) => {
  return `You Can't Use Reserve Word Like:- ${value}`;
}
export function ErrorTable({ errorDataList }) {
 
  const itemList =
  errorDataList &&
  errorDataList.map((item, i) => (
      <tr>
        <td>{i + 1}</td>
        <td>{item.colName}</td>
        <td>{item.row + 1}</td>
        <td>{item.validationMsg}</td>
      </tr>
    ));

  return (
    <div className="errorTable_container">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Column Name</th>
            <th>Row Number</th>
            <th>Error</th>
          </tr>
        </thead>
        <tbody>{itemList}</tbody>
      </Table>
    </div>
  );
}