import React, { useEffect, useState } from 'react'
import EnhancedTable from './demo'
import MeasureDropdown from './MeasureDropdown'
import VisualDropdown from './VisualDropdown'
import DimensionDropdown from './DimensionDropdown'
import { Button, IconButton, Popover, Typography } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'

const TableComponent = ({ response, formData }) => {
  // const [measureList, setMeasureList] = useState(
  //   [...new Set(response.result.map((entry) => entry.Measure))]
  // );
  // const [dimensionList, setDimensionList] = useState(
  //   [...new Set(response.result.map((entry) => entry.DimensionName))]
  // );
  // const [visualList, setVisualList] = useState(
  //   [...new Set(response.result.map((entry) => entry.VisualName))]
  //   );

  const [data, setData] = useState(response.result)

  // const [filteredData, setFilteredData] = useState([]);
  // const [MeasureName, setMeasureName] = useState("");

  // const handleMeasureSelect = (e) => {
  //   setMeasureName(e);
  //   setFilteredData(filteredData.filter((row) => row.Measure === e));
  // };

  // const [visualName, setVisualName] = useState("");
  // const handleVisualSelect = (e) => {
  //   const filtered = filteredData.filter((item) => visualName.includes(item.data));
  //   setFilteredData(filtered);
  // };

  // const [DimensionName, setDimensionName] = useState("");
  // const handleDimensionSelect = (e) => {
  //   setDimensionName(e);
  //   setFilteredData(filteredData.filter((row) => row.DimensionName === e));
  // };

  const [selectedMeasure, setSelectedMeasure] = useState('')
  const [selectedDimension, setSelectedDimension] = useState('')
  const [selectedReport, setSelectedReport] = useState('')
  const [selectedVisual, setSelectedVisual] = useState('')
  const [selectedPage, setSelectedPage] = useState('')
  const [filteredData, setFilteredData] = useState(data)

  const measures = [...new Set(response.result.map(item => item.Measure))]
  const dimensions = [
    ...new Set(response.result.map(item => item.DimensionName))
  ]
  const reports = [...new Set(response.result.map(item => item.ReportName))]
  const visuals = [...new Set(response.result.map(item => item.VisualName))]
  const pages = [...new Set(response.result.map(item => item.PageName))]

  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const [
    filterIsMeasureUsedInVisualCheckboxFlag,
    setFilterIsMeasureUsedInVisualCheckboxFlag
  ] = useState(false)

  const [filterdimensionCheckboxFlag, setFilterdimensionCheckboxFlag] =
    useState(false)

  function filterTableData(
    measure,
    dimension,
    report,
    visual,
    page,
    filterIsMeasureUsedInVisualCheckboxFlag,
    filterdimensionCheckboxFlag
  ) {
    const filtered = data.filter(item => {
      return (
        (measure === '' || item.Measure === measure) &&
        (dimension === '' || item.DimensionName === dimension) &&
        (report === '' || item.ReportName === report) &&
        (visual === '' || item.VisualName === visual) &&
        (page === '' || item.PageName === page) &&
        (!filterIsMeasureUsedInVisualCheckboxFlag
          ? item.isMeasureUsedInVisual === '1'
          : true) 
      )
    })
    setFilteredData(filtered)
  }
  const handleIsMeasureUsedInVisualCheckboxChange = event => {
    setFilterIsMeasureUsedInVisualCheckboxFlag(event.target.checked)
    filterTableData(
      selectedMeasure,
      selectedDimension,
      selectedReport,
      selectedVisual,
      selectedPage,
      filterIsMeasureUsedInVisualCheckboxFlag,
      filterdimensionCheckboxFlag
    )
  }

  const handledimensionCheckboxChange = event => {
    setFilterdimensionCheckboxFlag(event.target.checked)
    // filterTableData(
    //   selectedMeasure,
    //   selectedDimension,
    //   selectedReport,
    //   selectedVisual,
    //   selectedPage,
    //   filterIsMeasureUsedInVisualCheckboxFlag,
    //   filterdimensionCheckboxFlag
    // )

    setFilteredData(data.filter(item => {
      return (
        (!filterdimensionCheckboxFlag ? item.hasDimension === "1" : true)
      )
    }))
  }

  function handleMeasureChange(event) {
    setSelectedMeasure(event.target.value)
    filterTableData(
      event.target.value,
      selectedDimension,
      selectedReport,
      selectedVisual,
      selectedPage,
      filterIsMeasureUsedInVisualCheckboxFlag,
      filterdimensionCheckboxFlag
    )
  }

  function handleDimensionChange(event) {
    setSelectedDimension(event.target.value)
    filterTableData(
      selectedMeasure,
      event.target.value,
      selectedReport,
      selectedVisual,
      selectedPage,
      filterIsMeasureUsedInVisualCheckboxFlag,
      filterdimensionCheckboxFlag
    )
  }

  function handleReportChange(event) {
    setSelectedReport(event.target.value)
    filterTableData(
      selectedMeasure,
      selectedDimension,
      event.target.value,
      selectedVisual,
      selectedPage,
      filterIsMeasureUsedInVisualCheckboxFlag,
      filterdimensionCheckboxFlag
    )
  }

  function handleVisualChange(event) {
    setSelectedVisual(event.target.value)
    filterTableData(
      selectedMeasure,
      selectedDimension,
      selectedReport,
      event.target.value,
      selectedPage,
      filterIsMeasureUsedInVisualCheckboxFlag,
      filterdimensionCheckboxFlag
    )
  }

  function handlePageChange(event) {
    setSelectedPage(event.target.value)
    filterTableData(
      selectedMeasure,
      selectedDimension,
      selectedReport,
      selectedVisual,
      event.target.value,
      filterIsMeasureUsedInVisualCheckboxFlag,
      filterdimensionCheckboxFlag
    )
  }

  function makeAPICall(url, requestBody) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        setData(JSON.parse(data).result)
        console.log(JSON.parse(data).result)
      })
      .catch(error => {
        console.error('API Error:', error)
        throw error
      })
  }

  // Function to make multiple API calls concurrently in batches
  const apiUrl = 'http://127.0.0.1:3002/firequery'

  const requestbody = {
    result: response.result,
    connection_string: response.connection_string,
    threshold_time: formData.thresholdValue
  }

  useEffect(() => {
    makeAPICall(apiUrl, requestbody)
  }, [])

  return (
    <div class="mt-5">
      <div class="dropdowns p-10">
        {/* <div class="dropdown px-5 ">
           <select value={filter.value} onChange={handleFilterChange}>
            {
              visualList.map((ele) =>{
                return(
                  <option value ={ele}>
                    {ele}
                  </option>
                )
              })
            }
          </select>
        </div>
        <div class="dropdown px-5">
            <MeasureDropdown
              names={measureList}
              handleMeasureSelect={handleMeasureSelect}
            />
        </div>
        <div class="dropdown px-5">
          <DimensionDropdown
            names={dimensionList}
            handleDimensionSelect={handleDimensionSelect}
          />
        </div> */}
        <select
          value={selectedMeasure}
          onChange={handleMeasureChange}
          className="mx-2"
        >
          <option value="">Measures</option>
          {measures.map((measure, index) => (
            <option key={index} value={measure}>
              {measure}
            </option>
          ))}
        </select>

        <select
          value={selectedDimension}
          onChange={handleDimensionChange}
          className="mx-2"
        >
          <option value="">Dimensions</option>
          {dimensions.map((dimension, index) => (
            <option key={index} value={dimension}>
              {dimension}
            </option>
          ))}
        </select>

        <select
          value={selectedReport}
          onChange={handleReportChange}
          className="mx-2"
        >
          <option value="">Reports</option>
          {reports.map((report, index) => (
            <option key={index} value={report}>
              {report}
            </option>
          ))}
        </select>

        <select
          value={selectedPage}
          onChange={handlePageChange}
          className="mx-2"
        >
          <option value="">Pages</option>
          {pages.map((page, index) => (
            <option key={index} value={page}>
              {page}
            </option>
          ))}
        </select>

        <select
          value={selectedVisual}
          onChange={handleVisualChange}
          className="mx-2"
        >
          <option value="">Visuals</option>
          {visuals.map((visual, index) => (
            <option key={index} value={visual}>
              {visual}
            </option>
          ))}
        </select>
        <Button
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
          className="mx-2"
        >
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Button>
        <Popover
          id={id}
          style={{ display: 'flex', flexDirection: 'row' }}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
        >
          <Typography sx={{ p: 2 }}>
            {' '}
            <label>
              <input
                type="checkbox"
                checked={filterIsMeasureUsedInVisualCheckboxFlag}
                onChange={handleIsMeasureUsedInVisualCheckboxChange}
              />
              Is Measure Used In Visual
            </label>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <label>
              <input
                type="checkbox"
                checked={filterdimensionCheckboxFlag}
                onChange={handledimensionCheckboxChange}
              />
              Measure With Dimensions
            </label>
          </Typography>
        </Popover>
      </div>
      <div class="cards">
        <div class="carD px-5">
          <div class="card total_measures">
            <div class="card-body">
              <h3 class="card-title mb-auto">{response.result.length}</h3>
              <h4 class="card-text">
                {' '}
                <b>Total Measure Combination</b>{' '}
              </h4>
            </div>
          </div>
        </div>

        <div class="carD px-5">
          <div class="card combinations_below_threshold">
            <div class="card-body">
              <h3 class="card-title mb-auto">
                {
                  response.result
                    .map(entry => entry.LoadTime)
                    .filter(e => e < formData.thresholdValue).length
                }
              </h3>
              <h4 class="card-text">
                {' '}
                <b>Combinations below threshold</b>{' '}
              </h4>
            </div>
          </div>
        </div>
        <div class="carD px-5">
          <div class="card combinations_above_threshold">
            <div class="card-body">
              <h3 class="card-title mb-auto">
                {
                  response.result
                    .map(entry => entry.LoadTime)
                    .filter(e => e === formData.thresholdValue).length
                }
              </h3>
              <h4 class="card-text">
                {' '}
                <b>Combinations above threshold</b>{' '}
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div class="table mt-3" style={{ overflowY: 'auto', height: '67vh' }}>
        <EnhancedTable
          rows={filteredData}
          thresholdValue={formData.thresholdValue}
          connection_string={response.connection_string}
          filterIsMeasureUsedInVisualCheckboxFlag={filterIsMeasureUsedInVisualCheckboxFlag}
          filterdimensionCheckboxFlag={filterdimensionCheckboxFlag}
        />
      </div>
    </div>
  )
}

export default TableComponent
