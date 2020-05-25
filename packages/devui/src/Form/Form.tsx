import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import JSONSchemaForm from 'react-jsonschema-form';
import createStyledComponent from '../utils/createStyledComponent';
import styles from './styles';
import Button from '../Button';
import customWidgets from './widgets';
import { Theme } from '../utils/theme';

const FormContainer = createStyledComponent(styles, JSONSchemaForm);

interface Props {
  children?: React.ReactNode;
  submitText?: string;
  primaryButton?: boolean;
  noSubmit?: boolean;
  schema: unknown;
  uiSchema?: unknown;
  formData?: unknown;
  widgets?: unknown;
  theme?: Theme;
}

export default class Form extends (PureComponent || Component)<Props> {
  render() {
    const {
      widgets,
      children,
      submitText,
      primaryButton,
      noSubmit,
      ...rest
    } = this.props;
    return (
      <FormContainer {...rest} widgets={{ ...customWidgets, ...widgets }}>
        {noSubmit ? (
          <noscript />
        ) : (
          children || (
            <Button
              size="big"
              primary={primaryButton}
              theme={rest.theme}
              type="submit"
            >
              {submitText || 'Submit'}
            </Button>
          )
        )}
      </FormContainer>
    );
  }

  static propTypes = {
    children: PropTypes.any,
    submitText: PropTypes.string,
    primaryButton: PropTypes.bool,
    noSubmit: PropTypes.bool,
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    formData: PropTypes.any,
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    )
  };
}
