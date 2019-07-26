//
//{namespace name=backend/swag_backend_order/view/customer_information}
//{block name="backend/create_backend_order/view/customer_information/billing"}
//
Ext.define('Shopware.apps.SwagBackendOrder.view.main.CustomerInformation.Billing', {

    /**
     * extends from the extjs standard panel component
     */
    extend: 'Ext.panel.Panel',

    alias: 'widget.createbackendorder-customer-billing',

    /**
     * alternate class name as a second identifier
     */
    alternateClassName: 'SwagBackendOrder.view.main.CustomerInformation.Billing',

    bodyPadding: 0,

    flex: 1,

    autoScroll: true,

    snippets: {
        title: '{s name="swag_backend_order/customer_information/billing/title"}Billing address{/s}',
        salutation: {
            mister: '{s name="swag_backend_order/customer_information/salutation/mister"}Mr{/s}',
            miss: '{s name="swag_backend_order/customer_information/salutation/miss"}Ms{/s}',
            salutation: '{s name="salutation"}Salutation{/s}'
        },
        firstname: '{s name="firstname"}Firstname{/s}',
        lastname: '{s name="lastname"}Lastname{/s}',
        checkBoxNewBillingAddress: '{s name=checkBoxNewBillingAddress}Other address{/s}',
    },

    paddingRight: 5,

    initComponent: function () {
        var me = this;

        me.title = me.snippets.title;

        /**
         * gets the customer store and loads the selected customer
         */
        me.customerStore = me.subApplication.getStore('Customer');
        me.customerStore.on('load', function () {
            if (Ext.isObject(me.customerStore) && me.customerStore.count() == 1) {
                me.billingStore = me.customerStore.getAt(0).billing();
                me.billingAddressComboBox.bindStore(me.billingStore);

                me.resetFields();
            }
        });

        me.items = me.createBillingItems();

        me.callParent(arguments);
    },

    /**
     * register events
     */
    registerEvents: function () {
        this.addEvents(
            'selectBillingAddress'
        );
    },

    /**
     * creates the billing combobox and the data view for the selected address
     */
    createBillingItems: function () {
        var me = this,
            billingAddressTemplateStore;

        me.billingAddressComboBox = Ext.create('Ext.form.field.ComboBox', {
            name: 'billingAddresses',
            queryMode: 'local',
            height: 35,
            store: me.billingStore,
            displayField: 'displayField',
            valueField: 'displayField',
            allowBlank: false,
            tpl: me.createBillingAddressComboTpl(),
            anchor: '100%',
            forceSelection: true,
            listConfig: {
                maxHeight: 200
            },
            listeners: {
                'select': function (comboBox, record) {
                    me.fireEvent('selectBillingAddress', record[0], me);

                    billingAddressTemplateStore = Ext.create('Ext.data.Store', {
                        model: 'Shopware.apps.SwagBackendOrder.model.Address',
                        data: record[0].data
                    });

                    me.dataView = Ext.create('Ext.view.View', {
                        id: 'billingDataView',
                        name: 'billingDataView',
                        store: billingAddressTemplateStore,
                        tpl: me.createBillingTemplate(),
                        layout: 'fit'
                    });
                    
                    me.billingPanelLeft.remove('billingDataView', true);
                    me.billingPanelLeft.add(me.dataView);
                    me.billingPanelLeft.doLayout();

                }
            }
        });

        me.billingPanelLeft = Ext.create('Ext.panel.Panel', {
            flex: 1,
            items: me.billingAddressComboBox,
            border: false,
        });

        me.billingPanleRight = Ext.create('Ext.panel.Panel', {
            flex: 2,
            items: me.getAdditionalBillingAddressForm(),
            border: false,
            padding: '0 0 0 30',
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            defaults: {
                anchor: '95%',
                labelWidth: 95,
                hidden: true,
                listeners: {
                    change: function (el, newValue, oldValue) {
                        me.fireEvent('changeAdditionalBilling', el, newValue);
                    }
                }
            }
        });

        return me.billingPanle = [{
            xtype: 'panel',
            border: false,
            bodyPadding: 10,
            defaults: {
                anchor: '100%'
            },
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                me.billingPanelLeft,
                me.billingPanleRight
            ]
        }];
    },

    getAdditionalBillingAddressForm: function () {
        var me = this;
        return me.AdditionalBillingAddressForm = [
            {
                xtype: 'checkbox',
                boxLabel: me.snippets.checkBoxNewBillingAddress,
                name: 'newBillingAddressValues',
                inputValue: true,
                uncheckedValue: false,
                labelWidth: 100,
                hidden: false,
                listeners: {
                    change: me.onChangeNewBillingAddressValues,
                    scope: me
                }
            },
            {
                xtype: 'combobox',
                fieldLabel: me.snippets.salutation.salutation,
                valueField: 'value',
                displayField: 'label',
                name: 'salutation',
                store: Ext.create('Shopware.apps.Base.store.Salutation').load(),
                listeners: {
                    select: function (el, record) {
                        me.fireEvent('changeAdditionalBilling', el, record[0].data.id);
                    },
                    scope: me
                },
                allowBlank: false,
            },
            {
                xtype: 'textfield',
                name: 'lastName',
                fieldLabel: me.snippets.lastname,
                allowBlank: false,
            },
            {
                xtype: 'textfield',
                name: 'firstName',
                fieldLabel: me.snippets.firstname,
                allowBlank: false,
            }
        ];
    },

    onChangeNewBillingAddressValues: function (el, newValue) {
        var me = this;

        if (newValue === true) {
            me.showNewBillingForm()
        } else {
            me.hiddeNewBillingForm()
        }
        me.fireEvent('changeAdditionalBilling', el, newValue);
    },

    showNewBillingForm: function () {
        var me = this;
        me.billingPanleRight.items.items[1].show();
        me.billingPanleRight.items.items[2].show();
        me.billingPanleRight.items.items[3].show();
    },

    hiddeNewBillingForm: function () {
        var me = this;
        me.billingPanleRight.items.items[1].hide();
        me.billingPanleRight.items.items[2].hide();
        me.billingPanleRight.items.items[3].hide();
    },

    /**
     * returns the template for the billing combox (display field)
     *
     * @returns { Ext.XTemplate }
     */
    createBillingAddressComboTpl: function () {
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

    /**
     * returns the XTemplate for the data view which shows the billing address
     *
     * @returns { Ext.XTemplate }
     */
    createBillingTemplate: function () {
        var me = this;

        me.billingTemplate = new Ext.XTemplate(
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
            '<span>{additionalAddressLine2}</span>',
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

        return me.billingTemplate;
    },

    resetFields: function () {
        var me = this;

        me.billingAddressComboBox.setValue('');
        me.remove('billingDataView', true);
        me.doLayout();
    }
});
//
//{/block}
