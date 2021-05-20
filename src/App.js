import React, { Component } from 'react';
import './App.css';
import { withStyles } from '@material-ui/core/styles';

import {
  Box, Grid,
  Slider,
  Accordion, AccordionSummary, AccordionDetails,
  Checkbox,
  Typography,
  FormControl,
  FormLabel, RadioGroup, FormControlLabel, Radio,
 } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// import { getCsvData, getSelectOptions } from './dataHelpers';
import Programs from './static/programs.json';
import SelectOptions from './static/selectOptions.json';

import ProgramCard from './components/programCard';
import FilterSelect from './components/filterSelect';
import SearchBar from './components/searchBar';
import PercentageBar from './components/percentOfPrograms';

const styles = {
  html: {
    width: '100%',
    height: '100%',
  },
  behind: {
    width: '100%',
    height: 0,
  },
  coloredBack: {
    width: '100%',
    // height: window.innerWidth > 600 ? '250px' : '350px',
    background: '#ff6363',
  },
  siteTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  siteDescription: {
    color: 'white',
  },
  accordionSummary: {
    alignItems: 'flex-end',
  },
  filtersContainer: {
    background: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',

  },
  filtersTitle: {
    fontWeight: 'bold',
  },
  advancedFilters: {
    textAlign: 'right',
  },
  advancedFilterAlignment: {
    alignContent: 'flex-start',
  }
};

//https://stackoverflow.com/questions/53416529/react-import-csv-file-and-parse

class App extends Component {
  constructor(props) {
    super(props);

    this.filtersRef = React.createRef();

    this.state = {
        behindHeight: '100px',
        selectOptions: {},
        filteredSelectOptions: {},
        data: [],
        filtered: [],
        select: {},
        search: '',
        radio: {
          payCost: '',
        },
        checkbox: {
          aidOnly: false,
          remoteOnly: false,
          gradesOnly: false,
          agesOnly: false,
        },
        range: {
          gradeBand: [5,12],
          ageGroup: [7,19],
        },
    };

  }

  componentDidMount() {
      this.handleResize();
      window.addEventListener("resize",this.handleResize.bind(this));
      // getCsvData(this.setData);
      this.setState({
        data: Programs,
        filtered: Programs,
        select: {
            category: '',
            state: '',
            city: '',
        },
        selectOptions: SelectOptions,
        filteredSelectOptions: SelectOptions,
        search: '',
      });
  }

  setData = state => this.setState(state);

  handleResize = () => {
    this.setState({ behindHeight: this.getBehindHeight() });
  }

  getBehindHeight = () => {
    const node = this.filtersRef.current;
    if (!node) return `100px`;
    const middle = node.offsetHeight + Math.floor(node.offsetTop/2);
    return `${middle}px`;
  }

  updateFilteredSelectOptions = () => {
    const { filtered } = this.state;
    const filteredSelectOptions = filtered;
    this.setState({
      filteredSelectOptions: filteredSelectOptions,
    });
  }

  updateFilteredData = () => {
    const { data } = this.state;
    let filtered = data;
    filtered = filtered.filter(entry => this.filterBySearch(entry));
    filtered = filtered.filter(entry => this.filterBySelect(entry));
    filtered = filtered.filter(entry => this.filterByRadio(entry));
    filtered = filtered.filter(entry => this.filterByCheckbox(entry));
    filtered = filtered.filter(entry => this.filterByRange(entry));
    this.setState({
      filtered: filtered,
    });
  }

  updateFilter = () => {
    this.updateFilteredData();
    // this.updateFilteredSelectOptions();
  }

  filterByRange = entry => {
    const { checkbox, range } = this.state;
    let passes = true;
    if (checkbox.agesOnly && entry.ageGroup.value.length > 0) {
      if (entry.ageGroup.value[0] > range.ageGroup[1] ||
          entry.ageGroup.value[1] < range.ageGroup[0]
         )
      {
        passes = false;
      }
    }
    if (checkbox.gradesOnly && entry.gradeBand.value.length > 0) {
      if (entry.gradeBand.value[0] > range.gradeBand[1] ||
          entry.gradeBand.value[1] < range.gradeBand[0]
         )
      {
        passes = false;
      }
    }
    return passes;
  }

