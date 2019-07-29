//{block name="backend/create_backend_order/model/additional_shipping_address"}
//
Ext.define('Shopware.apps.SwagBackendOrder.model.AdditionalShippingAddress', {

    extend: 'Ext.data.Model',

    fields: [
        { name: 'billingAsShippingType', type: 'string'},
        { name: 'salutation', type: 'string'},
        { name: 'firstname', type: 'string'},
        { name: 'lastname', type: 'string'},
        { name: 'street', type: 'string'},
        { name: 'zipcode', type: 'string'},
        { name: 'city', type: 'string'},
        { name: 'country', type: 'int'},
        { name: 'additionalAddressLine1', type: 'string'},
        { name: 'company', type: 'string'},
    ]
});
//
//{/block}
