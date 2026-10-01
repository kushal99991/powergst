// ** React Imports
import { useState, useEffect } from 'react'

import DataTable from 'react-data-table-component'
import {
    ChevronDown
} from 'react-feather'
import ReactPaginate from 'react-paginate'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardText, CardBody, Button } from 'reactstrap'

const DatatableData = ({fetchData , fetchColumn  }) => {
  // ** State
  const [block, setBlock] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    return () => setBlock(false)
  }, [])

   // ** Function to handle Pagination
   const handlePagination = page => {
    setCurrentPage(page.selected)
  }

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      nextLabel=''
      breakLabel='...'
      previousLabel=''
      pageRangeDisplayed={2}
      forcePage={currentPage}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      pageCount={Math.ceil(fetchData.length / 7) || 1}
      onPageChange={page => handlePagination(page)}
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
    />
  )

  return (
    <div className='react-dataTable'>
    <DataTable
        fixedHeader
        // pagination
        data={fetchData}
        columns={fetchColumn}
        className='react-dataTable'
        sortIcon={<ChevronDown size={10} />}
        // paginationComponent={CustomPagination}
        // paginationDefaultPage={currentPage + 1}
        highlightOnHover
        pointerOnHover
    />
</div>
  )
}

export default DatatableData