  filterByCheckbox = entry => {
    const { checkbox } = this.state;
    if (checkbox.aidOnly && !entry.finances.aidAvailable) return false;
    if (checkbox.remoteOnly && !entry.location.isRemote) return false;
    if (checkbox.gradesOnly && entry.gradeBand.value.length === 0) return false;
    if (checkbox.agesOnly && entry.ageGroup.value.length === 0) return false;
    return true;
  }

  filterByRadio = entry => {
    const { radio } = this.state;
    if (radio.payCost === "paid" && !entry.finances.isPaid) return false;
    else if (radio.payCost === "free" && !(entry.finances.cost.value === 0)) return false;
    else if (radio.payCost === "costs" &&
             (!entry.finances.cost.value || entry.finances.cost.value === 0)
            ) return false;
    return true;
  }

  filterBySelect = entry => {
    const { select } = this.state;
    if (select.category !== '' && !(entry.categories.includes(select.category))) return false;
    if (select.state !== '' && entry.location.state !== select.state) return false;
    if (select.city !== '' && entry.location.city !== select.city) return false;
    return true;
  }

  filterBySearch = entry => {
    const { search } = this.state;
    if (search === '') return true;
    const searchTerm = search.toLowerCase();
    if (entry.programName.toLowerCase().includes(searchTerm)) return true;
    if (entry.orgName.toLowerCase().includes(searchTerm)) return true;
    if (entry.location.formatted.toLowerCase().includes(searchTerm)) return true;
    return false;
  }

  onFiltersGo = event => {
    event.preventDefault();
    this.updateFilter();
  }

  onSearchChange = event => {
    const value = event.target.value;
    this.setState({
      search: value,
    });
  }

  onSelectChange = (event, optionName) => {
    const value = event.target.value;
    const { select } = this.state;
    select[optionName] = value ? value : '';
    this.setState({
      select: select,
    });
    this.updateFilter();
  }

  onRadioChange = event => {
    const value = event.target.value;
    const name = event.target.name;
    const { radio } = this.state;
    radio[name] = value;
    this.setState({
      radio: radio,
    });
    this.updateFilter();
  }

  onCheckboxChange = event => {
    const checked = event.target.checked;
    const name = event.target.name;
    const { checkbox } = this.state;
    checkbox[name] = checked;
    this.setState({
      checkbox: checkbox,
    });
    this.updateFilter();
  }

  gradeValueText = (value) => {
    return `Grade ${value}`;
  }

  ageValueText = value => {
    if (value === 22) {
      return `Age ${value}+`;
    } else {
      return `Age ${value}`;
    }
  }

  onRangeSliderChange = (event, value, name) => {
    const range = this.state.range;
    range[name] = value;
    this.setState({
      range: range,
    });
    // this.updateFilter();
  }

  onRangeSliderChangeCommitted = () => {
    this.updateFilter();
  }

