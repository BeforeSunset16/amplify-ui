import * as React from 'react';
import { classNames, createComponentClasses } from '@aws-amplify/ui';

import { BaseAccordionItemProps, AccordionItemProps } from './types';
import { primitiveWithForwardRef } from '../utils/primitiveWithForwardRef';
import { ForwardRefPrimitive, Primitive } from '../types/view';
import { View } from '../View';
import { AccordionContext, AccordionItemContext } from './AccordionContext';

const accordionClasses = createComponentClasses({ name: 'accordion' });

const AccordionItemPrimitive: Primitive<AccordionItemProps, 'details'> = (
  { children, className, value, as = 'details', ...rest },
  ref
) => {
  const context = React.useContext(AccordionContext);
  const open = value ? context?.value?.includes(value) : undefined;

  return (
    <AccordionItemContext.Provider value={value}>
      <View
        {...rest}
        open={open}
        ref={ref}
        as={as}
        className={classNames(
          accordionClasses({ _element: 'item' }),
          className
        )}
      >
        {children}
      </View>
    </AccordionItemContext.Provider>
  );
};

/**
 * [📖 Docs](https://ui.docs.amplify.aws/react/components/accordion)
 */
export const AccordionItem: ForwardRefPrimitive<
  BaseAccordionItemProps,
  'details'
> = primitiveWithForwardRef(AccordionItemPrimitive);

AccordionItem.displayName = 'AccordionItem';
