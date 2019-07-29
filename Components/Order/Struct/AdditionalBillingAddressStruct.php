<?php declare(strict_types=1);


namespace SwagBackendOrder\Components\Order\Struct;

class AdditionalBillingAddressStruct
{

    /**
     * @var string mr|ms
     */
    private $salutation;

    /**
     * @var string
     */
    private $firstName;

    /**
     * @var string
     */
    private $lastName;

    /**
     * @param array $addressData
     */
    public function fromArray(array $addressData): void
    {
        $this->setFirstName($addressData['firstName']);
        $this->setLastName($addressData['lastName']);
        $this->setSalutation($addressData['salutation']);
    }

    /**
     * @return string
     */
    public function getSalutation(): ?string
    {
        return $this->salutation;
    }

    /**
     * @param string $salutation
     */
    public function setSalutation(string $salutation): void
    {
        $this->salutation = $salutation;
    }

    /**
     * @return string
     */
    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    /**
     * @param string $firstName
     */
    public function setFirstName(string $firstName): void
    {
        $this->firstName = $firstName;
    }

    /**
     * @return string
     */
    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    /**
     * @param string $lastName
     */
    public function setLastName(string $lastName): void
    {
        $this->lastName = $lastName;
    }
}