  render() {
    const { behindHeight,
            filteredSelectOptions,
            filtered,
            select,
            radio,
            checkbox,
            range,
            data
          } = this.state;
    const fraction = [filtered.length,data.length];
    const { classes } = this.props;
    return (
      <div className={classes.html}>
        <div className={classes.behind}>
          <div className={classes.coloredBack} style={{height:behindHeight}}></div>
        </div>
      <Box maxWidth="1200px" margin="auto">
        <Box m={4}>

          <Box mb={4} mt={6}>
            <Typography variant="h3" className={classes.siteTitle}>
              DESIGN PROGRAMS FOR TEENS
            </Typography>
            <Typography variant="body1" className={classes.siteDescription}>
              Browse design programs, classes, and workshops for teenagers in the United States.
            </Typography>
          </Box>

          <Box mb={4} className={classes.filtersContainer} ref={this.filtersRef}>
            <Box m={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1" className={classes.filtersTitle}>
                    FILTER YOUR SEARCH
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} container spacing={2}>
                  <Grid item xs={12}>
                    {(filteredSelectOptions && filteredSelectOptions['category']) &&
                    <FilterSelect
                      key='filter-select-category'
                      optionName='category'
                      options={filteredSelectOptions['category']}
                      onSelectChange={this.onSelectChange}
                      selected={select['category']}
                    />
                    }
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={8} container spacing={2} alignItems="center">
                  <SearchBar
                    onFiltersGo={this.onFiltersGo}
                    onSearchChange={this.onSearchChange}
                  />
                </Grid>
              </Grid>
            </Box>
            <Accordion >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="advanced-content"
                id="advanced-header"
                className={classes.accordionSummary}
              >
                <Box>
                  <Grid item xs={12}>
                    <Typography variant="body1" className={classes.advancedFilters}>
                      advanced filters
                    </Typography>
                  </Grid>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
              <Box m={2}>
              <Grid container spacing={2}>

                <Grid item xs={12} sm={4} container spacing={2} className={classes.advancedFilterAlignment}>
                  {filteredSelectOptions && Object.keys(filteredSelectOptions).map(optionName => {
                    if (optionName === 'category') return null;
                    return (
                      <Grid item xs={12} key={'filter-select-'+optionName+'container'}>
                        <FilterSelect
                          key={'filter-select-'+optionName}
                          optionName={optionName}
                          options={filteredSelectOptions[optionName]}
                          onSelectChange={this.onSelectChange}
                          selected={select[optionName]}
                        />
                      </Grid>
                    );
                  })}
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="remoteOnly"
                          color="primary"
                          value={checkbox.remoteOnly}
                          onChange={(e) => this.onCheckboxChange(e)}
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                        />
                      }
                      label="May Be Remote"
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={4} className={classes.advancedFilterAlignment}>
                  <Box ml={1}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Pay or Cost</FormLabel>
                      <RadioGroup aria-label="payCost" name="payCost" value={radio.payCost} onChange={(e) => this.onRadioChange(e)}>
                        <FormControlLabel value="" control={<Radio color="primary"/>} label="All Programs" />
                        <FormControlLabel value="paid" control={<Radio color="primary"/>} label="Paid" />
                        <FormControlLabel value="free" control={<Radio color="primary"/>} label="Free" />
                        <FormControlLabel value="costs" control={<Radio color="primary"/>} label="Costs" />
                        <FormControlLabel
                          control={
                            <Checkbox
                              name="aidOnly"
                              value={radio.payCost==="costs" && checkbox.aidOnly}
                              onChange={(e) => this.onCheckboxChange(e)}
                              inputProps={{ 'aria-label': 'primary checkbox' }}
                              color="primary"
                            />
                          }
                          label="Offers Financial Aid"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4} container spacing={0} alignItems="flex-start" className={classes.advancedFilterAlignment}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="gradesOnly"
                          value={checkbox.gradesOnly}
                          onChange={(e) => this.onCheckboxChange(e)}
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                          color="primary"
                        />
                      }
                      label="Specific Grades"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Slider
                      name="gradeBand"
                      value={range.gradeBand}
                      min={5}
                      max={12}
                      onChange={(e,v) => this.onRangeSliderChange(e,v,"gradeBand")}
                      onChangeCommitted={this.onRangeSliderChangeCommitted}
                      valueLabelDisplay="auto"
                      aria-labelledby="grade-band-range-slider"
                      getAriaValueText={this.gradeValueText}
                      disabled={!checkbox.gradesOnly}
                      color="primary"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="agesOnly"
                          value={checkbox.agesOnly}
                          onChange={(e) => this.onCheckboxChange(e)}
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                          color="primary"
                        />
                      }
                      label="Specific Ages"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Slider
                      name="ageGroup"
                      value={range.ageGroup}
                      min={7}
                      max={22}
                      onChange={(e,v) => this.onRangeSliderChange(e,v,"ageGroup")}
                      onChangeCommitted={this.onRangeSliderChangeCommitted}
                      valueLabelDisplay="auto"
                      aria-labelledby="age-group-range-slider"
                      getAriaValueText={this.ageValueText}
                      disabled={!checkbox.agesOnly}
                      color="primary"
                    />
                  </Grid>
              </Grid>
              </Grid>
              </Box>
              </AccordionDetails>

            </Accordion>
          </Box>

          <Box mt={6} mb={10}>
            <PercentageBar fraction={fraction} />
          </Box>
          

          <Grid container spacing={2}>
          {filtered.length > 0 &&
          filtered.map(entry => {
            return (
              <Grid key={`${entry.programName}-${entry.orgName}`} item xs={12} sm={6} md={4}>
                <ProgramCard data={entry} key={`${entry.programName}-${entry.orgName}-card`} />
              </Grid>
            );
          })
          }
          </Grid>
        </Box>
        
      </Box>
      </div>
    );
  }
}

export default withStyles(styles)(App);
