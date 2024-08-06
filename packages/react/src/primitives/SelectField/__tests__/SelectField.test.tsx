import * as React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ComponentClassName } from '@aws-amplify/ui';
import { SelectField } from '../SelectField';
import {
  testFlexProps,
  expectFlexContainerStyleProps,
} from '../../Flex/__tests__/Flex.test';
import { AUTO_GENERATED_ID_PREFIX } from '../../utils/useStableId';
import { ERROR_SUFFIX, DESCRIPTION_SUFFIX } from '../../../helpers/constants';

describe('SelectField', () => {
  const className = 'my-select';
  const descriptiveText = 'This is a descriptive text';
  const id = 'my-select';
  const label = 'Number';
  const role = 'combobox';
  const testId = 'test-select';
  const errorMessage = 'This is an error message';
  describe('Flex wrapper', () => {
    it('should render default and custom classname', async () => {
      render(
        <SelectField label={label} testId={testId} className={className}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const selectField = await screen.findByTestId(testId);
      expect(selectField).toHaveClass(className);
      expect(selectField).toHaveClass(ComponentClassName.Field);
      expect(selectField).toHaveClass(ComponentClassName.SelectField);
    });

    it('should render all flex style props', async () => {
      render(
        <SelectField label={label} testId={testId} {...testFlexProps}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );
      const selectField = await screen.findByTestId(testId);
      expectFlexContainerStyleProps(selectField);
    });
  });

  describe('Label', () => {
    it('should render expected field classname', async () => {
      render(
        <SelectField label={label}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const labelElelment = await screen.findByText(label);
      expect(labelElelment).toHaveClass(ComponentClassName.Label);
    });

    it('should match select id', async () => {
      render(
        <SelectField label={label}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );
      const labelElelment = await screen.findByText(label);
      const select = await screen.findByRole(role);
      expect(labelElelment).toHaveAttribute('for', select.id);
    });

    it('should have `amplify-visually-hidden` class when labelHidden is true', async () => {
      render(
        <SelectField label={label} labelHidden>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const labelElelment = await screen.findByText(label);
      expect(labelElelment).toHaveClass('amplify-visually-hidden');
    });
  });

  describe('Select control', () => {
    it('should render expected id for select control', async () => {
      render(
        <SelectField id={id} label={label}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const select = await screen.findByRole(role);
      expect(select).toHaveAttribute('id', id);
    });

    it('should forward ref to DOM element', async () => {
      const ref = React.createRef<HTMLSelectElement>();
      render(
        <SelectField id={id} label={label} ref={ref}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      await screen.findByRole(role);
      expect(ref.current?.nodeName).toBe('SELECT');
    });

    it('should render labeled select field when id is provided', async () => {
      render(
        <SelectField id={id} label={label}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );
      const field = await screen.findByLabelText(label);
      expect(field).toHaveClass(ComponentClassName.Select);
      expect(field.id).toBe(id);
    });

    it('should render labeled select when id is not provided, and is autogenerated', async () => {
      render(
        <SelectField label={label}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );
      const field = await screen.findByLabelText(label);
      expect(field.id.startsWith(AUTO_GENERATED_ID_PREFIX)).toBe(true);
      expect(field).toHaveClass(ComponentClassName.Select);
    });
  });

  it('should render the state attributes', async () => {
    render(
      <SelectField label={label} className={className} isDisabled isRequired>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </SelectField>
    );

    const select = await screen.findByRole(role);
    expect(select).toBeDisabled();
    expect(select).toBeRequired();
  });

  it('should render the multiple attribute', async () => {
    render(
      <SelectField label={label} className={className} isMultiple>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </SelectField>
    );

    const select = await screen.findByRole('listbox');
    expect(select).toHaveAttribute('multiple');
  });

  it('should render the size attribute', async () => {
    render(
      <SelectField label={label} className={className} selectSize={2}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </SelectField>
    );

    const select = await screen.findByRole('listbox');
    expect(select).toHaveAttribute('size', '2');
  });

  it('should set size and variation classes', async () => {
    render(
      <SelectField label={label} testId={testId} size="small" variation="quiet">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </SelectField>
    );

    const selectField = await screen.findByTestId(testId);
    const select = await screen.findByRole(role);
    expect(selectField).toHaveClass(`${ComponentClassName.Field}--small`);
    expect(select).toHaveClass(`${ComponentClassName.Select}--quiet`);
  });

  it('should render size classes for SelectField', async () => {
    render(
      <div>
        <SelectField label={label} testId="small" size="small">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
        <SelectField label={label} testId="large" size="large">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      </div>
    );

    const small = await screen.findByTestId('small');
    const large = await screen.findByTestId('large');

    expect(small.classList).toContain(`${ComponentClassName['Field']}--small`);
    expect(large.classList).toContain(`${ComponentClassName['Field']}--large`);
  });

  it('can set defaultValue', async () => {
    render(
      <SelectField label={label} defaultValue="1">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </SelectField>
    );

    const select = await screen.findByRole(role);
    expect(select).toHaveValue('1');
  });

  it('has aria-invalid attribute when hasError is true', async () => {
    render(
      <SelectField label={label} hasError errorMessage="error">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </SelectField>
    );
    const select = await screen.findByRole(role);
    expect(select).toHaveAttribute('aria-invalid');
  });

  it('should fire event handlers', async () => {
    const onChange = jest.fn();
    render(
      <SelectField label={label} value="1" onChange={onChange}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </SelectField>
    );
    const select = await screen.findByRole(role);
    await act(async () => {
      await userEvent.selectOptions(select, '2');
    });
    expect(onChange).toHaveBeenCalled();
  });

  describe('Descriptive message', () => {
    it('renders when descriptiveText is provided', () => {
      render(
        <SelectField label={label} descriptiveText={descriptiveText}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const descriptiveField = screen.queryByText(descriptiveText);
      expect(descriptiveField).toContainHTML(descriptiveText);
    });

    it('should map to descriptive text correctly', async () => {
      render(
        <SelectField label={label} descriptiveText={descriptiveText}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const select = await screen.findByRole(role);
      expect(select).toHaveAccessibleDescription(descriptiveText);
    });
  });

  describe('Error messages', () => {
    it("don't show when hasError is false", () => {
      render(
        <SelectField label={label} errorMessage={errorMessage}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const errorText = screen.queryByText(errorMessage);
      expect(errorText).not.toBeInTheDocument();
    });

    it('show when hasError and errorMessage', () => {
      render(
        <SelectField label={label} errorMessage={errorMessage} hasError>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );
      const errorText = screen.queryByText(errorMessage);
      expect(errorText?.innerHTML).toContain(errorMessage);
    });
  });

  describe('Options', () => {
    it('correctly maps the options prop to corresponding option tags with matching value, label and children', async () => {
      const optionStrings = ['lions', 'tigers', 'bears'];

      render(<SelectField label={label} options={optionStrings}></SelectField>);

      const selectFieldOptions = await screen.findAllByRole('option');
      expect(selectFieldOptions.length).toBe(optionStrings.length);

      selectFieldOptions.forEach((option, index) => {
        const optionString = optionStrings[index];
        expect(option).toHaveAttribute('value', optionString);
        expect(option).toHaveAttribute('label', optionString);
        expect(option.innerHTML).toBe(optionString);
      });
    });

    it('logs a warning to the console if the customer passes both children and options', () => {
      const warningMessage =
        'Amplify UI: <SelectField> component  defaults to rendering children over `options`. When using the `options` prop, omit children.';

      // add empty mockImplementation to prevent logging output to the console
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      const optionStrings = ['lions', 'tigers', 'bears'];
      render(
        <SelectField label={label} options={optionStrings}>
          <option value="lions">lions</option>
          <option value="tigers">tigers</option>
          <option value="bears">bears</option>
        </SelectField>
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(warningMessage);
    });
  });

  describe('aria-describedby test', () => {
    const errorMessage = 'This is an error message';
    const descriptiveText = 'Description';
    it('when hasError, include id of error component and describe component in the aria-describedby', async () => {
      render(
        <SelectField
          label={label}
          descriptiveText={descriptiveText}
          errorMessage={errorMessage}
          hasError
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const select = await screen.findByLabelText(label);
      const ariaDescribedBy = select.getAttribute('aria-describedby');
      const descriptiveTextElement = screen.queryByText(descriptiveText);
      const errorTextElement = screen.queryByText(errorMessage);
      expect(
        errorTextElement?.id && errorTextElement?.id.endsWith(ERROR_SUFFIX)
      ).toBe(true);
      expect(
        descriptiveTextElement?.id &&
          descriptiveTextElement?.id.endsWith(DESCRIPTION_SUFFIX)
      ).toBe(true);
      expect(
        errorTextElement?.id &&
          descriptiveTextElement?.id &&
          ariaDescribedBy ===
            `${errorTextElement.id} ${descriptiveTextElement.id}`
      ).toBe(true);
    });

    it('only show id of describe component in aria-describedby when hasError is false', async () => {
      render(
        <SelectField
          label={label}
          descriptiveText={descriptiveText}
          errorMessage={errorMessage}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const select = await screen.findByLabelText(label);
      const ariaDescribedBy = select.getAttribute('aria-describedby');
      const descriptiveTextElement = screen.queryByText(descriptiveText);
      expect(
        descriptiveTextElement?.id &&
          ariaDescribedBy?.startsWith(descriptiveTextElement?.id)
      ).toBe(true);
    });

    it('aria-describedby should be empty when hasError is false and descriptiveText is empty', async () => {
      render(
        <SelectField label={label} errorMessage={errorMessage}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </SelectField>
      );

      const select = await screen.findByLabelText(label);
      const ariaDescribedBy = select.getAttribute('aria-describedby');
      expect(ariaDescribedBy).toBeNull();
    });
  });
});
