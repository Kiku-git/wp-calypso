/**
 * @format
 * @jest-environment jsdom
 */

/**
 * External dependencies
 */
import { shallow } from 'enzyme';
import React from 'react';
import { identity, noop } from 'lodash';

/**
 * Internal dependencies
 */
import { CreditCardFormFieldsUX } from '../';
import { shouldRenderAdditionalCountryFields } from 'lib/checkout/processor-specific';

jest.mock( 'i18n-calypso', () => ( {
	localize: x => x,
} ) );

jest.mock( 'lib/checkout/processor-specific', () => {
	return {
		shouldRenderAdditionalCountryFields: jest.fn( false ),
	};
} );

// Gets rid of warnings such as 'UnhandledPromiseRejectionWarning: Error: No available storage method found.'
jest.mock( 'lib/user', () => () => {} );

const defaultProps = {
	card: {},
	countriesList: [],
	eventFormName: 'A fine form',
	translate: identity,
	isFieldInvalid: identity,
	onFieldChange: noop,
	isNewTransaction: true,
};

describe( 'CreditCardFormFieldsUX', () => {
	test( 'should have `CreditCardFormFieldsUX` class', () => {
		const wrapper = shallow( <CreditCardFormFieldsUX { ...defaultProps } /> );
		expect( wrapper.find( '.credit-card-form-fields' ) ).toHaveLength( 1 );
	} );

	test( 'should not render ebanx fields', () => {
		const wrapper = shallow( <CreditCardFormFieldsUX { ...defaultProps } /> );
		expect( wrapper.find( 'CountrySpecificPaymentFields' ) ).toHaveLength( 0 );
	} );

	describe( 'with ebanx activated', () => {
		beforeAll( () => {
			shouldRenderAdditionalCountryFields.mockReturnValue( true );
		} );
		afterAll( () => {
			shouldRenderAdditionalCountryFields.mockReturnValue( false );
		} );

		test( 'should display Ebanx fields when an Ebanx payment country is selected and there is a transaction in process', () => {
			const wrapper = shallow( <CreditCardFormFieldsUX { ...defaultProps } /> );
			wrapper.setProps( { card: { country: 'BR' } } );
			expect( wrapper.find( 'CountrySpecificPaymentFields' ) ).toHaveLength( 1 );
		} );

		test( 'should not display Ebanx fields when there is a transaction in process', () => {
			const wrapper = shallow( <CreditCardFormFieldsUX { ...defaultProps } /> );
			wrapper.setProps( { card: { country: 'BR' }, isNewTransaction: false } );
			expect( wrapper.find( 'CountrySpecificPaymentFields' ) ).toHaveLength( 0 );
		} );
	} );
} );
