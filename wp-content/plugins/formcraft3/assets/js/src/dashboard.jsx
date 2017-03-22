import React from 'react'
import ReactDOM from 'react-dom'
import helpers from './helpers.js'

window.lastChecked = null

/**
* Global options for the chart
*/
window.Chart = {}
Chart.defaults = {}
Chart.defaults.global = {
  animation: true,
  animationSteps: 60,
  animationEasing: 'easeOutQuart',
  pointHitDetectionRadius: 1,
  showScale: true,
  scaleOverride: false,
  scaleSteps: null,
  scaleStepWidth: null,
  scaleStartValue: null,
  scaleLineColor: 'rgba(0,0,0,.15)',
  scaleLineWidth: 1,
  scaleShowLabels: true,
  scaleLabel: '<%=value%>',
  scaleIntegersOnly: true,
  scaleBeginAtZero: false,
  scaleFontFamily: '\'Helvetica Neue\', \'Helvetica\', \'Arial\', sans-serif',
  scaleFontSize: 11,
  scaleFontStyle: 'normal',
  scaleFontColor: '#778',
  responsive: true,
  maintainAspectRatio: false,
  showTooltips: true,
  tooltipEvents: ['mousemove', 'touchstart', 'touchmove'],
  tooltipXOffset: 0,
  tooltipTemplate: '<%if (label){%><%=label%>: <%}%><%= value %>',
  multiTooltipTemplate: '<%= value %>'
}

