//{block name="backend/create_backend_order/model/additional_billing_address"}
//
Ext.define('Shopware.apps.SwagBackendOrder.model.AdditionalBillingAddress', {

    extend: 'Ext.data.Model',

    fields: [
        { name: 'newBillingAddressValues', type: 'bool' },
        { name: 'salutation', type: 'string' },
        { name: 'lastName', type: 'string' },
        { name: 'firstName', type: 'string' }
    ]
});
//
//{/block}
