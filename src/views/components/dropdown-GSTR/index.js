import { Fragment } from "react"
import DropDownGSTRSplit from "./dropdownGSTR"

const DropDownListGSTR = ({ item, clientId, finYear, finMonth,loadFunction , isLoading , token , subscriptionId ,GstIn, userId }) => {
    return (
        <Fragment>
            <DropDownGSTRSplit item={item} loadFunction={loadFunction}  clientId={clientId} finYear={finYear} finMonth={finMonth} isLoading={isLoading} token={token} subscriptionId={subscriptionId} GstIn={GstIn} userId={userId} ></DropDownGSTRSplit>
        </Fragment>
    )
}

export default DropDownListGSTR