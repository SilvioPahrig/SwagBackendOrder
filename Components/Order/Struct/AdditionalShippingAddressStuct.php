<?php declare(strict_types=1);


namespace SwagBackendOrder\Components\Order\Struct;

class AdditionalShippingAddressStuct
{

    /** @var string */
    private $salutation;
    /** @var string */
    private $firstName;
    /** @var string */
    private $lastName;
    /** @var string */
    private $street;
    /** @var string */
    private $zipcode;
    /** @var string */
    private $city;
    /** @var integer */
    private $countryId;
    /** @var string */
    private $additionalAddressLine1;
    /** @var string */
    private $company;

    public function fromArray(array $address)
    {
        $this->setSalutation($address['salutation']);
        $this->setFirstName($address['firstname']);
        $this->setLastName($address['lastname']);
        $this->setStreet($address['street']);
        $this->setZipcode($address['zipcode']);
        $this->setCity($address['city']);
        $this->setCountryId((int)$address['country']);
        $this->setAdditionalAddressLine1($address['additionalAddressLine1']);
        $this->setCompany($address['company']);
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

    /**
     * @return string
     */
    public function getStreet(): ?string
    {
        return $this->street;
    }

    /**
     * @param string $street
     */
    public function setStreet(string $street): void
    {
        $this->street = $street;
    }

    /**
     * @return string
     */
    public function getZipcode(): ?string
    {
        return $this->zipcode;
    }

    /**
     * @param string $zipcode
     */
    public function setZipcode(string $zipcode): void
    {
        $this->zipcode = $zipcode;
    }

    /**
     * @return string
     */
    public function getCity(): ?string
    {
        return $this->city;
    }

    /**
     * @param string $city
     */
    public function setCity(string $city): void
    {
        $this->city = $city;
    }

    /**
     * @return int
     */
    public function getCountryId(): ?int
    {
        return $this->countryId;
    }

    /**
     * @param int $countryId
     */
    public function setCountryId(int $countryId): void
    {
        $this->countryId = $countryId;
    }

    /**
     * @return string
     */
    public function getAdditionalAddressLine1(): ?string
    {
        return $this->additionalAddressLine1;
    }

    /**
     * @param string $additionalAddressLine1
     */
    public function setAdditionalAddressLine1(string $additionalAddressLine1): void
    {
        $this->additionalAddressLine1 = $additionalAddressLine1;
    }

    /**
     * @return string
     */
    public function getCompany(): ?string
    {
        return $this->company;
    }

    /**
     * @param string $company
     */
    public function setCompany(string $company): void
    {
        $this->company = $company;
    }
}
