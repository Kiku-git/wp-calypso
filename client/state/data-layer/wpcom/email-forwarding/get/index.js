/**
 * Internal dependencies
 */
import { EMAIL_FORWARDING_REQUEST } from 'state/action-types';
import { http } from 'state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'state/data-layer/wpcom-http/utils';
import {
	receiveEmailForwardingRequestSuccess,
	receiveEmailForwardingRequestFailure,
} from 'state/email-forwarding/actions';

import { registerHandlers } from 'state/data-layer/handler-registry';

export const requestEmailForwarding = action => {
	return http(
		{
			method: 'GET',
			path: `/domains/${ encodeURIComponent( action.domainName ) }/email`,
		},
		action
	);
};

export const receiveEmailForwardingSuccess = ( action, response ) => {
	if ( response.forwards ) {
		return receiveEmailForwardingRequestSuccess( action.domainName, response.forwards );
	}
	return receiveEmailForwardingRequestFailure( action.domainName, true );
};

export const receiveEmailForwardingError = ( action, error ) => {
	return receiveEmailForwardingRequestFailure( action.domainName, error );
};

registerHandlers( 'state/data-layer/wpcom/email-forwarding/get/index.js', {
	[ EMAIL_FORWARDING_REQUEST ]: [
		dispatchRequest( {
			fetch: requestEmailForwarding,
			onSuccess: receiveEmailForwardingSuccess,
			onError: receiveEmailForwardingError,
		} ),
	],
} );