jQuery(document).ready(function() {

  /**
  * Create File Upload List Table Elements
  */
  let FilesCover = React.createClass({
    getInitialState: function() {
      return {
        currentPage: 1,
        pages: 1,
        total: 0,
        loading: false,
        files: []
      }
    },
    refreshList: function() {
      this.setState({ loading: true })
      this.serverRequest = jQuery.getJSON(`${FC_1.ajaxurl}?action=formcraft3_get_files&page=${this.state.currentPage}`, function (result) {
        this.setState({
          pages: result.pages,
          total: result.total,
          files: result.files || [],
          loading: false
        })
      }.bind(this))
    },
    updatePage: function(newPage) {
      this.setState({ currentPage: newPage }, this.refreshList)
    },
    componentDidMount: function() {
      this.refreshList()
    },
    onTrash: function() {
      let list = []
      jQuery('.files_checked:checked').each(function() {
        list.push(jQuery(this).val())
      })
      if (list.length === 0) {
        return false
      }
      this.setState({ loading: true })
      this.serverRequest = jQuery.getJSON(`${FC_1.ajaxurl}?action=formcraft3_file_delete_admin&list=${list}`, function (result) {
        if (result.success) {
          this.refreshList()
        }
      }.bind(this))
    },
    render: function() {
      return (
        <form className='fc_modal-content' id='new_form'>
          <div className='fc_modal-header'>
            <i className='icon-upload-cloud'></i>
            <h2>File Uploads</h2>
            <button className='close fc_close' data-dismiss='fc_modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>
          </div>
          <div className='fc_modal-body'>
            <span><i id='trash-files' onClick={this.onTrash} className='icon-trash-1'></i></span>
            <div className='file_list list'>
              <div className='thead tr'>
                <span style={{ width: '8%' }}><label><input className='files_checked_parent groupCheckedParent' type='checkbox'/></label></span>
                <span style={{ width: '43%' }}>Name</span>
                <span style={{ width: '20%' }}>Type</span>
                <span style={{ width: '29%' }}>Uploaded</span>
              </div>
              <span className='no-subs-content'>
                <span>
                  No files to show
                </span>
              </span>
              <div className={`tbody loading-${this.props.loading}`}>
              {this.state.files.map((file) => {
                return (
                  <div className='tr' key={file.id}>
                    <span style={{ width: '8%' }}>
                      <label>
                      <input className='files_checked groupChecked' type='checkbox' value={file.id} name='del_files'/>
                      </label>
                    </span>
                    <span style={{ width: '43%' }}>
                      <a target='_blank' href={`${FC_1.baseurl}?formcraft3_download_file=${file.uniq_key}`}>{file.name}</a>
                    </span>
                    <span style={{ width: '20%' }}>{file.mime}</span>
                    <span style={{ width: '29%' }}>{file.created}</span>
                  </div>
                  )
              })}
              </div>
              <Pagination updatePage={this.updatePage} currentPage={this.state.currentPage} data={[this.state.pages]}/>
            </div>
          </div>
        </form>
      )
    }
  })

  /**
  * Create Submission List Table Elements
  */
  let SubmissionCover = React.createClass({
    getInitialState: function() {
      return {
        currentPage: 1,
        query: '',
        sortWhat: 'created',
        sortOrder: 'DESC',
        pages: 1,
        whichForm: 0,
        total: 0,
        loading: false,
        submissions: []
      }
    },
    componentDidMount: function() {
      this.refreshList()
    },
    refreshList: function() {
      this.setState({ loading: true })
      this.serverRequest = jQuery.getJSON(`${FC_1.ajaxurl}?action=formcraft3_get_submissions&form=${this.state.whichForm}&page=${this.state.currentPage}&query=${this.state.query}&sortWhat=${this.state.sortWhat}&sortOrder=${this.state.sortOrder}`, function (result) {
        this.setState({
          pages: result.pages,
          total: result.total,
          submissions: result.submissions || [],
          loading: false
        })
      }.bind(this))
    },
    onTrash: function() {
      let list = []
      jQuery('.subs_checked:checked').each(function() {
        list.push(jQuery(this).val())
      })
      if (list.length === 0) {
        return false
      }
      this.setState({ loading: true })
      this.serverRequest = jQuery.getJSON(`${FC_1.ajaxurl}?action=formcraft3_del_submissions&list=${list}`, function (result) {
        if (result.success) {
          this.refreshList()
        }
      }.bind(this))
    },
    onSort: function(type) {
      let order = this.state.sortOrder === 'ASC' ? 'DESC' : 'ASC'
      this.setState({ sortWhat: type, sortOrder: order }, this.refreshList)
    },
    updateSearch: function(e) {
      e.preventDefault()
      this.setState({ query: this.refs.searchInput.value }, this.refreshList)
    },
    updatePage: function(newPage) {
      this.setState({ currentPage: newPage }, this.refreshList)
    },
    onWhichFormChange: function(e) {
      this.setState({ whichForm: e.target.value }, this.refreshList)
    },
    toggleParentActive: function(e) {
      jQuery('.opt-cover .active').removeClass('active')
      e.currentTarget.className += 'active'
      jQuery(e.currentTarget).find('input').trigger('focus')
    },
    render: function() {
      return (
        <div className='large-4 column'>
          <div className='subs_options'>
            <h2>Submissions</h2>
            <span className='opt-cover'>
              <span title='Delete Selected' id='trash-subs' onClick={this.onTrash}><i className='icon-trash-1'></i></span>
              <span id='search-subs' onClick={this.toggleParentActive}>
                <form id='subs-search-form' onSubmit={this.updateSearch}><i className='icon-search'></i>
                  <input ref="searchInput" id='subs-search-input' type='text'/>
                </form>
              </span>
              <span id='export-subs' title='Export Entries' onClick={this.toggleParentActive}>
                <select id='which-form-export'>
                  {window.formsList.map((form) => {
                    return (<option value={form.id} key={form.id}>{form.name}</option>)
                  })}
                </select>
                <a href='' target='_blank'>EXPORT</a>
                <i className='icon-export'></i>
              </span>
              <span id='total-submissions'>{this.state.total}</span>
            </span>
          </div>
          <SubmissionList {...this.state} onWhichFormChange={this.onWhichFormChange} onTrash={this.onTrash} onSort={this.onSort}/>
          <Pagination updatePage={this.updatePage} currentPage={this.state.currentPage} data={[this.state.pages]}/>
        </div>
      )
    }
  })
  let SubmissionList = React.createClass({
    render: function() {
      return (
        <div className='table_list subs_list list block'>
          <div className='tr thead'>
            <span style={{ width: '10%' }}>
              <label>
                <input className='subs_checked_parent groupCheckedParent' name='subs_checked_parent' type='checkbox'/>
              </label>
            </span>
            <span style={{ width: '53%', padding: 0 }}>
              <select id='which-form' onChange={this.props.onWhichFormChange}>
                <option value='0'>All Forms</option>
                {window.formsList.map((form) => {
                  return (<option value={form.id} key={form.id}>{form.name}</option>)
                })}
              </select>
            </span>
            <span style={{ width: '36.3%', float: 'right' }} className='sortable' onClick={this.props.onSort.bind(null, 'created')}>
              Received
              {this.props.sortWhat === 'created' && this.props.sortOrder === 'ASC' ? <i className='icon-angle-up'></i> : ''}
              {this.props.sortWhat === 'created' && this.props.sortOrder === 'DESC' ? <i className='icon-angle-down'></i> : ''}
            </span>
          </div>
          <div className={`tbody loading-${this.props.loading}`}>
          {this.props.submissions.map((submission) => {
            return (
              <div className='tr' key={submission.id}>
                <label style={{ width: '10%' }}>
                  <input value={submission.id} className='subs_checked groupChecked' name='subs_checked' type='checkbox'/>
                </label>
                <a style={{ width: '53%' }} onClick={SubmissionViewClass.showSubmission.bind(null, submission.id)} className='load-submission' data-id={submission.id}>{submission.form_name}</a>
                <a style={{ width: '37%' }} onClick={SubmissionViewClass.showSubmission.bind(null, submission.id)} className='load-submission' data-id={submission.id}>{submission.created}</a>
              </div>
            )
          })}
          </div>
        </div>
      )
    }
  })
  let SubmissionView = React.createClass({
    getInitialState: function() {
      return {
        showEmptyFields: true,
        loading: false,
        submissionContent: []
      }
    },
    showSubmission: function(id) {
      this.setState({ loading: true })
      this.serverRequest = jQuery.getJSON(`${FC_1.ajaxurl}?action=formcraft3_get_submission_content&id=${id}`, function (result) {     
        this.setState({
          loading: false,
          submssionID: result[0].id || 0,
          formName: result[0].form_name || '',
          createdDate: result[0].created_date || '',
          createdTime: result[0].created_time || '',
          visitorIP: result[0].visitor.IP || '',
          visitorURL: result[0].visitor.URL || '',
          submissionContent: result[0].content || []
        })
      }.bind(this))
    },
    toggleShowEmpty: function() {
      this.setState({ showEmptyFields: !this.state.showEmptyFields })
    },
    render: function() {
      let renderSubmission = []
      for (let submission of this.state.submissionContent) {
        if (typeof submission.page === 'undefined') {
          renderSubmission = this.state.submissionContent
          break
        }
        renderSubmission[submission.page_name] = renderSubmission[submission.page_name] || []

        if (submission.type === 'dropdown' || submission.type === 'checkbox') {
          if (typeof submission.value === 'string') {
            submission.value = [submission.value]
          }
          for (let y in submission.value) {
            for (let z in submission.options) {
              if (submission.options[z].value === submission.value[y]) {
                submission.value[y] = submission.options[z].show
              }
            }
          }
        } else if (submission.type === 'matrix') {
          for (let y in submission.value) {
            submission.value[y] = `${submission.value[y].question}: ${submission.value[y].value}`
          }
        }
        renderSubmission[submission.page_name].push({
          label: submission.label,
          identifier: submission.identifier,
          type: submission.type,
          width: submission.width,
          value: submission.value,
          url: submission.url
        })
      }
      return (
        <div className='large-8 column subs_content'>
          <h2>Submission Content</h2>
          <div id='submission_body_cover' data-id={this.state.submssionID} className={`block ${this.state.showEmptyFields ? '' : 'hide-empty'}`}>
            <div id='submission_options'>
              <div id='submission_title'>{this.state.formName}</div>
              <button id='edit-sub'>Edit</button>
              <button id='save-sub'>Save</button>
              <button onClick={this.toggleShowEmpty} id='show-empty-sub'>{this.state.showEmptyFields ? 'Hide' : 'Show'} Empty Fields</button>
              <button onClick={window.print}>Print</button>
              <i className='icon-spin5 animate-spin'></i>
            </div>
            <div id='submission_meta'>
              <span><strong>#</strong>{this.state.submssionID}</span>
              <span><strong>on</strong> {this.state.createdDate} <strong>at</strong> {this.state.createdTime}</span>
              <span><strong>IP:</strong> {this.state.visitorIP}</span>
              <span><strong>Referral:</strong> <a target='_blank' href={this.state.visitorURL}>{this.state.visitorURL}</a></span>
            </div>
            <div id='submission_body' className={`loading-${this.state.loading}`}>
            {Object.keys(renderSubmission).map((pageIndex) => {
              let thisPage = renderSubmission[pageIndex]
              let isArray, isEditable, newClass
              let html = `<span class='title show-${Object.keys(renderSubmission).length}'>${pageIndex}</span>`
              for (let field in thisPage) {
                if (typeof thisPage[field].url !== 'undefined') {
                  let tempValue = []
                  for (let x in thisPage[field].value) {
                    tempValue[x] = `<a href="${thisPage[field].url[x]}">${thisPage[field].value[x]}</a>`
                  }
                  thisPage[field].value = ''
                  thisPage[field].value = tempValue.join('\n')
                } else if (typeof thisPage[field].value === 'object') {
                  thisPage[field].value = thisPage[field].value.join('\n')
                }

                isArray = thisPage[field].type === 'checkbox' || thisPage[field].type === 'fileupload'
                isEditable = thisPage[field].type !== 'fileupload'
                thisPage[field].width = typeof thisPage[field].width === 'undefined' ? 'width: 100%' : thisPage[field].width
                newClass = thisPage[field].value.trim() === '' ? 'class="empty"' : ''

                if (thisPage[field].type === 'heading') {
                  html +=
                  `<div style='width: ${thisPage[field].width}' ${newClass}><span data-array='${isArray}' data-editable='${isEditable}' data-identifier='${thisPage[field].identifier}' class='is-heading value editable-${isEditable}'>${thisPage[field].value}</span></div>`
                } else {
                  html +=
                  `<div style='width: ${thisPage[field].width}' ${newClass}><span class='label'>${thisPage[field].label}</span><span data-array='${isArray}' data-editable='${isEditable}' data-identifier='${thisPage[field].identifier}' class='value editable-${isEditable}'>${thisPage[field].value}</span></div>`
                }
              }
              html = `${html}`
              return (<div key={pageIndex} dangerouslySetInnerHTML={{ __html: html }} />)
            })}
              <div id='empty-submission-content' style={{ display: typeof this.state.submssionID === 'undefined' ? 'block' : 'none' }}>
                <span>←</span>
                click on an entry to view content
              </div>
            </div>
          </div>
        </div>
      )
    }
  })

  /**
  * Create Form List Table Elements
  */
  let FormCover = React.createClass({
    getInitialState: function() {
      return {
        currentPage: 1,
        query: '',
        sortWhat: 'created',
        sortOrder: 'DESC',
        pages: 1,
        total: 0,
        loading: false,
        forms: []
      }
    },
    componentDidMount: function() {
      this.refreshList()
    },
    refreshList: function() {
      this.setState({ loading: true })
      this.serverRequest = jQuery.getJSON(`${FC_1.ajaxurl}?action=formcraft3_get_forms&page=${this.state.currentPage}&query=${this.state.query}&sortWhat=${this.state.sortWhat}&sortOrder=${this.state.sortOrder}`, (result) => {
        this.setState({
          pages: result.pages,
          total: result.total,
          forms: result.forms || [],
          loading: false
        })
      })
    },
    updatePage: function(newPage) {
      this.setState({ currentPage: newPage }, this.refreshList)
    },
    updateSearch: function(e) {
      e.preventDefault()
      this.setState({
        currentPage: 1,
        query: e.target.getElementsByTagName('input')[0].value
      }, this.refreshList)
    },
    onSort: function(type) {
      let order = this.state.sortOrder === 'ASC' ? 'DESC' : 'ASC'
      this.setState({ sortWhat: type, sortOrder: order }, this.refreshList)
    },
    onTrash(form) {
      this.setState({ loading: true })
      this.serverRequest = jQuery.getJSON(`${FC_1.ajaxurl}?action=formcraft3_del_form&form=${form}`, (result) => {
        if (result.success) {
          this.refreshList()
        }
      })
    },
    toggleParentActive: function(e) {
      jQuery('.opt-cover .active').removeClass('active')
      e.currentTarget.className += 'active'
      jQuery(e.currentTarget).find('input').trigger('focus')
    },
    render: function() {
      return (
        <div className='large-4 column'>
          <div className='subs_options'>
            <h2>Your Forms</h2>
            <span className='opt-cover'>
              <span id='search-form' onClick={this.toggleParentActive}>
                <form id='form-search-form' onSubmit={this.updateSearch}>
                  <i className='icon-search'></i>
                  <input id='form-search-input' type='text'/>
                </form>
              </span>
              <span id='total-forms'>{this.state.total}</span>
            </span>
          </div>
          <FormList {...this.state} onTrash={this.onTrash} onSort={this.onSort}/>
          <Pagination updatePage={this.updatePage} currentPage={this.state.currentPage} data={[this.state.pages]}/>
          {this.props.children}
        </div>
      )
    }
  })
  let FormList = React.createClass({
    render: function() {
      return (
        <div className='block'>
          <div className='table_list form_list'>
            <div className='tr thead'>
              <span style={{ width: '10%' }} className='sortable' onClick={this.props.onSort.bind(null, 'ID')}>
                ID
                {this.props.sortWhat === 'ID' && this.props.sortOrder === 'ASC' ? <i className='icon-angle-up'></i> : ''}
                {this.props.sortWhat === 'ID' && this.props.sortOrder === 'DESC' ? <i className='icon-angle-down'></i> : ''}
              </span>
              <span style={{ width: '45%' }} className='sortable' onClick={this.props.onSort.bind(null, 'name')}>
                Name
                {this.props.sortWhat === 'name' && this.props.sortOrder === 'ASC' ? <i className='icon-angle-up'></i> : ''}
                {this.props.sortWhat === 'name' && this.props.sortOrder === 'DESC' ? <i className='icon-angle-down'></i> : ''}
              </span>
              <span style={{ width: '35%' }} className='sortable' onClick={this.props.onSort.bind(null, 'modified')}>
                Last Edit
                {this.props.sortWhat === 'modified' && this.props.sortOrder === 'ASC' ? <i className='icon-angle-down'></i> : ''}
                {this.props.sortWhat === 'modified' && this.props.sortOrder === 'DESC' ? <i className='icon-angle-up'></i> : ''}
              </span>
              <span style={{ width: '9%', float: 'right' }}></span>
            </div>
            <div className={`tbody loading-${this.props.loading}`}>
              {this.props.forms.map((form) => {
                return (
                  <div key={form.id} className={`tr form-${form.id}`}>
                    <a style={{ width: '10%' }} href={`admin.php?page=formcraft3_dashboard&id=${form.id}`}>{form.id}</a>
                    <a title={form.name} style={{ width: '45%' }} href={`admin.php?page=formcraft3_dashboard&id=${form.id}`}>{form.name}</a>
                    <a style={{ width: '35%' }} href={`admin.php?page=formcraft3_dashboard&id=${form.id}`}>{form.modified}</a>
                    <span style={{ width: '10%' }}>
                      <i data-id={form.id} onClick={this.props.onTrash.bind(null, form.id)} className='trash-icon trash-form icon-trash-1'></i>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )
    }
  })

  /**
  * Create Form List Table Elements
  */
  let Pagination = React.createClass({
    moveLeft: function(e) {
      let element = jQuery(e.currentTarget).parent().parent().find('.pagination > div')
      let left = parseInt(element.css('left'), 10) + 150
      left = Math.min(left, 0)
      element.animate({ left: `${left}px` }, 250, 'linear')
    },
    moveRight: function(e) {
      let element = jQuery(e.currentTarget).parent().parent().find('.pagination > div')
      let left = parseInt(element.css('left'), 10) - 150
      let len = -(Math.max(0, (element.find('span').length - 11)) * 40)
      left = Math.max(left, len)
      element.animate({ left: `${left}px` }, 250, 'linear')
    },
    render: function() {
      return (
        <div className='pagination-cover forms-pagination'>
          <div className='pagination'>
            <div style={{ left: '0px' }}>
            {this.props.data.map(() => {
              let pageList = []
              for (let x = 1; x <= this.props.data[0]; x++) {
                pageList.push(<span key={x} className={ x === this.props.currentPage ? 'active' : '' } onClick={this.props.updatePage.bind(null, x)}>{x}</span>)
              }
              return pageList
            })}
            </div>
          </div>
          <div className='pagination-move'>
            <i className='icon-angle-left' onClick={this.moveLeft}></i>
            <i className='icon-angle-right' onClick={this.moveRight}></i>
          </div>
        </div>
      )
    }
  })

  /**
  * Create Analytics View Elements
  */
  let AnalyticsCover = React.createClass({
    setChartDates: function(preset = 'w') {
      if (preset === 'w') {
        if (new Date().getDay() === 0) {
          jQuery('#chart-from').datepicker('setDate', -7)
          jQuery('#chart-to').datepicker('setDate', new Date())
        } else {
          jQuery('#chart-from').datepicker('setDate', -new Date().getDay())
          jQuery('#chart-to').datepicker('setDate', -new Date().getDay() + 7)
        }
      } else if (preset === 'm') {
        let dateTo = new Date(new Date().getUTCFullYear(), new Date().getUTCMonth() + 1, 0)
        let dateFrom = new Date(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
        jQuery('#chart-from').datepicker('setDate', dateFrom)
        jQuery('#chart-to').datepicker('setDate', dateTo)
      } else if (preset === 'y') {
        let dateFrom = new Date(new Date().getUTCFullYear(), 0, 1)
        let dateTo = new Date(new Date().getUTCFullYear(), 11, 31)
        jQuery('#chart-from').datepicker('setDate', dateFrom)
        jQuery('#chart-to').datepicker('setDate', dateTo)
      }
      this.refreshChart()
    },
    plotChart: function(labels, views, submissions, payments) {

      Chart.defaults.global.customTooltips = function(tooltip) {
        let index = window.labels.indexOf(tooltip.title)
        let amount = window.payments[index]
        let tooltipEl = jQuery('#tooltip')

        if (!tooltip) {
          return
        }

        tooltipEl.removeClass('above below')
        tooltipEl.addClass(tooltip.yAlign)

        let innerHtml

        if (jQuery('.fc-header .small-4').length === 0) {
          innerHtml = `<div class="chartjs-tooltip-section"><span class="chartjs-tooltip-key">${tooltip.title}</span><span class="chartjs-tooltip-value">${tooltip.labels[0]} views</span><span class="chartjs-tooltip-value">${tooltip.labels[2]} submissions</span><span class="chartjs-tooltip-value">${amount} charges</span></div>`
        } else {
          innerHtml = `<div class="chartjs-tooltip-section"><span class="chartjs-tooltip-key">${tooltip.title}</span><span class="chartjs-tooltip-value">${tooltip.labels[1]} views</span><span class="chartjs-tooltip-value">${tooltip.labels[0]} submissions</span></div>`
        }
        tooltipEl.html(innerHtml)
      }

      window.views = views
      window.labels = labels
      window.submissions = submissions
      window.payments = payments

      let viewsSum = views.reduce((x, y) => x + y)
      let submissionsSum = submissions.reduce((x, y) => x + y)
      let paymentsSum = payments.reduce((x, y) => x + y)

      let conversion = viewsSum === 0 ? 0 : Math.round(parseFloat(submissionsSum / viewsSum) * 1000) / 10
      let conversionPayments = viewsSum === 0 ? 0 : Math.round(parseFloat(paymentsSum / viewsSum) * 1000) / 10

      helpers.spinTo('#views', viewsSum)
      helpers.spinTo('#submissions', submissionsSum)
      helpers.spinTo('#conversion', conversion)
      helpers.spinTo('#conversionPayments', conversionPayments)
      helpers.spinTo('#payments', paymentsSum)

      let data = {}
      data.labels = labels
      data.datasets = []
      if (paymentsSum > 0) {
        jQuery('.pay-class').css('display', 'inline-block')
        jQuery('.fc-header .small-4').addClass('small-3').removeClass('small-4')
        data.datasets.push({
          label: 'Charges',
          fillColor: 'rgba(93,168,93,0.2)',
          strokeColor: 'rgba(93,168,93,0.8)',
          pointColor: 'rgba(93,168,93,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(93,168,93,1)',
          data: payments
        })
      } else {
        jQuery('.pay-class').css('display', 'none')
        jQuery('.fc-header .small-3').addClass('small-4').removeClass('small-3')
      }
      data.datasets.push({
        label: 'Submissions',
        fillColor: 'rgba(59,161,218,0.2)',
        strokeColor: 'rgba(59,161,218,0.8)',
        pointColor: 'rgba(59,161,218,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(59,161,218,1)',
        data: submissions
      })
      data.datasets.push({
        label: 'Views',
        fillColor: 'rgba(237, 133, 66, 0.2)',
        strokeColor: 'rgba(237, 133, 66, 0.8)',
        pointColor: 'rgba(237, 133, 66, 1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(237, 133, 66,1)',
        data: views
      })
      if (typeof window.myLineChartIs !== 'undefined') {
        myLineChart.destroy()
        jQuery('#chart').css('height', '317px').attr('height', '335').css('width', jQuery('#chart-cover').css('width'))
      }
      window.myLineChart = new Chart(document.getElementById('chart').getContext('2d')).Line(data)
      window.myLineChartIs = true
    },
    resetAnalytics: function() {
      if (confirm('Sure? This action can\'t be reversed.') !== true) {
        return false
      }
      jQuery.getJSON(`${FC_1.ajaxurl2}action=formcraft3_reset_analytics`, function(response) {
        if (response.success) {
          toastr['success'](`<i class='icon-ok'></i> ${response.success}`)
          this.refreshChart()
        } else {
          toastr['error']('Something went wrong')
        }
      }.bind(this))
    },
    refreshChart: function() {
      let dateFrom = encodeURIComponent(jQuery.datepicker.formatDate('yy-M-dd', jQuery('#chart-from').datepicker('getDate')))
      let to = encodeURIComponent(jQuery.datepicker.formatDate('yy-M-dd', jQuery('#chart-to').datepicker('getDate')))
      let form = encodeURIComponent(jQuery('#chart-form').val())
      jQuery.getJSON(`${FC_1.ajaxurl2}action=formcraft3_get_stats&from=${dateFrom}&to=${to}&form=${form}`, function(response) {
        this.plotChart(response.labels, response.views, response.submissions, response.payments)
      }.bind(this))
    },
    componentDidMount: function() {
      /**
      * Initiate date elements
      */
      let options = {}
      options.beforeShow = function() {
        jQuery('#ui-datepicker-div').removeClass('ui-datepicker').addClass('fc-datepicker')
      }
      options.onClose = function () {
        if (jQuery(this).attr('id') === 'chart-from') {
          let minDate = jQuery('#chart-from').datepicker('getDate')
          jQuery('#chart-to').datepicker('option', 'minDate', minDate)
          jQuery('#chart-to').trigger('focus')
        }
        if (jQuery(this).attr('id') === 'chart-to') {
          jQuery('[name="pre-selected"]').removeAttr('checked').trigger('change')
          AnalyticsCoverClass.refreshChart()
        }
      }
      options.onSelect = function() {
        jQuery(this).trigger('change').trigger('input')
      }
      options.nextText = '❯'
      options.prevText = '❮'
      options.hideIfNoPrevNext = true
      options.changeYear = true
      options.changeMonth = true
      options.showAnim = false
      options.yearRange = 'c-2:c+2'
      options.dateFormat = 'd M, yy'
      jQuery('.fc-date').datepicker(options)
      jQuery('#chart-options input[value="week"]').trigger('click')
      jQuery('#chart-options input[value="week"]').parent().addClass('active')
    },
    render: function() {
      return (
        <div className='large-8 column'>
          <h2>Form Analytics</h2>
          <div id='reset-analytics' onClick={this.resetAnalytics}>(reset analytics data)</div>
          <div id='form_options' className='block'>
            <div id='chart-options'>
              <span className='hide-checkbox update-checkbox'>
                <span className='active'>this</span>
                <span className='active'>→</span>
                <label><input onClick={this.setChartDates.bind(null, 'w')} value='week' name='pre-selected' type='radio'/>Week</label>
                <label><input onClick={this.setChartDates.bind(null, 'm')} value='month' name='pre-selected' type='radio'/>Month</label>
                <label><input onClick={this.setChartDates.bind(null, 'y')} value='year' name='pre-selected' type='radio'/>Year</label>
              </span>
              <span style={{ display: 'inline-block' }}>
                <span className='active'>custom</span>
                <span className='active'>→</span>
                <span className='custom-cover'>
                  from<input type='text' id='chart-from' className='fc-date'/>
                  to<input type='text' id='chart-to' className='fc-date'/>
                  for
                  <select id='chart-form' onChange={this.refreshChart}>
                    <option value='0'>All Forms</option>
                    {window.formsList.map((form) => {
                      return (<option value={form.id} key={form.id}>{form.name}</option>)
                    })}
                  </select>
                </span>
              </span>
            </div>
            <div className='row fc-header'>
              <div className='small-4 column'>
                <span className='one' style={{ borderColor: 'inherit' }}><span id='views'>0</span></span>
                <span style={{ color: 'rgba(237, 133, 66,.92)' }} className='two'>form views</span>
              </div>
              <div className='small-4 column'>
                <span className='one'><span id='submissions'>0</span></span>
                <span style={{ color: 'rgba(59,161,218, .9)' }} className='two'>submissions</span>
              </div>
              <div className='small-4 column'>
                <span className='one'><span id='conversion'>0</span>%</span>
                <span style={{ color: 'rgba(59,161,218, .9)' }} className='two'>conversion</span>
              </div>
              <div className='small-4 column pay-class' style={{ display: 'none' }}>
                <span className='one'><span id='payments'>0</span></span>
                <span style={{ color: 'rgb(93, 168, 93)' }} className='two'>charges</span>
              </div>
              <div className='small-4 column pay-class' style={{ display: 'none' }}>
                <span className='one'><span id='conversionPayments'>0</span>%</span>
                <span style={{ color: 'rgb(93, 168, 93)' }} className='two'>conversion</span>
              </div>
            </div>
            <div id='chart-cover'>
              <div id='chart-loader'>
                <i className='icon-spin5 animate-spin'></i>
              </div>
              <div id="tooltip"></div>
              <canvas id="chart" height='317' style={{ width: '100%', height: '317px' }}></canvas>
            </div>
          </div>
        </div>
      )
    }
  })

  let FormCoverClass = ReactDOM.render(<FormCover/>, document.getElementById('form-cover'))
  let SubmissionCoverClass = ReactDOM.render(<SubmissionCover/>, document.getElementById('submission-cover'))
  let FilesCoverClass = ReactDOM.render(<FilesCover/>, document.getElementById('files-cover'))
  let SubmissionViewClass = ReactDOM.render(<SubmissionView/>, document.getElementById('submission-view'))
  let AnalyticsCoverClass = ReactDOM.render(<AnalyticsCover/>, document.getElementById('analytics-cover'))

})

toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: true,
  progressBar: false,
  positionClass: 'toast-top-right',
  preventDuplicates: false,
  onclick: null,
  showDuration: 300,
  hideDuration: 300,
  timeOut: 3000,
  extendedTimeOut: 300,
  showEasing: 'linear',
  hideEasing: 'linear',
  showMethod: 'slideDown',
  hideMethod: 'slideUp'
}

if (FC_1.ajaxurl.indexOf('?') > -1) {
  FC_1.ajaxurl2 = `${FC_1.ajaxurl}&`
} else {
  FC_1.ajaxurl2 = `${FC_1.ajaxurl}?`
}


function setCookie(cname, cvalue, exdays) {
  let d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  let expires = `expires=${d.toUTCString()}`
  document.cookie = `${cname}=${cvalue}; ${expires}; path=/`
}

function getCookie(cname) {
  let name = `${cname}=`
  let ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}


jQuery(document).mouseup(function (e) {
  let container = jQuery('.global-options')
  if (!container.is(e.target) && container.has(e.target).length === 0) {
    jQuery('.active .cog').trigger('click')
  }
  container = jQuery('.opt-cover')
  if (!container.is(e.target) && container.has(e.target).length === 0) {
    jQuery('#search-subs').removeClass('active')
    jQuery('#search-form').removeClass('active')
    jQuery('#export-subs').removeClass('active')
  }
})

let previousPoint = null

function showTooltip(x, y, contents) {
  let width = 110
  if (jQuery('#tooltip').length) {
    jQuery('#tooltip').html(contents).stop(true, true).animate({
      top: y - 96,
      left: x - (width / 2)
    }, 250)
  } else {
    jQuery(`<div id='tooltip'>${contents}</div>`).css({
      position: 'absolute',
      width: `${width}px`,
      display: 'none',
      top: y - 94,
      left: x - (width / 2)
    }).appendTo('body').show()
  }
}

function whatDecimalSeparator() {
  let n = 1.1
  n = n.toLocaleString().substring(1, 2)
  return n
}

jQuery(document).ready(function() {
  jQuery('[data-toggle="tooltip"]').tooltip({
    hide: function() {
      jQuery(this).animate({ marginTop: -100 }, function() {
        jQuery(this).css({ marginTop: '' })
      })
    }
  })
  jQuery('input:file').change(function () {
    let fileName = jQuery(this).val()
    fileName = fileName.replace(/^.*[\\\/]/, '')
    jQuery(this).parent().parent().find('.filename').text(fileName)
  })

  /* Allow +Shift for Selecing a Queue of Checkboxes */
  jQuery('body').on('click', '.groupChecked', function(e) {
    let checkbox = jQuery('.groupChecked')
    if (!lastChecked) {
      lastChecked = this
      return
    }
    if (e.shiftKey) {
      let start = checkbox.index(this)
      let end = checkbox.index(lastChecked)
      checkbox.slice(Math.min(start, end), Math.max(start, end) + 1).prop('checked', lastChecked.checked).trigger('change')
    }
    lastChecked = this
  })
  jQuery('body').on('change', '.groupCheckedParent', function() {
    if (jQuery(this).is(':checked')) {
      jQuery(this).parents('.list').find('.groupChecked').each(function() {
        if (!jQuery(this).is(':checked')) {
          jQuery(this).prop('checked', true).trigger('change')
        }
      })
    } else {
      jQuery(this).parents('.list').find('.groupChecked').each(function() {
        if (jQuery(this).is(':checked')) {
          jQuery(this).prop('checked', false).trigger('change')
        }
      })
    }
  })
  jQuery('body').on('change', '.groupChecked', function() {
    let len = jQuery('.groupChecked:checked').length
    if (len === 0) {
      jQuery(this).parents('.list').find('.groupCheckedParent').prop('checked', false).trigger('change')
    } else {
      jQuery('.subs_cover').addClass('show_options')
    }
    if (len === jQuery('.groupChecked').length) {
      jQuery(this).parents('.list').find('.groupCheckedParent').prop('checked', true).trigger('change')
    }
  })

  jQuery('body').on('submit', '#new_form', function(event) {
    event.preventDefault()
    let data = jQuery(this).serialize()
    if (jQuery('#import_form_input').attr('data-file')) {
      data = `${data}&file=${jQuery('#import_form_input').attr('data-file')}`
    }
    jQuery(this).find('.submit-btn').attr('disabled', 'disabled').addClass('fc-disabled')
    jQuery(this).find('.response').text('').hide()
    jQuery.ajax({
      url: FC_1.ajaxurl,
      type: 'POST',
      cache: false,
      context: jQuery(this),
      data: `action=formcraft3_new_form&${data}`,
      dataType: 'json'
    })
    .done(function(response) {
      if (response.failed) {
        jQuery(this).find('.response').html(response.failed).show()
      } else if (response.success) {
        jQuery(this).find('.response').html(response.success).show()
      }
      if (response.redirect) {
        window.location = window.location.href.replace(window.location.hash, '') + response.redirect
      }
    })
    .fail(function() {
      jQuery(this).find('.response').text('Connection error').show()
      jQuery(this).find('.submit-btn').removeAttr('disabled').removeClass('fc-disabled')
    })
    .always(function() {
      jQuery(this).find('.submit-btn').removeAttr('disabled').removeClass('fc-disabled')
    })
  })
})

jQuery(document).ready(function() {
  jQuery('body').on('click', '#trigger-key-tab', function() {
    jQuery('a[href="#license-tab"]').trigger('click')
  })

  jQuery('body').on('click', '#show-license-form', function() {
    jQuery('.not-activated').slideToggle()
  })

  jQuery('body').on('submit', '#activate-license', function(event) {
    event.preventDefault()
    jQuery(this).find('button').addClass('fc-disabled').attr('disabled', 'disabled')
    jQuery('#refresh-license').find('button').addClass('fc-disabled').attr('disabled', 'disabled')
    let data = jQuery(this).serialize()
    jQuery(this).find('.response').text('')
    jQuery.ajax({
      url: FC_1.ajaxurl,
      type: 'POST',
      context: jQuery(this),
      data: `action=formcraft3_verify_license&${data}`,
      dataType: 'json'
    })
    .done(function(response) {
      if (response.success) {
        jQuery('#activation-tab').addClass('activated')
        jQuery('#activation-tab .not-activated').slideUp()
        jQuery('#activation-tab .is-activated').slideDown()
        jQuery('#purchased-on').text(response.purchased)
        jQuery('#valid-till').text(response.expires)
        jQuery('#verified-on').text(response.registered)
      } else if (response.failed) {
        jQuery(this).find('.response').text(response.failed)
      } else {
        toastr['error']('Something wen\'t wrong')
      }
      jQuery(this).find('button').removeClass('fc-disabled').removeAttr('disabled')
      jQuery('#refresh-license').removeClass('fc-disabled').removeAttr('disabled')
    })
    .fail(function() {
      jQuery(this).find('button').removeClass('fc-disabled').removeAttr('disabled')
      jQuery('#refresh-license').removeClass('fc-disabled').removeAttr('disabled')
      toastr['error']('Connection Error')
    })
  })
  jQuery('body').on('click', '#refresh-license', function() {
    jQuery(this).addClass('fc-disabled')
    jQuery('#activate-license').trigger('submit')
  })

  jQuery('body').on('change', '.checkbox-cover label input', function() {
    if (jQuery(this).is(':checked')) {
      jQuery(`[name="${jQuery(this).attr('name')}"]`).parent().removeClass('active')
      jQuery(this).parent().addClass('active')
    }
  })
  jQuery('body').on('change', '[name="template-select-slider"]', function() {
    jQuery.getJSON(`${FC_1.ajaxurl2}action=formcraft3_get_template&name=${encodeURIComponent(jQuery('[name="template-select-slider"]:checked').val())}`, function(response) {
      jQuery('#template-showcase-form').html(response.html)
      jQuery('#template-showcase-form .fc-pagination > div').eq(0).addClass('active')
      jQuery('#template-showcase-form .fc_form .form-page-0').addClass('active')
      if (response.config) {
        if (typeof response.config.config.font_family !== 'undefined' && response.config.config.font_family.indexOf('Arial') === -1 && response.config.config.font_family.indexOf('Courier') === -1 && response.config.config.font_family.indexOf('sans-serif') === -1 && response.config.config.font_family.indexOf('inherit') === -1) {
          response.config.config.font_family = response.config.config.font_family.replace(/ /g, '+')
          jQuery('head').append(`<link href='${(location.protocol === 'http:' ? 'http:' : 'https:')}//fonts.googleapis.com/css?family=${response.config.config.font_family}:400,600,700' rel='stylesheet' type='text/css'>`)
        }
      }
    })
  })
  jQuery('body').on('change', '[name="new_form_type"]', function() {
    let value = jQuery('[name="new_form_type"]:checked').val()

    jQuery('#select-template-cover').slideUp()
    jQuery('#new_form').parent().animate({ width:'490px', 'padding-top': '40px', 'padding-bottom': '40px' }, 250)
    jQuery('#new_form_modal').animate({ 'padding-top': '50px' }, 250)
    switch (value) {
      case 'blank':
      jQuery('#import-which-form, #duplicate-which-form').parent().slideUp()
      break

      case 'import':
      jQuery('#duplicate-which-form').parent().slideUp()
      jQuery('#import-which-form').parent().slideDown()
      break

      case 'duplicate':
      jQuery('#import-which-form').parent().slideUp()
      jQuery('#duplicate-which-form').parent().slideDown()
      break

      case 'template':
      jQuery('#import-which-form, #duplicate-which-form').parent().slideUp()
      jQuery('#new_form_modal').animate({ 'padding-top': '32px' }, 250)
      jQuery('#new_form').parent().animate({ width:'825px', 'padding-top': '0px', 'padding-bottom': '0px' }, 250)
      jQuery('#select-template-cover').slideDown()
      jQuery('.template-select-slider label:nth-child(2)').trigger('click')
      break
    }
  })

  jQuery('#which-form-export').change(function() {
    if (whatDecimalSeparator() === ',') {
      jQuery(this).parent().find('a').attr('href', `${FC_1.baseurl}/?formcraft_export_entries=${jQuery(this).val()}&sep=,`)
    } else {
      jQuery(this).parent().find('a').attr('href', `${FC_1.baseurl}/?formcraft_export_entries=${jQuery(this).val()}`)
    }
  })
  jQuery('#which-form-export').trigger('change')

  jQuery('body').on('click', '#edit-sub', function() {
    if (!jQuery('#submission_body_cover').attr('data-id')) {
      return
    }
    jQuery('#submission_body_cover').toggleClass('editing')
    jQuery('#submission_body .value').each(function() {
      if (jQuery(this).attr('data-editable') === 'true') {
        let value = jQuery(this).text()
        let identifier = jQuery(this).attr('data-identifier')
        let isArray = jQuery(this).attr('data-array')
        jQuery(this).html(`<textarea rows='1' class='array-${isArray}' name='${identifier}'>${value}</textarea>`)
        autosize(jQuery(this).find('textarea'))
      }
    })
  })
})
jQuery(document).ready(function() {

  jQuery('body').on('click', '#save-sub', function() {
    let data1 = jQuery('#submission_body .value textarea.array-false').serialize()
    let data2 = ''
    jQuery('#submission_body .value textarea.array-true').each(function() {
      let valueArray = jQuery(this).val().split('\n')
      for (let x in valueArray) {
        data2 = `${data2}&${jQuery(this).attr('name')}[]=${valueArray[x]}`
      }
    })
    jQuery('#submission_body_cover').addClass('loading')
    jQuery.ajax({
      url: FC_1.ajaxurl,
      type: 'POST',
      context: jQuery(this),
      data: `action=formcraft3_update_submission_content&id=${jQuery('#submission_body_cover').attr('data-id')}&${data1}${data2}`,
      dataType: 'json'
    })
    .done(function(response) {
      if (response) {
        jQuery('.subs_list .tbody .tr.active .load-submission').first().trigger('click')
      } else {
        toastr['error']('Something went wrong')
      }
    })
    .fail(function() {
      toastr['error']('Connection Error')
    })
    .always(function() {
      jQuery('#submission_body_cover').removeClass('loading')
    })
  })

  jQuery('body').on('click', '.nav-tabs > span, .nav-tabs > a', function() {
    let selector = jQuery(this).parent().attr('data-content')
    if (jQuery(selector).find(' > div').eq(jQuery(this).index()).length > 0) {
      jQuery(this).parent().find('> span,> a').removeClass('active')
      jQuery(this).addClass('active')
      jQuery(selector).find(' > div').removeClass('active')
      jQuery(selector).find(' > div').eq(jQuery(this).index()).addClass('active')
    }
  })
  jQuery('body').on('click', '.main-tabs > span, .main-tabs > a', function() {
    let selector = jQuery(this).parent().attr('data-content')
    if (jQuery(this).attr('href')) {
      jQuery(selector).find(' > div').removeClass('active')
      jQuery(this).parent().find('> span,> a').removeClass('active')
      jQuery(this).addClass('active')
      jQuery(`[data-tab-id="${jQuery(this).attr('href').replace('#', '')}"]`).addClass('active')
    }
  })
  let hash = window.location.hash.substr(1)
  if (typeof hash !== 'undefined' && hash !== '') {
    jQuery(`a[href="#${hash}"]`).trigger('click')
  }

  jQuery('body').on('change', '.update-checkbox label input', function() {
    let name = jQuery(this).attr('name')
    jQuery(`[name="${name}"]`).parent().removeClass('active')
    jQuery(`[name="${name}"]:checked`).parent().addClass('active')
  })

  jQuery('#chart').bind('plothover', function (event, pos, item) {
    if (item) {
      if (previousPoint !== item.dataIndex) {
        previousPoint = item.dataIndex
        let x = Object.keys(item.series.xaxis.categories)[item.datapoint[0]]
        let abc = `<span>${x}</span>${window.views[item.datapoint[0]][1]} visits <br> ${window.submissions[item.datapoint[0]][1]} submissions`
        showTooltip(item.pageX, item.pageY, abc, item)
      }
    } else {
      jQuery('#tooltip').remove()
      previousPoint = null
    }
  })

  jQuery('#import_form_input').fileupload({
    dataType: 'json',
    add: function(e, data) {
      jQuery(this).attr('disabled', 'disabled')
      let parent = jQuery(this).parent().parent()
      parent.find('.icon-up-circled2').hide()
      parent.find('.icon-spin5').show()
      parent.find('.button-file').removeClass('active')
      window.jqXHR = data.submit()
    },
    done: function(e, data) {
      jQuery(this).removeAttr('disabled')
      let response = data.result
      let parent
      if (response.success) {
        if (response.debug) {
          toastr['success'](`<i class='icon-ok'></i> ${response.debug}`)
        }
        jQuery(this).attr('data-file', response.success)
        parent = jQuery(this).parent().parent()
        parent.find('.file-name').html(response.success)
        parent.find('.button-file').addClass('active')
      } else if (response.failed) {
        parent = jQuery(this).parent().parent()
        toastr['error'](response.failed)
      } else {
        parent = jQuery(this).parent().parent()
        toastr['error']('Unknown Error')
      }
      parent.find('.icon-up-circled2').show()
      parent.find('.icon-spin5').hide()
    }
  })
  jQuery('[data-target="#new_form_modal"]').click(function() {
    jQuery('#form_name').focus()
  })
})
