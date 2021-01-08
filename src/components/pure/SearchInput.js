import React, {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import Creatable from "react-select/creatable"
import {translate} from "react-i18next"
import isEqual from "lodash/isEqual"
import lodashGet from "lodash/get"


const SearchInput = (props) => {

  const {t, fixedTagsStr} = props

  const [allOptions, setAllOptions] = useState([])
  const [options, setOptions] = useState([])
  const [prominentOptions, setProminentOptions] = useState([])
  const prevAllTags = useRef([])

  useEffect(() => {
    // const prominentOptions = props.prominentTags.map(tag => ({label: `#${tag}`, value: `#${tag}`}))

    const {prominentOptions} = props
    setProminentOptions(prominentOptions)
    setOptions(prominentOptions)
  }, [props.prominentOptions])

  useEffect(() => {
    if (!isEqual(prevAllTags.current, props.allTags)) {
      prevAllTags.current = props.allTags
      const options = props.allTags.map(tag => ({label: `#${tag}`, value: `#${tag}`}))

      setAllOptions(options)
    }
  }, [props.allTags])


  const filterOptions = (input) => {
    const searchString = input.toLowerCase().trim();
    if (searchString.length === 0) {
      setOptions(prominentOptions)
      return
    }

    const res = allOptions.filter(d => d.label.match(searchString));

    const newOptions = res.slice(0, 5)

    setOptions(newOptions)
  }

  const onInputChange = (input, actionMeta) => {
    const {action} = actionMeta
    if (action === "input-blur" || action === "menu-close") {
      return
    }

    const tokens = input.split(' ')
    const lastToken = tokens[tokens.length-1].trim()
    onChange(input)
    filterOptions(lastToken)
  }

  const handleChange = (newValue, actionMeta) => {
    // TODO: dispatch on change
    if (!!newValue && newValue.length) {
      let newInputValue = props.searchText
      if (!newValue.value) {
        newInputValue = ''
      }
      else if (newInputValue.length && newInputValue.slice(-1) === ' ') {
        newInputValue = `${newInputValue} ${newValue[0].value}`
      } else {
        const tokens = props.searchText.trim().split(" ").filter(t => t.length)
        tokens.pop()
        tokens.push(newValue[0].value)
        newInputValue = tokens.join(' ')
      }

      onChange(newInputValue)
    }
  };

  const onChange = (newInputValue) => {
    props.onChange(newInputValue)
  }

  return (
    <Recommender
      createOptionPosition="first"
      tabIndex={1}
      autoFocus={false}
      delimeter=" "
      formatCreateLabel={(inputValue) => (inputValue)}
      filterOption={(option) => true}
      isMulti
      styles={{
        control: (provided, state) => ({
          ...provided,
          border: 'none',
          boxShadow: 'none'
        }),
        menu: (provided, state) => ({
          ...provided,
          width: '85%',
          zIndex: 4
        })
      }}
      onBlur={() => {}}
      onInputChange={onInputChange}
      onChange={handleChange}
      onKeyDown={props.onKeyDown}
      options={options}
      placeholder={fixedTagsStr || t("searchbar.placeholder")}
      inputValue={props.searchText}
      value={[]}
    />
  )
}

const mapStateToProps = ({search, customizations}) => {
  return {
    allTags: search.tags.map(tagPair => tagPair[0]),
    prominentOptions: lodashGet(customizations, "dropdowns.categories", [])
  }
}

export default translate('translation')(connect(mapStateToProps)(SearchInput))

const Recommender = styled(Creatable)`
  font-size: 0.9em !important;
  line-height: 1em !important;
  font-weight: 100;
  padding-left: 2.7em !important;
  padding-right: 0.5em !important;
  // z-index: 999 !important;
  margin-top: 2px;
`