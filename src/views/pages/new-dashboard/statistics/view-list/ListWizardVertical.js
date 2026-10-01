// ** React Imports
import { useEffect, useRef, useState } from "react";

// ** Custom Components
import Wizard from "@components/wizard";
// ** Icons Imports
import { FileText, User, MapPin, Link } from "react-feather";
import GSTReturnDetail from "./steps/listDetail";
import {
  GSTRRlistData,
  ReportslistData,
  DownloadAllDataList,
  RecolistData,
} from "./list-data";

const ListWizardVertical = () => {
  // ** Ref
  const wizardRef = useRef(null);
  let type = null
  // ** State
  const [stepper, setStepper] = useState(null);
  const [wizardBtn, setWizardBtn] = useState(0);

  wizardRef?.current?.addEventListener("shown.bs-stepper", function (event) {
    setWizardBtn(event?.detail?.indexStep);
  });

  useEffect(() => {

    if (window.location.pathname == "/reports") {
      stepper !== null && stepper.to(3);
    } else if (window.location.pathname == "/gst-returns") {
        stepper !== null && stepper.to(0);
    } else if (window.location.pathname == "/download-gstin") {
      stepper !== null && stepper.to(4);
    } else if (window.location.pathname == "/reconcilation") {
      stepper !== null && stepper.to(2);
    } else {
        stepper !== null && stepper.to(1);
    }

  }, [stepper ]);


  const steps = [
    {
      id: "return-details",
      title: "GST Return",
      icon: <FileText size={18} />,
      content: (
        <GSTReturnDetail
          stepper={stepper}
          displayData={GSTRRlistData}
          displayTitle={"GST Return"}
          wizardBtn={wizardBtn}
          type={''}
        ></GSTReturnDetail>
      ),
    },
    {
      id: "reco-details",
      title: "Reconciliation",
      icon: <FileText size={18} />,
      content: (
        <GSTReturnDetail
          stepper={stepper}
          displayData={RecolistData}
          displayTitle={"Reconciliation"}
          wizardBtn={wizardBtn}
          type={'reco'}
        ></GSTReturnDetail>
      ),
    },
    {
      id: "reports-details",
      title: "Reports",
      icon: <FileText size={18} />,
      content: (
        <GSTReturnDetail
          stepper={stepper}
          displayData={ReportslistData}
          displayTitle={"Reports"}
          wizardBtn={wizardBtn}
          type={'reports'}
        ></GSTReturnDetail>
      ),
    },

    {
      id: "download-details",
      title: "Download All",
      icon: <FileText size={18} />,
      content: (
        <GSTReturnDetail
          stepper={stepper}
          displayData={DownloadAllDataList}
          displayTitle={"Download All"}
          wizardBtn={wizardBtn}
          type={''}
        ></GSTReturnDetail>
      ),
    },
  ];

  return (
    <div className="vertical-wizard">
      <Wizard
        type="vertical"
        ref={wizardRef}
        steps={steps}
        options={{
          linear: false,

        }}
        instance={(el) => setStepper(el)}
      />
    </div>
  );
};

export default ListWizardVertical;
