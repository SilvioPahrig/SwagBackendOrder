<?php
/**
 * (c) shopware AG <info@shopware.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace SwagBackendOrder\Components\Order\Hydrator;

use DateTime;
use SwagBackendOrder\Components\Order\Struct\OrderStruct;

class OrderHydrator
{
    /**
     * @var PositionHydrator
     */
    private $positionHydrator;

    /**
     * @param PositionHydrator $positionHydrator
     */
    public function __construct(PositionHydrator $positionHydrator)
    {
        $this->positionHydrator = $positionHydrator;
    }

    /**
     * @param \Enlight_Controller_Request_Request $request
     *
     * @return OrderStruct
     */
    public function hydrateFromRequest(\Enlight_Controller_Request_Request $request)
    {
        $data = $request->getParams();
        $data = $data['data'];

        $orderStruct = new OrderStruct();

        $orderStruct->setCustomerId((int) $data['customerId']);


        $orderStruct->setBillingAddressId((int) $data['billingAddressId']);
        if ($data['additionalBillingAddress'][0]['newBillingAddressValues']) {
            $orderStruct->setAdditionalBillingAddressData($data['additionalBillingAddress'][0]);
        }

        if ($data['additionalShippingAddress'][0]['billingAsShippingType'] === 'shipping' &&
            $data['shippingAddressId']
        ) {
            $orderStruct->setShippingAddressId($data['shippingAddressId']);
        } elseif ($data['additionalShippingAddress'][0]['billingAsShippingType'] === 'other') {
            $orderStruct->setAdditionalShippingAddressData($data['additionalShippingAddress'][0]);
        } else {
            $orderStruct->setShippingAddressId($data['billingAddressId']);
        }

        $orderStruct->setPaymentId((int) $data['paymentId']);
        $orderStruct->setDispatchId((int) $data['dispatchId']);
        $orderStruct->setLanguageShopId((int) $data['languageShopId']);
        $orderStruct->setCurrencyId((int) $data['currencyId']);

        $orderStruct->setCurrency((string) $data['currency']);
        $orderStruct->setDeviceType((string) $data['desktopType']);

        $orderStruct->setNetOrder((bool) $data['displayNet']);
        $orderStruct->setTaxFree((bool) $data['taxFree']);
        $orderStruct->setSendMail((bool) $data['sendMail']);

        $orderStruct->setTotal((float) $data['total']);
        $orderStruct->setTotalWithoutTax((float) $data['totalWithoutTax']);
        $orderStruct->setShippingCostsNet((float) $data['shippingCostsNet']);
        $orderStruct->setShippingCosts((float) $data['shippingCosts']);
        $orderStruct->setShippingCostsTaxRate((float) $data['shippingCostsTaxRate']);
        if (!empty($data['shippingDate'])) {
            $orderStruct->setShippingDate(new DateTime($data['shippingDate']));
        }
        $orderStruct->setAttributes($data['orderAttribute'][0]);

        foreach ($data['position'] as $position) {
            $positionStruct = $this->positionHydrator->hydrate($position);
            $orderStruct->addPosition($positionStruct);
        }

        return $orderStruct;
    }
}
