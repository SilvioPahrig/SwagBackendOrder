//
// {namespace name="backend/swag_backend_order/view/customer_information"}
//{block name="backend/create_backend_order/view/customer_information/shipping"}
//
Ext.define('Shopware.apps.SwagBackendOrder.view.main.CustomerInformation.Shipping', {

    extend: 'Ext.panel.Panel',

    alternateClassName: 'SwagBackendOrder.view.main.CustomerInformation.Shipping',

    alias: 'widget.createbackendorder-customer-shipping',

    bodyPadding: 10,

    flex: 2,

    autoScroll: true,

    paddingRight: 5,

    snippets: {
        title: '{s name="swag_backend_order/customer_information/shipping/title"}Payment{/s}',
        billingAsShipping: '{s name="swag_backend_order/customer_information/shipping/billing_as_shipping"}Use billing address{/s}',
        salutation: {
            mister: '{s name="swag_backend_order/customer_information/salutation/mister"}Mr{/s}',
            miss: '{s name="swag_backend_order/customer_information/salutation/miss"}Ms{/s}'
        },
        fields: {
            salutation: {
                label: '{s name=salutation}Salutation{/s}'
            },
            firstname: '{s name=firstname}Firstname{/s}',
            title: '{s name=title}Title{/s}',
            lastname: '{s name=lastname}Lastname{/s}',
            street: '{s name=street}Street{/s}',
            zipcode: '{s name=zipcode}Zip code{/s}',
            city: '{s name=city}City{/s}',
            additionalAddressLine1: '{s name=additionalAddressLine1}Additional address line 1{/s}',
            country: '{s name=country}Country{/s}',
            state: '{s name=state}State{/s}',
            company: '{s name=company}Company{/s}',
            department: '{s name=department}Department{/s}',
            billingAsShipping: {
                billing: '{s name=selectionBilling}same like billing{/s}',
                shipping: '{s name=selectionShipping}select shipping{/s}',
                other: '{s name=selectionOther}other address{/s}'
            }
        }
    },

    initComponent: function () {
        var me = this;

        me.title = me.snippets.title;

        /**
         * gets the customer store and loads the selected customer
         */
        me.customerStore = me.subApplication.getStore('Customer');
        me.customerStore.on('load', function () {
            if (Ext.isObject(me.customerStore) && me.customerStore.count() == 1) {
                me.shippingStore = me.customerStore.getAt(0).shipping();
                me.shippingAddressComboBox.bindStore(me.shippingStore);
            }

            me.resetFields();
        });

        me.items = me.createShippingContainer();

        me.callParent(arguments);
    },

    registerEvents: function () {
        this.addEvents(
            'selectShippingAddress'
        );
    },

    createShippingContainer: function () {
        var me = this;

        me.sippingPanelLeft = Ext.create('Ext.panel.Panel', {
            flex: 1,
            items: me.createShippingItems(),
            border: false,
        });

        me.shippingPanleMiddel = Ext.create('Ext.panel.Panel', {
            flex: 2,
            items: me.getAddressFieldsColumn1(),
            border: false,
            padding: '0 30 0 10',
            hidden: true,
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            defaults: {
                xtype: 'textfield',
                labelWidth: 155,
                anchor: '95%',
                listeners: {
                    change: function (el, newValue, oldValue) {
                        me.fireEvent('changeAdditionalShipping', el, newValue);
                    }
                }
            }
        });

        me.shippingPanleRight = Ext.create('Ext.panel.Panel', {
            flex: 2,
            items: me.getAddressFieldsColumn2(),
            border: false,
            padding: '0 30 0 0',
            hidden: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'textfield',
                labelWidth: 155,
                anchor: '95%',
                listeners: {
                    change: function (el, newValue, oldValue) {
                        me.fireEvent('changeAdditionalShipping', el, newValue);
                    }
                }
            }
        });


        return Ext.create('Ext.container.Container', {
            layout: 'hbox',
            items: [
                me.sippingPanelLeft,
                me.shippingPanleMiddel,
                me.shippingPanleRight
            ]
        });
    },

    createShippingItems: function () {
        var me = this;

        /**
         * @TODO: renderer for the display field, correct value field
         */
        me.shippingAddressComboBox = Ext.create('Ext.form.field.ComboBox', {
            name: 'shippingAddresses',
            queryMode: 'local',
            store: me.shippingStore,
            flex: 1,
            disabled: true,
            displayField: 'displayField',
            valueField: 'displayField',
            listConfig: {
                maxHeight: 200
            },
            tpl: me.createShippingAddressComboTpl(),
            listeners: {
                'change': function (comboBox, value) {
                    var record = this.findRecordByValue(value);

                    me.fireEvent('selectShippingAddress', record);

                    if (record === false) {
                        // Do nothing if there is no corresponding record.
                        return;
                    }

                    var shippingAddressTemplateStore = Ext.create('Ext.data.Store', {
                        model: 'Shopware.apps.SwagBackendOrder.model.Address',
                        data: record.data
                    });

                    me.dataView = Ext.create('Ext.view.View', {
                        id: 'shippingDataView',
                        name: 'shippingDataView',
                        store: shippingAddressTemplateStore,
                        tpl: me.createShippingTemplate(),
                        layout: 'fit',
                        padding: '5 0 0 0'
                    });

                    me.remove('shippingDataView', true);
                    me.add(me.dataView);
                    me.doLayout();
                }
            }
        });

        me.billingAsShippingCheckbox = Ext.create('Ext.form.field.ComboBox', {
            flex: 1,
            boxLabel: me.snippets.billingAsShipping,
            name: 'billingAsShipping',
            id: 'billingAsShippingCheckBox',
            valueField: 'value',
            displayField: 'label',
            store: new Ext.data.Store({
                fields: ['value', 'label'],
                data: [
                    { value: 'billing', label: me.snippets.fields.billingAsShipping.billing },
                    { value: 'shipping', label: me.snippets.fields.billingAsShipping.shipping },
                    { value: 'other', label: me.snippets.fields.billingAsShipping.other }
                ]
            }),
            listeners: {
                select: me.onSelectBillingAsShipping,
                scope: me
            }
        });

        me.billingAsShippingCheckbox.select('billing');

        return [me.billingAsShippingCheckbox, me.shippingAddressComboBox];
    },

    getAddressFieldsColumn1: function () {
        var me = this;
        return [
            {
                xtype: 'combobox',
                name: 'salutation',
                triggerAction: 'all',
                fieldLabel: me.snippets.fields.salutation.label,
                editable: false,
                allowBlank: false,
                valueField: 'key',
                displayField: 'label',
                store: Ext.create('Shopware.apps.Base.store.Salutation').load(),
                listeners: {
                    select: function (el, record) {
                        me.fireEvent('changeAdditionalBilling', el, record[0].data.id);
                    },
                    scope: me
                }
            },
            {
                name: 'firstname',
                allowBlank: false,
                fieldLabel: me.snippets.fields.firstname,

            },
            {
                name: 'lastname',
                allowBlank: false,
                fieldLabel: me.snippets.fields.lastname,

            },
            {
                name: 'street',
                allowBlank: false,
                fieldLabel: me.snippets.fields.street,

            }
        ];
    },

    getAddressFieldsColumn2: function () {
        var me = this;
        return [
            {
                name: 'zipcode',
                allowBlank: false,
                fieldLabel: me.snippets.fields.zipcode,

            },
            {
                name: 'city',
                fieldLabel: me.snippets.fields.city,
                pageSize: 25,
                allowBlank: false,
            },
            {
                name: 'country',
                allowBlank: false,
                fieldLabel: me.snippets.fields.country,
                pageSize: 25,
                listeners: {
                    select: function (el, record) {
                        me.fireEvent('changeAdditionalBilling', el, record[0].data.id);
                    },
                    scope: me
                },
                store: me.getCountryStore(),
                xtype: 'pagingcombobox',
                valueField:'id',
                displayField: 'name'
            },
            {
                /* {if {config name=showAdditionAddressLine1} && {config name=requireAdditionAddressLine1}} */
                allowBlank: false,
                /* {/if} */
                name: 'additionalAddressLine1',
                fieldLabel: me.snippets.fields.additionalAddressLine1,
            },
            {
                name: 'company',
                fieldLabel: me.snippets.fields.company,

            },
        ];
    },

    onSelectBillingAsShipping: function (field, selectRecords) {
        var value = selectRecords[0].getData().value,
            me = this;
        me.fireEvent('selectBillingAsShippingAddress');

        if (value === 'billing') {
            me.disableShippingAddressComboBox();
            me.disableOtherAddressForm();
        } else if (value === 'shipping') {
            me.disableOtherAddressForm();
            me.shippingAddressComboBox.enable();
            me.shippingAddressComboBox.setValue(me.shippingStore.getAt(0).get(me.shippingAddressComboBox.valueField));
        } else if (value === 'other') {
            me.disableShippingAddressComboBox();
            me.shippingPanleRight.show();
            me.shippingPanleMiddel.show();
        }
    },

    disableOtherAddressForm: function () {
        var me = this;
        me.shippingPanleRight.hide();
        me.shippingPanleMiddel.hide();
    },

    disableShippingAddressComboBox: function () {
        var me = this;
        me.shippingAddressComboBox.disable();

        me.shippingAddressComboBox.setValue('');
        me.remove('shippingDataView', true);
        me.doLayout();
    },

    getCountryStore: function() {
        var selectionFactory = Ext.create('Shopware.attribute.SelectionFactory', {});
        var store = selectionFactory.createEntitySearchStore("Shopware\\Models\\Country\\Country");
        store.pageSize = 999;

        store.sort([{
            property: 'active',
            direction: 'DESC'
        }, {
            property: 'name',
            direction: 'ASC'
        }]);
        store.remoteSort = true;

        return store;
    },

    createShippingAddressComboTpl: function () {
        var me = this;

        return new Ext.XTemplate(
            '{literal}<tpl for=".">',
            '<div class= "x-combo-list-item x-boundlist-item">',
            '<tpl if="company">',
            '{company},<br/>',
            '</tpl>',
            '<tpl switch="salutation">',
            '<tpl case="mr">',
            me.snippets.salutation.mister + ' ',
            '<tpl case="ms">',
            me.snippets.salutation.miss + ' ',
            '</tpl>',
            '{firstname} {lastname},<br/>{zipcode} {city},<br/>{street}',
            '<tpl if="state">',
            ',<br/>{state}',
            '</tpl>',
            '<tpl if="country">',
            ',<br/>{country}',
            '</tpl>',
            '</div>',
            '</tpl>{/literal}'
        );
    },

    createShippingTemplate: function () {
        var me = this;

        return new Ext.XTemplate(
            '{literal}<tpl for=".">',
            '<div class="customeer-info-pnl">',
            '<div class="base-info">',
            '<p>',
            '<span>{company}</span>',
            '</p>',
            '<p>',
            '<tpl switch="salutation">',
            '<tpl case="mr">',
            me.snippets.salutation.mister + ' ',
            '<tpl case="ms">',
            me.snippets.salutation.miss + ' ',
            '</tpl>',
            '<span>{firstname}</span>&nbsp;',
            '<span>{lastname}</span>',
            '</p>',
            '<p>',
            '<span>{street}</span>',
            '</p>',
            '<tpl if="additionalAddressLine1">',
            '<p>',
            '<span>{additionalAddressLine1}</span>',
            '</p>',
            '</tpl>',
            '<tpl if="additionalAddressLine2">',
            '<p>',
            '<span>{additionalAddressLine1}</span>',
            '</p>',
            '</tpl>',
            '<p>',
            '<span>{zipcode}</span>&nbsp;',
            '<span>{city}</span>',
            '</p>',
            '<p>',
            '<span>{state}</span>',
            '</p>',
            '<p>',
            '<span>{country}</span>',
            '</p>',
            '</div>',
            '</div>',
            '</tpl>{/literal}'
        );
    },

    resetFields: function () {
        var me = this;

        me.shippingAddressComboBox.setValue('');
        me.remove('shippingDataView', true);
        me.doLayout();
    }
});
//
//{/block}
