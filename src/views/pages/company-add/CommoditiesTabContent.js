// ** React Imports
import { Fragment, useState } from 'react'
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom'
// ** Third Party Components
import Select from 'react-select'
import Cleave from 'cleave.js/react'
import { useForm, Controller } from 'react-hook-form'
import 'cleave.js/dist/addons/cleave-phone.us'
import DataTable from 'react-data-table-component'

// ** Reactstrap Imports
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'

// ** Utils
import { selectThemeColors } from '@utils'


const CommoditiesTabs = ({ data }) => {
  // ** Hooks
  const defaultValues = {
    lastName: '',
    firstName: ''
  }
  // data.fullName.split(' ')[0]
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  // ** States
  const [avatar, setAvatar] = useState('')
  const [fetchdata, setfetchdata] = useState([])
  const onChange = e => {
    const reader = new FileReader(),
      files = e.target.files
    reader.onload = function () {
      setAvatar(reader.result)
    }
    reader.readAsDataURL(files[0])
  }

  const onSubmit = data => {
    if (Object.values(data).every(field => field.length > 0)) {
      return null
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }

  const handleImgReset = () => {
    setAvatar('@src/assets/images/avatars/avatar-blank.png')
  }

  const Columns = [
    {
      name: 'Sr No',
      sortable: true,
      maxWidth: '20px',

    },
    {
      name: 'HSN Code',
      sortable: true,
      minWidth: '100px',
    },
    {
      name: 'Type',
      sortable: true,
      minWidth: '100px',

    },
    {
      name: 'Description',
      sortable: true,
      minWidth: '200px',

    },
    {
      name: 'Delete',
      minWidth: '50px',
    }
  ]

  return (
    <Fragment>
      <Card>

        <CardBody className='py-2 my-25'>
          <div className='content-header'>
            <h5 className='mb-0'>Commodities Details</h5>
          </div>
          <Form className='mt-2 pt-50' onSubmit={handleSubmit(onSubmit)}>

            <Row className='justify-content-end mx-0'>
              <Col className='d-flex align-items-center justify-content-end mt-1' md='4' sm='12'>
                <Label className='me-1' for='search-input'>
                  Search
                </Label>
                <Input
                  className='dataTable-filter mb-50'
                  type='text'
                  bsSize='sm'
                  id='search-input'
                // value={searchValue}
                // onChange={handleFilter}
                />
              </Col>
            </Row>
            <div className='react-dataTable'>
              <DataTable
                // data={searchValue.length ? filteredData : fetchdata}
                data={fetchdata}
                columns={Columns}
                className='react-dataTable'
              />
            </div>

          </Form>
        </CardBody>
      </Card>

    </Fragment>
  )
}

export default CommoditiesTabs
