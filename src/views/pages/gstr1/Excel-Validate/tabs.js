// ** Reactstrap Imports
import { Button, Col, Nav, NavItem, NavLink, Row } from "reactstrap";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { globleVariable } from "../../../../configs/globalVariable";
import SessionFunction from "../../../../configs/getSessionFunction";

const Tabs = ({ activeTab, toggleTab, data, btnType }) => {
  const [b2b, setb2b] = useState(0);
  const [b2ba, setb2ba] = useState(0);
  const [b2cl, setb2cl] = useState(0);
  const [b2cla, setb2cla] = useState(0);
  const [b2cs, setb2cs] = useState(0);
  const [cdnr, setcdnr] = useState(0);
  const [cdnur, setcdnur] = useState(0);
  const [at, setat] = useState(0);
  const [atadj, setatadj] = useState(0);
  const [exemp, setexemp] = useState(0);
  const [hsnsum, sethsnsum] = useState(0);
  const [cdnra, setcdnra] = useState(0); //11
  const [cdnura, setcdnura] = useState(0); //12
  const [ata, setata] = useState(0); //13
  const [atadja, setatadja] = useState(0); //14
  const [exp, setexp] = useState(0); //15
  const [expa, setexpa] = useState(0); //16
  const [docs, setdocs] = useState(0); //17
  const [b2csa, setb2csa] = useState(0); //18

  const Flag = SessionFunction.getSessionValue(globleVariable.f_g1, true);
  const countValidate = sessionStorage.getItem(globleVariable.cv_g1);
  let D_SHEET;
  let P_SHEET;
  let F_SHEET;
  try {
    D_SHEET = SessionFunction.getSessionValue(globleVariable.ds_g1, true);
    P_SHEET = SessionFunction.getSessionValue(globleVariable.ps_g1, true);
    F_SHEET = SessionFunction.getSessionValue(globleVariable.fs_g1, true);
  } catch (error) {
    D_SHEET = null;
    P_SHEET = null;
    F_SHEET = null;
  }

  const location = useLocation();
  let ImportData = null;
  if (location.state !== null) {
    ImportData =
      location.state.importData !== null ? location.state.importData : null;
  }

  const ddata = D_SHEET != "undefined" ? D_SHEET : [];
  const pdata = P_SHEET != "undefined" ? P_SHEET : [];
  const fdata = F_SHEET != "undefined" ? F_SHEET : [];

  let sheetRow = [];

  const sheetData = (i) => {
    const failedIndex = data?.findIndex(
      (item) => item?.sheetName?.toLowerCase() == i
    );

    sheetRow = data?.[failedIndex];
    return data?.[failedIndex];
  };

  const sheetDataFail = (i) => {
    if (fdata?.length > 0) {
      const failedIndex = fdata?.findIndex(
        (item) => item?.sheetName?.toLowerCase() == i
      );

      return pdata?.[failedIndex];
    }
  };

  const sheetDataPass = (i) => {
    if (pdata?.length > 0) {
      const failedIndex = pdata?.findIndex(
        (item) => item?.sheetName?.toLowerCase() == i
      );

      return fdata?.[failedIndex];
    }
  };

  const sheetDataDuplicate = (i) => {
    if (ddata?.length > 0) {
      const failedIndex = ddata?.findIndex(
        (item) => item?.sheetName?.toLowerCase() == i
      );

      return ddata?.[failedIndex];
    }
  };

  useEffect(() => {
    if (ImportData !== null && Flag == "true") {

      if (btnType == "btnInvalidData") {
        setb2b(sheetData("b2b")?.failed);
        setb2ba(sheetData("b2ba")?.failed);
        setb2cl(sheetData("b2cl")?.failed);
        setb2cla(sheetData("b2cla")?.failed);
        setcdnr(sheetData("cdnr")?.failed);
        setcdnur(sheetData("cdnur")?.failed);
        setat(sheetData("at")?.failed);
        setatadj(sheetData("atadj")?.failed);
        setexemp(sheetData("exemp")?.failed);
        setb2cs(sheetData("b2cs")?.failed);

        setcdnra(sheetData("cdnra")?.failed);
        setcdnura(sheetData("cdnura")?.failed);
        setata(sheetData("ata")?.failed);
        setatadja(sheetData("atadja")?.failed);
        setexp(sheetData("exp")?.failed);
        setexpa(sheetData("expa")?.failed);
        setdocs(sheetData("docs")?.failed);
        setb2csa(sheetData("b2csa")?.failed);

        sethsnsum(sheetData("hsn")?.failed);

        if (sheetData("b2b")?.failed > 0) {
          toggleTab("1");
        } else if (sheetData("b2ba")?.failed > 0) {
          toggleTab("0");
        } else if (sheetData("b2cl")?.failed > 0) {
          toggleTab("2");
        } else if (sheetData("b2cla")?.failed > 0) {
          toggleTab("3");
        } else if (sheetData("cdnr")?.failed > 0) {
          toggleTab("4");
        } else if (sheetData("cdnur")?.failed > 0) {
          toggleTab("5");
        } else if (sheetData("at")?.failed > 0) {
          toggleTab("6");
        } else if (sheetData("atadj")?.failed > 0) {
          toggleTab("7");
        } else if (sheetData("exemp")?.failed > 0) {
          toggleTab("8");
        } else if (sheetData("b2cs")?.failed > 0) {
          toggleTab("9");
        } else if (sheetData("cdnra")?.failed > 0) {
          toggleTab("11");
        } else if (sheetData("cdnura")?.failed > 0) {
          toggleTab("12");
        } else if (sheetData("ata")?.failed > 0) {
          toggleTab("13");
        } else if (sheetData("atadja")?.failed > 0) {
          toggleTab("14");
        } else if (sheetData("exp")?.failed > 0) {
          toggleTab("15");
        } else if (sheetData("expa")?.failed > 0) {
          toggleTab("16");
        } else if (sheetData("docs")?.failed > 0) {
          toggleTab("17");
        } else if (sheetData("b2csa")?.failed > 0) {
          toggleTab("18");
        } else if (sheetData("hsn")?.failed > 0) {
          toggleTab("10");
        } else {
          toggleTab("0");
        }
      } else if (btnType == "btnValidData") {
        setb2b(sheetData("b2b")?.pass);
        setb2ba(sheetData("b2ba")?.pass);
        setb2cl(sheetData("b2cl")?.pass);
        setb2cla(sheetData("b2cla")?.pass);
        setcdnr(sheetData("cdnr")?.pass);
        setcdnur(sheetData("cdnur")?.pass);
        setat(sheetData("at")?.pass);
        setatadj(sheetData("atadj")?.pass);
        setexemp(sheetData("exemp")?.pass);
        setb2cs(sheetData("b2cs")?.pass);

        setcdnra(sheetData("cdnra")?.pass);
        setcdnura(sheetData("cdnura")?.pass);
        setata(sheetData("ata")?.pass);
        setatadja(sheetData("atadja")?.pass);
        setexp(sheetData("exp")?.pass);
        setexpa(sheetData("expa")?.pass);
        setdocs(sheetData("docs")?.pass);
        setb2csa(sheetData("b2csa")?.pass);

        sethsnsum(sheetData("hsn")?.pass);

        if (sheetData("b2b")?.pass > 0) {
          toggleTab("1");
        } else if (sheetData("b2ba")?.pass > 0) {
          toggleTab("0");
        } else if (sheetData("b2cl")?.pass > 0) {
          toggleTab("2");
        } else if (sheetData("b2cla")?.pass > 0) {
          toggleTab("3");
        } else if (sheetData("cdnr")?.pass > 0) {
          toggleTab("4");
        } else if (sheetData("cdnur")?.pass > 0) {
          toggleTab("5");
        } else if (sheetData("at")?.pass > 0) {
          toggleTab("6");
        } else if (sheetData("atadj")?.pass > 0) {
          toggleTab("7");
        } else if (sheetData("exemp")?.pass > 0) {
          toggleTab("8");
        } else if (sheetData("b2cs")?.pass > 0) {
          toggleTab("9");
        } else if (sheetData("cdnra")?.pass > 0) {
          toggleTab("11");
        } else if (sheetData("cdnura")?.pass > 0) {
          toggleTab("12");
        } else if (sheetData("ata")?.pass > 0) {
          toggleTab("13");
        } else if (sheetData("atadja")?.pass > 0) {
          toggleTab("14");
        } else if (sheetData("exp")?.pass > 0) {
          toggleTab("15");
        } else if (sheetData("expa")?.pass > 0) {
          toggleTab("16");
        } else if (sheetData("docs")?.pass > 0) {
          toggleTab("17");
        } else if (sheetData("b2csa")?.pass > 0) {
          toggleTab("18");
        } else if (sheetData("hsn")?.pass > 0) {
          toggleTab("10");
        } else {
          toggleTab("0");
        }
      } else {
        setb2b(sheetData("b2b")?.duplicate);
        setb2ba(sheetData("b2ba")?.duplicate);
        setb2cl(sheetData("b2cl")?.duplicate);
        setb2cla(sheetData("b2cla")?.duplicate);
        setcdnr(sheetData("cdnr")?.duplicate);
        setcdnur(sheetData("cdnur")?.duplicate);
        setat(sheetData("at")?.duplicate);
        setatadj(sheetData("atadj")?.duplicate);
        setexemp(sheetData("exemp")?.duplicate);
        setb2cs(sheetData("b2cs")?.duplicate);
        setcdnra(sheetData("cdnra")?.duplicate);
        setcdnura(sheetData("cdnura")?.duplicate);
        setata(sheetData("ata")?.duplicate);
        setatadja(sheetData("atadja")?.duplicate);
        setexp(sheetData("exp")?.duplicate);
        setexpa(sheetData("expa")?.duplicate);
        setdocs(sheetData("docs")?.duplicate);
        setb2csa(sheetData("b2csa")?.duplicate);
        sethsnsum(sheetData("hsn")?.duplicate);

        if (sheetData("b2b")?.duplicate > 0) {
          toggleTab("0");
        } else if (sheetData("b2ba")?.duplicate > 0) {
          toggleTab("1");
        } else if (sheetData("b2cl")?.duplicate > 0) {
          toggleTab("2");
        } else if (sheetData("b2cla")?.duplicate > 0) {
          toggleTab("3");
        } else if (sheetData("cdnr")?.duplicate > 0) {
          toggleTab("4");
        } else if (sheetData("cdnur")?.duplicate > 0) {
          toggleTab("5");
        } else if (sheetData("at")?.duplicate > 0) {
          toggleTab("6");
        } else if (sheetData("atadj")?.duplicate > 0) {
          toggleTab("7");
        } else if (sheetData("exemp")?.duplicate > 0) {
          toggleTab("8");
        } else if (sheetData("b2cs")?.duplicate > 0) {
          toggleTab("9");
        } else if (sheetData("cdnra")?.duplicate > 0) {
          toggleTab("11");
        } else if (sheetData("cdnura")?.duplicate > 0) {
          toggleTab("12");
        } else if (sheetData("ata")?.duplicate > 0) {
          toggleTab("13");
        } else if (sheetData("atadja")?.duplicate > 0) {
          toggleTab("14");
        } else if (sheetData("exp")?.duplicate > 0) {
          toggleTab("15");
        } else if (sheetData("expa")?.duplicate > 0) {
          toggleTab("16");
        } else if (sheetData("docs")?.duplicate > 0) {
          toggleTab("17");
        } else if (sheetData("b2csa")?.duplicate > 0) {
          toggleTab("18");
        } else if (sheetData("hsn")?.duplicate > 0) {
          toggleTab("10");
        } else {
          toggleTab("0");
        }
      }
    } else if (pdata?.length != 0) {
      if (btnType == "btnInvalidData" && fdata?.length != 0) {
        setb2b(sheetDataFail("b2b")?.count);
        setb2ba(sheetDataFail("b2ba")?.count);
        setb2cl(sheetDataFail("b2cl")?.count);
        setb2cla(sheetDataFail("b2cla")?.count);
        setcdnr(sheetDataFail("cdnr")?.count);
        setcdnur(sheetDataFail("cdnur")?.count);
        setat(sheetDataFail("at")?.count);
        setatadj(sheetDataFail("atadj")?.count);
        setexemp(sheetDataFail("exemp")?.count);
        setb2cs(sheetDataFail("b2cs")?.count);

        setcdnra(sheetDataFail("cdnra")?.count);
        setcdnura(sheetDataFail("cdnura")?.count);
        setata(sheetDataFail("ata")?.count);
        setatadja(sheetDataFail("atadja")?.count);
        setexp(sheetDataFail("exp")?.count);
        setexpa(sheetDataFail("expa")?.count);
        setdocs(sheetDataFail("docs")?.count);
        setb2csa(sheetDataFail("b2csa")?.count);

        sethsnsum(sheetDataFail("hsn")?.count);
        // debugger
        if (countValidate != "noChange") {
          // debugger
          if (sheetDataFail("b2b")?.count > 0) {
            toggleTab("0");
          } else if (sheetDataFail("b2ba")?.count > 0) {
            toggleTab("1");
          } else if (sheetDataFail("b2cl")?.count > 0) {
            toggleTab("2");
          } else if (sheetDataFail("b2cla")?.count > 0) {
            toggleTab("3");
          } else if (sheetDataFail("cdnr")?.count > 0) {
            toggleTab("4");
          } else if (sheetDataFail("cdnur")?.count > 0) {
            toggleTab("5");
          } else if (sheetDataFail("at")?.count > 0) {
            toggleTab("6");
          } else if (sheetDataFail("atadj")?.count > 0) {
            toggleTab("7");
          } else if (sheetDataFail("exemp")?.count > 0) {
            toggleTab("8");
          } else if (sheetDataFail("b2cs")?.count > 0) {
            toggleTab("9");
          } else if (sheetDataFail("cdnra")?.count > 0) {
            toggleTab("11");
          } else if (sheetDataFail("cdnura")?.count > 0) {
            toggleTab("12");
          } else if (sheetDataFail("ata")?.count > 0) {
            toggleTab("13");
          } else if (sheetDataFail("atadja")?.count > 0) {
            toggleTab("14");
          } else if (sheetDataFail("exp")?.count > 0) {
            toggleTab("15");
          } else if (sheetDataFail("expa")?.count > 0) {
            toggleTab("16");
          } else if (sheetDataFail("docs")?.count > 0) {
            toggleTab("17");
          } else if (sheetDataFail("b2csa")?.count > 0) {
            toggleTab("18");
          } else if (sheetDataFail("hsn")?.count > 0) {
            toggleTab("10");
          } else {
            toggleTab("0");
          }
        } else {
          // debugger
        }
      } else if (btnType == "btnValidData" && pdata?.length != 0) {
        setb2b(sheetDataPass("b2b")?.count);
        setb2ba(sheetDataPass("b2ba")?.count);
        setb2cl(sheetDataPass("b2cl")?.count);
        setb2cla(sheetDataPass("b2cla")?.count);
        setcdnr(sheetDataPass("cdnr")?.count);
        setcdnur(sheetDataPass("cdnur")?.count);
        setat(sheetDataPass("at")?.count);
        setatadj(sheetDataPass("atadj")?.count);
        setexemp(sheetDataPass("exemp")?.count);
        setb2cs(sheetDataPass("b2cs")?.count);

        setcdnra(sheetDataPass("cdnra")?.count);
        setcdnura(sheetDataPass("cdnura")?.count);
        setata(sheetDataPass("ata")?.count);
        setatadja(sheetDataPass("atadja")?.count);
        setexp(sheetDataPass("exp")?.count);
        setexpa(sheetDataPass("expa")?.count);
        setdocs(sheetDataPass("docs")?.count);
        setb2csa(sheetDataPass("b2csa")?.count);
        sethsnsum(sheetDataPass("hsn")?.count);

        if (countValidate != "noChange") {
          if (sheetDataPass("b2b")?.count > 0) {
            toggleTab("0");
          } else if (sheetDataPass("b2ba")?.count > 0) {
            toggleTab("1");
          } else if (sheetDataPass("b2cl")?.count > 0) {
            toggleTab("2");
          } else if (sheetDataPass("b2cla")?.count > 0) {
            toggleTab("3");
          } else if (sheetDataPass("cdnr")?.count > 0) {
            toggleTab("4");
          } else if (sheetDataPass("cdnur")?.count > 0) {
            toggleTab("5");
          } else if (sheetDataPass("at")?.count > 0) {
            toggleTab("6");
          } else if (sheetDataPass("atadj")?.count > 0) {
            toggleTab("7");
          } else if (sheetDataPass("exemp")?.count > 0) {
            toggleTab("8");
          } else if (sheetDataPass("b2cs")?.count > 0) {
            toggleTab("9");
          } else if (sheetDataPass("cdnra")?.count > 0) {
            toggleTab("11");
          } else if (sheetDataPass("cdnura")?.count > 0) {
            toggleTab("12");
          } else if (sheetDataPass("ata")?.count > 0) {
            toggleTab("13");
          } else if (sheetDataPass("atadja")?.count > 0) {
            toggleTab("14");
          } else if (sheetDataPass("exp")?.count > 0) {
            toggleTab("15");
          } else if (sheetDataPass("expa")?.count > 0) {
            toggleTab("16");
          } else if (sheetDataPass("docs")?.count > 0) {
            toggleTab("17");
          } else if (sheetDataPass("b2csa")?.count > 0) {
            toggleTab("18");
          } else if (sheetDataPass("hsn")?.count > 0) {
            toggleTab("10");
          } else {
            toggleTab("0");
          }
        } else {
        }
      } else {
        if (ddata?.length != 0) {
          setb2b(sheetDataDuplicate("b2b")?.count);
          setb2ba(sheetDataDuplicate("b2ba")?.count);
          setb2cl(sheetDataDuplicate("b2cl")?.count);
          setb2cla(sheetDataDuplicate("b2cla")?.count);
          setcdnr(sheetDataDuplicate("cdnr")?.count);
          setcdnur(sheetDataDuplicate("cdnur")?.count);
          setat(sheetDataDuplicate("at")?.count);
          setatadj(sheetDataDuplicate("atadj")?.count);
          setexemp(sheetDataDuplicate("exemp")?.count);
          setb2cs(sheetDataDuplicate("b2cs")?.count);

          setcdnra(sheetDataDuplicate("cdnra")?.count);
          setcdnura(sheetDataDuplicate("cdnura")?.count);
          setata(sheetDataDuplicate("ata")?.count);
          setatadja(sheetDataDuplicate("atadja")?.count);
          setexp(sheetDataDuplicate("exp")?.count);
          setexpa(sheetDataDuplicate("expa")?.count);
          setdocs(sheetDataDuplicate("docs")?.count);
          setb2csa(sheetDataDuplicate("b2csa")?.count);

          sethsnsum(sheetDataDuplicate("hsn")?.count);

          if (countValidate != "noChange") {
            if (sheetDataDuplicate("b2b")?.count > 0) {
              toggleTab("0");
            } else if (sheetDataDuplicate("b2ba")?.count > 0) {
              toggleTab("1");
            } else if (sheetDataDuplicate("b2cl")?.count > 0) {
              toggleTab("2");
            } else if (sheetDataDuplicate("b2cla")?.count > 0) {
              toggleTab("3");
            } else if (sheetDataDuplicate("cdnr")?.count > 0) {
              toggleTab("4");
            } else if (sheetDataDuplicate("cdnur")?.count > 0) {
              toggleTab("5");
            } else if (sheetDataDuplicate("at")?.count > 0) {
              toggleTab("6");
            } else if (sheetDataDuplicate("atadj")?.count > 0) {
              toggleTab("7");
            } else if (sheetDataDuplicate("exemp")?.count > 0) {
              toggleTab("8");
            } else if (sheetDataDuplicate("b2cs")?.count > 0) {
              toggleTab("9");
            } else if (sheetDataDuplicate("cdnra")?.count > 0) {
              toggleTab("11");
            } else if (sheetDataDuplicate("cdnura")?.count > 0) {
              toggleTab("12");
            } else if (sheetDataDuplicate("ata")?.count > 0) {
              toggleTab("13");
            } else if (sheetDataDuplicate("atadja")?.count > 0) {
              toggleTab("14");
            } else if (sheetDataDuplicate("exp")?.count > 0) {
              toggleTab("15");
            } else if (sheetDataDuplicate("expa")?.count > 0) {
              toggleTab("16");
            } else if (sheetDataDuplicate("docs")?.count > 0) {
              toggleTab("17");
            } else if (sheetDataDuplicate("b2csa")?.count > 0) {
              toggleTab("18");
            } else if (sheetDataDuplicate("hsn")?.count > 0) {
              toggleTab("10");
            } else {
              toggleTab("0");
            }
          } else {
          }
        }
      }
    }
  }, [btnType]);

  return (
    <Row>
      <Col>
        <Nav pills className="nav-pill-danger mb-2">
          <NavItem>
            <NavLink active={activeTab === "0"} onClick={() => toggleTab("1")}>
              <span className="fw-bold">B2B ({b2ba})</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active={activeTab === "1"} onClick={() => toggleTab("0")}>
              <span className="fw-bold">B2BA ({b2b})</span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink active={activeTab === "2"} onClick={() => toggleTab("2")}>
              <span className="fw-bold">B2CL ({b2cl})</span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink active={activeTab === "3"} onClick={() => toggleTab("3")}>
              <span className="fw-bold">B2CLA ({b2cla})</span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink active={activeTab === "9"} onClick={() => toggleTab("9")}>
              <span className="fw-bold">B2CS ({b2cs})</span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={activeTab === "18"}
              onClick={() => toggleTab("18")}
            >
              <span className="fw-bold">B2CSA ({b2csa})</span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink active={activeTab === "4"} onClick={() => toggleTab("11")}>
              <span className="fw-bold">CDNR ({cdnra})</span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={activeTab === "11"}
              onClick={() => toggleTab("4")}
            >
              <span className="fw-bold"> CDNRA ({cdnr}) </span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink active={activeTab === "5"} onClick={() => toggleTab("5")}>
              <span className="fw-bold"> CDNUR ({cdnur}) </span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={activeTab === "12"}
              onClick={() => toggleTab("12")}
            >
              <span className="fw-bold"> CDNURA ({cdnura}) </span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={activeTab === "15"}
              onClick={() => toggleTab("15")}
            >
              <span className="fw-bold"> EXP ({exp}) </span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={activeTab === "16"}
              onClick={() => toggleTab("16")}
            >
              <span className="fw-bold"> EXPA ({expa}) </span>
            </NavLink>
          </NavItem>

          <br />
          <br />
          <br />
          <NavItem>
            <NavLink active={activeTab === "6"} onClick={() => toggleTab("13")}>
              <span className="fw-bold"> AT ({ata}) </span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={activeTab === "13"}
              onClick={() => toggleTab("6")}
            >
              <span className="fw-bold"> ATA ({at}) </span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink active={activeTab === "7"} onClick={() => toggleTab("7")}>
              <span className="fw-bold"> ATADJ ({atadj}) </span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={activeTab === "14"}
              onClick={() => toggleTab("14")}
            >
              <span className="fw-bold"> ATADJA ({atadja}) </span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink active={activeTab === "8"} onClick={() => toggleTab("8")}>
              <span className="fw-bold"> EXEMP ({exemp}) </span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={activeTab === "10"}
              onClick={() => toggleTab("10")}
            >
              <span className="fw-bold"> HSNSUM ({hsnsum}) </span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={activeTab === "17"}
              onClick={() => toggleTab("17")}
            >
              <span className="fw-bold"> DOCS ({docs}) </span>
            </NavLink>
          </NavItem>
        </Nav>
      </Col>
    </Row>
  );
};

export default Tabs;
