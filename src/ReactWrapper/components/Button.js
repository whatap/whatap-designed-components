import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const BTN_SIZES = [
  'large',
  'default',
  'small'
]

const BTN_TYPES = [
  'default',
  'primary',
  'warning'
]

const Button = ({ children, ...rest}) => {
  let componentClass = classNames(
      `wBtn${rest.theme ? `-${rest.theme}` : ''}`,
      `wBtn${rest.theme ? `-${rest.theme}` : ''}-${rest.type}`,
      `wBtn${rest.theme ? `-${rest.theme}` : ''}-${rest.size}`,
      {
        'wBtn-is-active': rest.isActive
      },
      rest.className
    );
    
  let type = rest.submit ? 'submit' : 'button';

  if (rest.href) {
    return (
      <a href={rest.href} className={componentClass}>
        {children}
      </a>
    )
  } else {
    return (
      <button type={type} className={componentClass}>
        {children}
      </button>
    )
  }
}

Button.propTypes = {
  size: PropTypes.oneOf(BTN_SIZES),
  type: PropTypes.oneOf(BTN_TYPES),
  isActive: PropTypes.bool,
  className: PropTypes.string,
  submit: PropTypes.bool,
  theme: PropTypes.string,
}
Button.defaultProps = {

}

export default Button;