import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';
import fieldHolder from 'components/FieldHolder/FieldHolder';
import url from 'url';

class TagField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };

    this.onChange = this.onChange.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }

  onChange(value) {
    this.setState({
      value: value
    });

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value);
    }
  }

  /**
   * Required to prevent TagField being cleared on blur
   *
   * @link https://github.com/JedWatson/react-select/issues/805
   */
  handleOnBlur (e) {

  }

  getOptions(input) {
    const { lazyLoad, options, optionUrl, labelKey, valueKey } = this.props;

    if (!lazyLoad) {
      return Promise.resolve({ options });
    }

    if (!input) {
      return Promise.resolve({ options: [] });
    }

    const fetchURL = url.parse(optionUrl, true);
    fetchURL.query.term = input;

    return fetch(url.format(fetchURL), { credentials: 'same-origin' })
      .then((response) => response.json())
      .then((json) => ({
        options: json.items.map(item => ({
          [labelKey]: item.Title,
          [valueKey]: item.Value,
        }))
      }));
  }

  render() {
    const {
      lazyLoad,
      options,
      creatable,
      ...passThroughAttributes
    } = this.props;

    const optionAttributes = lazyLoad
      ? { loadOptions: this.getOptions }
      : { options };

    let SelectComponent = Select;
    if (lazyLoad && creatable) {
      SelectComponent = Select.AsyncCreatable;
    } else if (lazyLoad) {
      SelectComponent = Select.Async;
    } else if (creatable) {
      SelectComponent = Select.Creatable;
    }

    passThroughAttributes.value = this.state.value;

    return (
      <SelectComponent
        {...passThroughAttributes}
        onChange={this.onChange}
        onBlur={this.handleOnBlur}
        inputProps={{ className: 'no-change-track' }}
        {...optionAttributes}
      />
    );
  }
}

TagField.propTypes = {
  name: PropTypes.string.isRequired,
  labelKey: PropTypes.string.isRequired,
  valueKey: PropTypes.string.isRequired,
  lazyLoad: PropTypes.bool.isRequired,
  creatable: PropTypes.bool.isRequired,
  multi: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  optionUrl: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};

TagField.defaultProps = {
  labelKey: 'Title',
  valueKey: 'Value',
  disabled: false
};

export { TextField as Component };

export default fieldHolder(TagField);
