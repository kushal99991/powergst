// ** Third Party Components
import PropTypes from 'prop-types'

// ** Reactstrap Imports
import { Card, CardBody  } from 'reactstrap'
import { Link } from 'react-router-dom'
import  menuOpenPermission  from '@helper/menuOpenPermission'
import { urlEndpointConfig } from '@configs/urlEndpoint'
import { useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
const MySwal = withReactContent(Swal);
import withReactContent from "sweetalert2-react-content";
import { urlAccessMessage } from '@configs/config'

const StatsVertical = ({ icon, color, stats, statTitle, className , path }) => {
  const navigate = useNavigate();

  const onClickRedirect = (e , path) => {
    e.preventDefault()
    // ** Registration type wise permission menu
    let returnUrl = menuOpenPermission(path.split("?")[0])

    if (returnUrl == true) {
      navigate(urlEndpointConfig.DASHBOARD)
      Swal.fire({
        icon: "warning",
        title: "",
        text: urlAccessMessage,
        customClass: {
          confirmButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });
    } else {
      navigate(path)
    }
  }


  return (

    (<Link  to="/" onClick={(e) => onClickRedirect(e , path )} >
    <Card className='text-center'>
      <CardBody className={className}>
        <div className={`avatar p-50 m-0 mb-1 ${color ? `bg-light-${color}` : 'bg-light-primary'}`}>
          <div className='avatar-content'>{icon}</div>
        </div>
        <h4 className='fw-bolder'>{stats}</h4>
        <p className='card-text line-ellipsis'>{statTitle}</p>
      </CardBody>
    </Card>

  </Link>)  )
}

export default StatsVertical

// ** PropTypes
StatsVertical.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  stats: PropTypes.string.isRequired,
  statTitle: PropTypes.string.isRequired
}
